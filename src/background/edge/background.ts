/// <reference types="chrome"/>
import { defaultConfig } from "../../globals/config";

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.get(defaultConfig).then((config) => chrome.storage.local.set(config));
});

chrome.storage.onChanged.addListener((changes) => {
    if (typeof changes.enableMathquillOverrides !== "undefined") {
        if (changes.enableMathquillOverrides.newValue) {
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: [
                    {
                        id: 1,
                        priority: 1,
                        action: {
                            type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
                            redirect: { extensionPath: "/preloadScript.js" },
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
                            redirect: { extensionPath: "/preloadScript.js" },
                        },
                        condition: {
                            urlFilter: "https://www.desmos.com/assets/build/calculator_desktop-*.js?|",
                        },
                    },
                ],
            });
        } else {
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [1, 2],
            });
        }
    }
});
