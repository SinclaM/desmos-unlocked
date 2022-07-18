import { desmosDefualtAutoCommands, basicAutoCommands, advancedAutoCommands } from "./utils/autoCommands";
import { massSet, storeConfig, populateGrid } from "./utils/utils";

const setToDefault = document.getElementById("set-to-default");
const setToDesmosDefault = document.getElementById("set-to-desmos-default");

setToDefault.onclick = function () {
    massSet(
        Array.from(document.querySelectorAll("#desmos-default .latex-item, #basic .latex-item"))
            .map((item) => item.id)
            .filter(function (item) {
                return item !== "ge" && item !== "le" && item !== "ne" && item !== "pm" && item !== "mp";
            }),
        "autoCommands"
    );
};

setToDesmosDefault.onclick = function () {
    massSet(
        Array.from(document.querySelectorAll("#desmos-default .latex-item")).map((item) => item.id),
        "autoCommands"
    );
};

// Add all the dynamically loaded nodes to the DOM using templates and give
// sliders their funcionality
async function initialize() {
    const { autoCommands }: { autoCommands: string } = await browser.storage.local.get("autoCommands");
    populateGrid("grid-item-template", "desmos-default", desmosDefualtAutoCommands, autoCommands);
    populateGrid("grid-item-template", "basic", basicAutoCommands, autoCommands);
    populateGrid("grid-item-template", "advanced", advancedAutoCommands, autoCommands);

    // Make the sliders actually update user configs when clicked
    document.querySelectorAll(".latex-item").forEach(function (item) {
        item.querySelector(".onoffswitch-checkbox").addEventListener("click", storeConfig);
    });
}

document.addEventListener("DOMContentLoaded", initialize);
