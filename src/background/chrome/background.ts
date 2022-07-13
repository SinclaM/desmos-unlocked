/// <reference types="chrome"/>

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({
        // keepmeKEEPME should always remain in autoCommands, since MathQuill requires a nonempty
        // space-delimited list of commands.
        autoCommands:
            'keepmeKEEPME alpha beta sqrt theta Theta phi Phi pi Pi tau nthroot cbrt sum prod int ans percent infinity infty gamma Gamma delta Delta epsilon epsiv zeta eta kappa lambda Lambda mu xi Xi rho sigma Sigma chi Psi omega Omega digamma iota nu upsilon Upsilon Psi square mid parallel nparallel perp to times div approx',
    });
});

chrome.webRequest.onBeforeRedirect.addListener(
    async function ({ url }) {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.tabs.sendMessage(tabs[0].id, { message: 'redirect-detected', url: url });
    },
    {
        urls: [
            'https://www.desmos.com/assets/build/calculator_desktop-*.js',
            'https://www.desmos.com/assets/build/calculator_desktop-*.js?',
        ],
    }
);
