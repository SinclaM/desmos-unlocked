/// <reference types="web-ext-types"/>

browser.runtime.onInstalled.addListener(function () {
    browser.storage.local.set({
        // keepmeKEEPME should always remain in autoCommands, since MathQuill requires a nonempty
        // space-delimited list of commands.
        autoCommands:
            'keepmeKEEPME alpha beta sqrt theta Theta phi Phi pi Pi tau nthroot cbrt sum prod int ans percent infinity infty gamma Gamma delta Delta epsilon epsiv zeta eta kappa lambda Lambda mu xi Xi rho sigma Sigma chi Psi omega Omega digamma iota nu upsilon Upsilon Psi square mid parallel nparallel perp to times div approx',
    });
});

browser.webRequest.onBeforeRequest.addListener(
    async function ({ url }) {
        if (url === 'https://www.desmos.com/assets/build/calculator_desktop-this_does_not_exist.js') {
            return { cancel: false };
        }

        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (url.endsWith('.js')) {
            console.log(url);
            const response = await browser.tabs.sendMessage(tabs[0].id, { checkDesmodder: true });
            console.log('Message from the content script:');
            console.log((response as any).response);
            if (!(response as any).response) {
                await browser.tabs.sendMessage(tabs[0].id, { injectPreload: true });
            }
            return { cancel: false };
        }

        if (url.endsWith('.js?')) {
            await browser.tabs.sendMessage(tabs[0].id, { injectPreload: true });
            return { cancel: false };
        }
    },
    {
        urls: [
            'https://www.desmos.com/assets/build/calculator_desktop-*.js',
            'https://www.desmos.com/assets/build/calculator_desktop-*.js?',
        ],
    },
    ['blocking']
);
