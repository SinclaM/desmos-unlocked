/// <reference types="web-ext-types"/>
import { defaultConfig } from "../../globals/config";

browser.runtime.onInstalled.addListener(function () {
    browser.storage.local
        // Casting interfaces to StorageObject is a pain because of the index signature.
        .get((defaultConfig as unknown) as browser.storage.StorageObject)
        .then((config) => browser.storage.local.set(config));
});

browser.webRequest.onBeforeRequest.addListener(
    async function ({ url, tabId }) {
        if (!(await browser.storage.local.get("enableMathquillOverrides")).enableMathquillOverrides) {
            return;
        }
        // This url is used by preload_content to check for DesModder activity.
        // We ignore it here to avoid an infinite recursion.
        if (url === "https://www.desmos.com/assets/build/calculator_desktop-this_does_not_exist.js") {
            return;
        }

        if (url.endsWith(".js")) {
            const isDesmodderActive: boolean | void = await browser.tabs.sendMessage(tabId, {
                message: "check-desmodder",
            });

            // If DesModder is not active, then we should immediately inject the preload script
            // and begin overrides. There won't be another opportunity.
            // If DesModder is active, then we know that DesModder's own webRequest rules will
            // block this script anyway, and we don't want to define ALMOND_OVERRIDES before
            // DesModder does, so we can wait until DesModder makes another request.
            if (!isDesmodderActive) {
                await browser.tabs.sendMessage(tabId, { message: "inject-preload" });
            }
        }

        // This url being requested means DesModder is active and trying to load the calculator.
        // Now is the time to inject the preload.
        if (url.endsWith(".js?")) {
            await browser.tabs.sendMessage(tabId, { message: "inject-preload" });
        }
    },
    {
        urls: [
            "https://www.desmos.com/assets/build/calculator_desktop-*.js",
            "https://www.desmos.com/assets/build/calculator_desktop-*.js?",
        ],
    },
    ["blocking"]
);
