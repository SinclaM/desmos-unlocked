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
    ({ url }) => ({
        cancel: url.endsWith('.js') || url.endsWith('.js?'),
    }),
    {
        urls: [
            'https://www.desmos.com/assets/build/calculator_desktop-*.js',
            'https://www.desmos.com/assets/build/calculator_desktop-*.js?',
        ],
    },
    ['blocking']
);
