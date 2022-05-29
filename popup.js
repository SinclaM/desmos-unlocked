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

// Log changes to storage
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

const getStorageData = (key) =>
    new Promise((resolve, reject) =>
        chrome.storage.sync.get(key, (result) =>
            chrome.runtime.lastError
                ? reject(Error(chrome.runtime.lastError.message))
                : resolve(result)
        )
    );

async function storePreference() {
    let shortcut = this.parentElement.parentElement.id;
    let commands = await getStorageData("autoCommands");
    commands = commands.autoCommands;
    console.log(`shortcut is: ${shortcut}`);
    console.log(`autoCommands is: ${commands}`);
    console.log(`Attempting to update preferences.`);
    if (this.checked) {
        if (commands !== "") {
            shortcut = " " + shortcut;
        }
        chrome.storage.sync.set(
            { autoCommands: commands + shortcut },
            function () {}
        );
    } else {
        let newCommands = commands
            .split(" ")
            .filter((word) => word != shortcut)
            .join(" ");
        chrome.storage.sync.set({ autoCommands: newCommands }, function () {});
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

async function initialize() {
    await populateGrid("grid-item-template", "basic", basic);

    document.querySelectorAll(".latex-item").forEach(function (item) {
        item.querySelector(".onoffswitch-checkbox").addEventListener(
            "click",
            storePreference
        );
    });
}

initialize();
