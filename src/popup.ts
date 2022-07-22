import { desmosDefualtAutoCommands, basicAutoCommands, advancedAutoCommands } from "./utils/autoCommands";
import { massSet, storeConfig, populateGrid, toggleConfig } from "./utils/utils";
import extendedShortcuts from "./utils/extendedShortcuts";
import { defaultConfig } from "./globals/config";

document.addEventListener("DOMContentLoaded", async () => {
    const setToDefaultCommon = () => {
        if (autoParen.checked) {
            autoParen.click();
        }
        if (subscriptShortcuts.checked) {
            subscriptShortcuts.click();
        }
        disableAll.click();
        if (extendSymbols.checked) {
            extendSymbols.click();
        }
        breakoutChars.value = "+-=<>*";
        setChars.click();
    };

    document.getElementById("set-to-default").onclick = function () {
        massSet(
            Array.from(document.querySelectorAll("#desmos-default .latex-item, #basic .latex-item"))
                .map((item) => item.id)
                .filter((item) => defaultConfig.autoCommands.split(" ").includes(item)),
            "autoCommands"
        );
        setToDefaultCommon();
    };

    document.getElementById("set-to-desmos-default").onclick = function () {
        massSet(
            Array.from(document.querySelectorAll("#desmos-default .latex-item")).map((item) => item.id),
            "autoCommands"
        );
        setToDefaultCommon();
    };

    // Add all the dynamically loaded nodes to the DOM using templates and give
    // sliders their funcionality
    const { autoCommands }: { autoCommands: string } = await browser.storage.local.get("autoCommands");
    populateGrid("grid-item-template", "desmos-default", desmosDefualtAutoCommands, autoCommands);
    populateGrid("grid-item-template", "basic", basicAutoCommands, autoCommands);
    populateGrid("grid-item-template", "advanced", advancedAutoCommands, autoCommands);

    // Make the sliders actually update user configs when clicked
    document.querySelectorAll(".latex-item").forEach(function (item) {
        item.querySelector(".onoffswitch-checkbox").addEventListener("click", storeConfig);
    });

    const extendSymbols = document.getElementById("switch-extend-mq") as HTMLInputElement;
    const collapsible = document.getElementById("collapsible");

    extendSymbols.addEventListener("click", () => {
        toggleConfig("enableMathquillOverrides");
        collapsible.style.display = collapsible.style.display === "none" ? "block" : "none";
    });

    browser.storage.local.get("enableMathquillOverrides").then((stored) => {
        extendSymbols.checked = stored.enableMathquillOverrides as boolean;
        collapsible.style.display = extendSymbols.checked ? "block" : "none";
    });

    const extendedText = document.querySelector<HTMLInputElement>("#collapsible textarea");
    extendedText.value = autoCommands
        .split(" ")
        .filter((shortcut) => extendedShortcuts.has(shortcut))
        .join(" ");

    const setExtendedText = document.querySelector<HTMLInputElement>("#collapsible button.set");
    setExtendedText.onclick = async () => {
        try {
            validateCommands(extendedText.value);
            const { autoCommands }: { autoCommands: string } = await browser.storage.local.get("autoCommands");
            const baseCommands = autoCommands
                .split(" ")
                .filter((shortcut) => !extendedShortcuts.has(shortcut))
                .join(" ");
            const extendedCommands = extendedText.value === "" ? "" : " " + extendedText.value;
            browser.storage.local.set({ autoCommands: baseCommands + extendedCommands });
            document.getElementById("error-bar").textContent = "";
        } catch (e) {
            document.getElementById("error-bar").textContent = e;
        }
    };

    const enableAll = document.querySelector<HTMLInputElement>("#collapsible button.enable");
    enableAll.onclick = () => {
        extendedText.value = [...extendedShortcuts].join(" ");
        setExtendedText.click();
    };
    const disableAll = document.querySelector<HTMLInputElement>("#collapsible button.disable");
    disableAll.onclick = () => {
        extendedText.value = "";
        setExtendedText.click();
    };

    const breakoutChars = document.querySelector<HTMLInputElement>("#breakout textarea");
    const setChars = document.getElementById("set-chars");

    browser.storage.local
        .get("charsThatBreakOutOfSupSub")
        .then((stored) => (breakoutChars.value = stored.charsThatBreakOutOfSupSub.toString()));

    setChars.onclick = function () {
        browser.storage.local.set({ charsThatBreakOutOfSupSub: breakoutChars.value });
    };

    const autoParen = document.querySelector<HTMLInputElement>("#auto-paren .onoffswitch .onoffswitch-checkbox");
    autoParen.addEventListener("click", () => toggleConfig("isAutoParenEnabled"));
    browser.storage.local.get("isAutoParenEnabled").then((stored) => {
        autoParen.checked = stored.isAutoParenEnabled as boolean;
    });

    const subscriptShortcuts = document.querySelector<HTMLInputElement>(
        "#shortcuts-in-subscripts .onoffswitch .onoffswitch-checkbox"
    );
    subscriptShortcuts.addEventListener("click", () => toggleConfig("disableAutoSubstitutionInSubscripts"));
    browser.storage.local.get("disableAutoSubstitutionInSubscripts").then((stored) => {
        // Note that in the UI we represent the option as "Enable shortcuts in subscripts"
        // (toggle on means shortcuts enabled), while the MathQuill API has it reversed
        // (disableAutoSubstitutionInSubscripts === true means shortcuts disabled).
        subscriptShortcuts.checked = !stored.disableAutoSubstitutionInSubscripts as boolean;
    });
});

function validateCommands(commands: string) {
    // The empty string is valid
    if (commands === "") {
        return;
    }
    if (typeof commands !== "string" || !/^[a-z]+(?: [a-z]+)*$/i.test(commands)) {
        throw "🚫 not a space-delimited list of only letters";
    }
    commands.split(" ").forEach((command) => {
        if (!extendedShortcuts.has(command)) {
            throw `🚫 ${command} is not a valid extended shortcut`;
        }
    });
}
