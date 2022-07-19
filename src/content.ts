import { MathQuillConfig } from "./globals/config";

// Firefox only allows primitive types to be sent from the content script to the page context.
// Firefox provides the builtin cloneInto function to allow sending objects between these
// contexts.
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Sharing_objects_with_page_scripts#cloneinto
declare const cloneInto: ((toClone: MathQuillConfig, context: any) => MathQuillConfig) | undefined;

async function updateConfig(changes?: browser.storage.ChangeDict) {
    let config: MathQuillConfig;
    if (typeof changes === "undefined") {
        config = await browser.storage.local.get(["autoCommands", "charsThatBreakOutOfSupSub"]);
    } else {
        config = {};
        Object.keys(changes).forEach((configOption) => (config[configOption] = changes[configOption].newValue));
    }

    const script = document.createElement("script");
    script.src = browser.runtime.getURL("script.js");
    script.onload = function () {
        try {
            config = cloneInto!(config, window);
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
