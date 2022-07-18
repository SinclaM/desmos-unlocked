import { MathQuillConfig } from "./globals/config";

// Firefox only allows primitive types to be sent from the content script to the page context.
// Firefox provides the builtin cloneInto function to allow sending objects between these
// contexts.
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Sharing_objects_with_page_scripts#cloneinto
declare const cloneInto: ((toClone: MathQuillConfig, context: any) => MathQuillConfig) | undefined;

async function updateAutoCommands() {
    const commands = await browser.storage.local.get("autoCommands");
    const script = document.createElement("script");
    script.src = browser.runtime.getURL("script.js");
    const cmdString = commands.autoCommands.toString();
    script.onload = function () {
        const data = cmdString;
        let config: MathQuillConfig;
        try {
            config = cloneInto!({ autoCommands: data }, window);
        } catch {
            config = { autoCommands: data };
        }
        document.dispatchEvent(new CustomEvent("send-config", { detail: config }));
        script.remove();
    };
    (document.head || document.documentElement).appendChild(script);
}

updateAutoCommands();
browser.storage.onChanged.addListener(updateAutoCommands);
