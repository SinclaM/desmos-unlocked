/// <reference types="chrome"/>

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({
        // keepmeKEEPME should always remain in autoCommands, since MathQuill requires a nonempty
        // space-delimited list of commands.
        autoCommands:
            "keepmeKEEPME alpha beta sqrt theta Theta phi Phi pi Pi tau nthroot cbrt sum prod int ans percent infinity infty gamma Gamma delta Delta epsilon epsiv zeta eta kappa lambda Lambda mu xi Xi rho sigma Sigma chi Psi omega Omega digamma iota nu upsilon Upsilon Psi square mid parallel nparallel perp times div approx",
        charsThatBreakOutOfSupSub: "+-=<>*",
        autoParenthesizeFunctions: false,
    });
});

// Listen for redirects from the a request to calculator_desktop. When this redirect happens,
// we want to send a message to the preload content script to begin module overrides and
// initialize the calculator.
chrome.webRequest.onBeforeRedirect.addListener(
    async function ({ url }) {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        while (true) {
            // The request to calculator_desktop (and the following redirect) may happen
            // before preload_content is loaded at document_start. To avoid a race condition,
            // we keep trying to send the message until the "no receiving end" exception
            // is gone.
            try {
                // TODO: Figure out why tsserver thinks that sendMessage returns void and not
                // a promise. tsserver says await has no effect on the expression below but it's
                // actual critical to resolve the promise and catch the error.
                await chrome.tabs.sendMessage(tabs[0].id, { message: "redirect-detected", url: url });
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
