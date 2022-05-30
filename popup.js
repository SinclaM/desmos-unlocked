let setToText = document.getElementById("setToText");
let setToDefault = document.getElementById("setToDefault");
let setToDesmosDefault = document.getElementById("setToDesmosDefault");
let textbox = document.querySelector("textarea");
console.log(textbox);

chrome.storage.sync.get("autoCommands", function (data) {
    textbox.value = data.autoCommands;
});

setToText.onclick = function (element) {
    chrome.storage.sync.set({ autoCommands: textbox.value }, function () {});
};
setToDefault.onclick = function (element) {
    chrome.storage.sync.set(
        {
            autoCommands:
                "alpha beta sqrt theta Theta phi Phi pi Pi tau nthroot cbrt sum prod int ans percent infinity infty gamma Gamma delta Delta epsilon epsiv zeta eta kappa lambda Lambda mu xi Xi rho sigma Sigma chi Psi omega Omega",
        },
        function () {}
    );
    textbox.value =
        "alpha beta sqrt theta Theta phi Phi pi Pi tau nthroot cbrt sum prod int ans percent infinity infty gamma Gamma delta Delta epsilon epsiv zeta eta kappa lambda Lambda mu xi Xi rho sigma Sigma chi Psi omega Omega";
};
setToDesmosDefault.onclick = function (element) {
    chrome.storage.sync.set(
        {
            autoCommands:
                "alpha beta sqrt theta phi pi tau nthroot cbrt sum prod int ans percent infinity infty",
        },
        function () {}
    );
    textbox.value =
        "alpha beta sqrt theta phi pi tau nthroot cbrt sum prod int ans percent infinity infty";
};

// Log changes to storage for testing
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is "${newValue}".`
        );
    }
});

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
    return node;
}

// Populate the grid with fancy sliders for all the symbols -> shortcuts in dict.
async function populateGrid(templateID, gridID, dict) {
    let commands = await getStorageData("autoCommands");
    commands = commands.autoCommands.split(" ");
    let grid = document.getElementById(gridID);
    for (const symbol in dict) {
        grid.append(createGridItem(templateID, symbol, dict[symbol], commands));
    }
}

// Function to retreive the user config data corresponding to the given key
// e.g. getStorageData('autoCommands') -> 'alpha beta gamma'
const getStorageData = (key) =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.get(key, (result) =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(result)
        )
    );

// Function to add/remove user config data corresponding to a slider that was
// just clicked.
async function storeConfig() {
    let wordToStore = this.parentElement.parentElement.id;
    let opt = this.parentElement.parentElement.getAttribute('opt');
    let currentlyStored = await getStorageData(opt);
    currentlyStored = currentlyStored.autoCommands;
    if (this.checked) {
        if (currentlyStored !== "") {
            wordToStore = " " + wordToStore;
        }
        chrome.storage.sync.set(
            { autoCommands: currentlyStored + wordToStore },
            function () {}
        );
    } else {
        let newStorage = currentlyStored
            .split(" ")
            .filter((word) => word != wordToStore)
            .join(" ");
        chrome.storage.sync.set({ autoCommands: newStorage }, function () {});
    }
}

// basic symbols and their shortucts
let basic = {
    α: "alpha",
    β: "beta",
    γ: "gamma",
    ϝ: "digamma",
    Γ: "Gamma",
    δ: "delta",
    Δ: "Delta",
    ϵ: "epsilon",
    ε: "varepsilon",
    ζ: "zeta",
    η: "eta",
    θ: "theta",
    ι: "iota",
    κ: "kappa",
    ϰ: "varkappa",
    λ: "lambda",
    Λ: "Lambda",
    μ: "mu",
    ν: "nu",
    ξ: "xi",
    π: "pi",
    ϖ: "varpi",
    Π: "Pi",
    ρ: "rho",
    ϱ: "varrho",
    σ: "sigma",
    ς: "varsigma",
    Σ: "Sigma",
    τ: "tau",
    υ: "upsilon",
    Υ: "Upsilon",
    ϕ: "phi",
    φ: "varphi",
    Φ: "Phi",
    χ: "chi",
    ψ: "psi",
    Ψ: "Psi",
    ω: "omega",
    Ω: "Omega",
};

// Add all the dynamically loaded nodes to the DOM using templates and give
// sliders their funcionality
async function initialize() {
    await populateGrid("grid-item-template", "basic", basic);

    // Make the sliders actually update user configs when clicked
    document.querySelectorAll(".latex-item").forEach(function (item) {
        item.querySelector(".onoffswitch-checkbox").addEventListener(
            "click",
            storeConfig
        );
    });
}

// Make Desmos beautiful!
initialize();
