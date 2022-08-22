import { MathQuillConfig } from "./globals/config";
import "./globals/extension";

async function updateConfig(changes?: browser.storage.ChangeDict) {
    let config: MathQuillConfig;
    if (typeof changes === "undefined") {
        config = await browser.storage.local.get([
            "autoCommands",
            "charsThatBreakOutOfSupSub",
            "isAutoParenEnabled",
            "disableAutoSubstitutionInSubscripts",
        ]);
    } else {
        config = {};
        Object.keys(changes).forEach((configOption) => (config[configOption] = changes[configOption].newValue));
    }

    const script = document.createElement("script");
    script.src = browser.runtime.getURL("script.js");
    script.onload = function () {
        try {
            config = cloneInto(config, window);
        } catch (e) {
            /* Just need to catch the ReferenceError if on a nonsupporting browser */
        }
        document.dispatchEvent(new CustomEvent("send-config", { detail: config }));
        script.remove();
    };
    (document.head || document.documentElement).appendChild(script);
}

updateConfig();
browser.storage.onChanged.addListener(updateConfig);
