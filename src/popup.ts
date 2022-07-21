import { desmosDefualtAutoCommands, basicAutoCommands, advancedAutoCommands } from "./utils/autoCommands";
import { massSet, storeConfig, populateGrid, toggleConfig } from "./utils/utils";

document.addEventListener("DOMContentLoaded", async () => {
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

    const setToDefault = document.getElementById("set-to-default");
    const setToDesmosDefault = document.getElementById("set-to-desmos-default");

    const setToDefaultCommon = () => {
        if (autoParen.checked) {
            autoParen.click();
        }
        if (subscriptShortcuts.checked) {
            subscriptShortcuts.click();
        }
        if (extendSymbols.checked) {
            extendSymbols.click();
        }
        breakoutChars.value = "+-=<>*";
        setChars.click();
    };

    setToDefault.onclick = function () {
        massSet(
            Array.from(document.querySelectorAll("#desmos-default .latex-item, #basic .latex-item"))
                .map((item) => item.id)
                .filter(function (item) {
                    return item !== "ge" && item !== "le" && item !== "ne" && item !== "pm" && item !== "mp";
                }),
            "autoCommands"
        );
        setToDefaultCommon();
    };

    setToDesmosDefault.onclick = function () {
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
});
