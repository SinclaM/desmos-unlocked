/// <reference types="web-ext-types"/>

browser.runtime.onInstalled.addListener(function () {
    browser.storage.local.set({
        // keepmeKEEPME should always remain in autoCommands, since MathQuill requires a nonempty
        // space-delimited list of commands.
        autoCommands:
            "keepmeKEEPME alpha beta sqrt theta Theta phi Phi pi Pi tau nthroot cbrt sum prod int ans percent infinity infty gamma Gamma delta Delta epsilon epsiv zeta eta kappa lambda Lambda mu xi Xi rho sigma Sigma chi Psi omega Omega digamma iota nu upsilon Upsilon Psi square mid parallel nparallel perp times div approx",
        charsThatBreakOutOfSupSub: "+-=<>*",
        isAutoParenEnabled: false,
        disableAutoSubstitutionInSubscripts: true,
    });
});

browser.webRequest.onBeforeRequest.addListener(
    async function ({ url }) {
        // This url is used by preload_content to check for DesModder activity.
        // We ignore it here to avoid an infinite recursion.
        if (url === "https://www.desmos.com/assets/build/calculator_desktop-this_does_not_exist.js") {
            return;
        }

        const tabs = await browser.tabs.query({ active: true, currentWindow: true });

        if (url.endsWith(".js")) {
            const isDesmodderActive: boolean | void = await browser.tabs.sendMessage(tabs[0].id, {
                message: "check-desmodder",
            });

            // If DesModder is not active, then we should immediately inject the preload script
            // and begin overrides. There won't be another opportunity.
            // If DesModder is active, then we know that DesModder's own webRequest rules will
            // block this script anyway, and we don't want to define ALMOND_OVERRIDES before
            // DesModder does, so we can wait until DesModder makes another request.
            if (!isDesmodderActive) {
                await browser.tabs.sendMessage(tabs[0].id, { message: "inject-preload" });
            }
        }

        // This url being requested means DesModder is active and trying to load the calculator.
        // Now is the time to inject the preload.
        if (url.endsWith(".js?")) {
            await browser.tabs.sendMessage(tabs[0].id, { message: "inject-preload" });
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
