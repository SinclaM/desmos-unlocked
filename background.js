chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set(
        {
            autoCommands:
                "alpha beta sqrt theta Theta phi Phi pi Pi tau nthroot cbrt sum prod int ans percent infinity infty gamma Gamma delta Delta epsilon epsiv zeta eta kappa lambda Lambda mu xi Xi rho sigma Sigma chi Psi omega Omega",
        },
        function () {}
    );
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {
                            urlPrefix: "https://www.desmos.com/calculator",
                        },
                    }),
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()],
            },
        ]);
    });
});
