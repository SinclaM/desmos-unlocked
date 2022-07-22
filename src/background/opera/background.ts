/// <reference types="chrome"/>
import { defaultConfig } from "../../globals/config";

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.get(defaultConfig).then((config) => chrome.storage.local.set(config));
});

// Listen for redirects from the a request to calculator_desktop. When this redirect happens,
// we want to send a message to the preload content script to begin module overrides and
// initialize the calculator.
chrome.webRequest.onBeforeRedirect.addListener(
    async function ({ tabId }) {
        while (true) {
            // The request to calculator_desktop (and the following redirect) may happen
            // before preload_content is loaded at document_start. To avoid a race condition,
            // we keep trying to send the message until the "no receiving end" exception
            // is gone.
            try {
                // tsserver says await has no effect on the expression below but it's
                // actually critical to resolve the returned promise and catch the error. 
                // It looks like the type definition from @types/chrome is not up to date 
                // with the manifest v3 promise behavior for this funciton.
                await chrome.tabs.sendMessage(tabId, { message: "redirect-detected" });
                break;
            } catch {
                await new Promise((r) => setTimeout(r, 10));
            }
        }
    },
    {
        urls: [
            "https://www.desmos.com/assets/build/calculator_desktop-*.js",
            "https://www.desmos.com/assets/build/calculator_desktop-*.js?",
        ],
    }
);

chrome.storage.onChanged.addListener((changes) => {
    if (typeof changes.enableMathquillOverrides !== "undefined") {
        if (changes.enableMathquillOverrides.newValue) {
            chrome.declarativeNetRequest.updateDynamicRules(
                {
                    addRules: [
                        {
                            id: 1,
                            priority: 1,
                            action: {
                                type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
                                redirect: { extensionPath: "/empty.js" },
                            },
                            condition: {
                                urlFilter: "https://www.desmos.com/assets/build/calculator_desktop-*.js|",
                            },
                        },
                        {
                            id: 2,
                            priority: 2,
                            action: {
                                type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
                                redirect: { extensionPath: "/empty.js" },
                            },
                            condition: {
                                urlFilter: "https://www.desmos.com/assets/build/calculator_desktop-*.js?|",
                            },
                        },
                    ],
                }
            );
        } else {
            chrome.declarativeNetRequest.updateDynamicRules(
                {
                    removeRuleIds: [1, 2],
                }
            );
        }
    }
});
