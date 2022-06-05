let setToDefault = document.getElementById("set-to-default");
let setToDesmosDefault = document.getElementById("set-to-desmos-default");

setToDefault.onclick = function (element) {
    massSet(
        Array.from(
            document.querySelectorAll(
                "#desmos-default .latex-item, #basic .latex-item"
            )
        )
            .map((item) => item.id)
            .filter(function (item) {
                return (
                    item !== "ge" &&
                    item !== "le" &&
                    item !== "ne" &&
                    item !== "pm" &&
                    item !== "mp"
                );
            }),
        "autoCommands"
    );
};

setToDesmosDefault.onclick = function (element) {
    massSet(
        Array.from(
            document.querySelectorAll("#desmos-default .latex-item")
        ).map((item) => item.id),
        "autoCommands"
    );
};

// Log changes to storage for testing
 browser.storage.onChanged.addListener(function (changes, namespace) {
     for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
         console.log(
             `Storage key "${key}" in namespace "${namespace}" changed.`,
             `Old value was "${oldValue}", new value is "${newValue}".`
         );
     }
 });

// Set many sliders at once. Used when the user presses a reset-to-default button.
// toSet is an array of all the autoCommands to be set.
function massSet(toSet, opt) {
    document.querySelectorAll(".grid .latex-item").forEach(function (item) {
        item.querySelector(".onoffswitch-checkbox").checked = toSet.includes(
            item.id
        );
    });

    // [opt] because otherwise it will assign the literal string "opt" as the field name.
    browser.storage.local.set({ [opt]: toSet.join(" ") });
}

// Create the DOM node for the items that will be placed in the grid.
// e.g. 'α alpha [slider]'
// Using templates allows the html for the popup to be much more concise,
// but then javascript must dynamically insert these into the DOM.
// Not sure what best practices are.
function createGridItem(templateID, symbol, shortcut, commands) {
    let html = document.getElementById(templateID).innerHTML;
    html = html.replace(/#symbol#/g, symbol);
    html = html.replace(/#shortcut#/g, shortcut);
    const node = new DOMParser().parseFromString(html, "text/html").body
        .firstElementChild;
    node.querySelector(".onoffswitch-checkbox").checked =
        commands.includes(shortcut);

    // Stop overflow of long shortcuts by letting them span both columns.
    // This feels like a bad way of styling this but oh well. 
    if (shortcut.length > 9) {
        node.style.gridColumn = "1 / span 2";
    }

    return node;
}

// Populate the grid with fancy sliders for all the symbols -> shortcuts in dict.
async function populateGrid(templateID, gridID, dict) {
    let commands = await getStorageData("autoCommands");
    commands = commands.autoCommands.split(" ");
    let grid = document.getElementById(gridID);
    for (const shortcut in dict) {
        grid.append(
            createGridItem(templateID, dict[shortcut], shortcut, commands)
        );
    }
}

// Function to retreive the user config data corresponding to the given key
// e.g. getStorageData('autoCommands') -> 'alpha beta gamma'
//const getStorageData = (key) =>
    //new Promise((resolve, reject) =>
        //browser.storage.local.get(key, (result) =>
            //browser.runtime.lastError
                //? reject(Error(browser.runtime.lastError.message))
                //: resolve(result)
        //)
    //);

async function getStorageData(key) {
    return value = await browser.storage.local.get(key);
}

// Function to add/remove user config data corresponding to a slider that was
// just clicked.
async function storeConfig() {
    let wordToStore = this.parentElement.parentElement.id;
    let opt = this.parentElement.parentElement.getAttribute("opt");
    let currentlyStored = await getStorageData(opt);
    currentlyStored = currentlyStored.autoCommands;
    if (this.checked) {
        if (currentlyStored !== "") {
            wordToStore = " " + wordToStore;
        }
        browser.storage.local.set(
            { autoCommands: currentlyStored + wordToStore }
        );
    } else {
        let newStorage = currentlyStored
            .split(" ")
            .filter((word) => word != wordToStore)
            .join(" ");
        browser.storage.local.set({ autoCommands: newStorage });
    }
}

// Add all the dynamically loaded nodes to the DOM using templates and give
// sliders their funcionality
async function initialize() {
    // Desmos default symbols and their shortcuts
    let desmosDefualtAutoCommands = {
        sqrt: "√",
        cbrt: "∛",
        nthroot: "∜",
        nthroot: "∜",
        sum: "Σ",
        prod: "∏",
        int: "∫",
        percent: "%",
        infinity: "∞",
        infty: "∞",
        alpha: "α",
        beta: "β",
        theta: "θ",
        pi: "π",
        tau: "τ",
        phi: "ϕ",
    };

    // basic shortucts and their symbols
    let basicAutoCommands = {
        gamma: "γ",
        digamma: "ϝ",
        Gamma: "Γ",
        delta: "δ",
        Delta: "Δ",
        epsilon: "ϵ",
        //varepsilon: "ε",
        zeta: "ζ",
        eta: "η",
        iota: "ι",
        kappa: "κ",
        //varkappa: "ϰ",
        lambda: "λ",
        Lambda: "Λ",
        mu: "μ",
        nu: "ν",
        xi: "ξ",
        //varpi: "ϖ",
        Pi: "Π",
        rho: "ρ",
        //varrho: "ϱ",
        sigma: "σ",
        //varsigma: "ς",
        Sigma: "Σ",
        upsilon: "υ",
        Upsilon: "Υ",
        //varphi: "φ",
        Phi: "Φ",
        chi: "χ",
        psi: "ψ",
        Psi: "Ψ",
        omega: "ω",
        Omega: "Ω",
        square: "□",
        mid: "|",
        parallel: "∥",
        nparallel: "∦",
        perp: "⊥",
        pm: "±",
        mp: "∓",
        to: "→",
        le: "≤",
        ge: "≥",
        ne: "≠",
        times: "×",
        div: "÷",
        approx: "≈",
    };

    let advancedAutoCommands = {
        dot: " ̇",
        hat: "ˆ",
        vec: " ⃗",
        bar: "¯",
        tidle: " ̃",
        langle: "⟨",
        rangle: "⟩",
        lVert: "||",
        rVert: "||",
        binom: "( )",
        coprod: "",
        frac: "",
        underline: "⎯",
        overline: "¯",
        overarc: "⌒",
        mathrm: "",
        mathit: "",
        mathbf: "",
        mathsf: "",
        overrightarrow: "→",
        overleftarrow: "←",
        overleftrightarrow: "⟷",
        MathQuillMathField: "",
    };

    await populateGrid(
        "grid-item-template",
        "desmos-default",
        desmosDefualtAutoCommands
    );
    await populateGrid("grid-item-template", "basic", basicAutoCommands);
    await populateGrid("grid-item-template", "advanced", advancedAutoCommands);

    // Make the sliders actually update user configs when clicked
    document.querySelectorAll(".latex-item").forEach(function (item) {
        item.querySelector(".onoffswitch-checkbox").addEventListener(
            "click",
            storeConfig
        );
    });
}

document.addEventListener("DOMContentLoaded", initialize)
