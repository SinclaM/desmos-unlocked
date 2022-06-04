browser.runtime.onInstalled.addListener(function () {
    browser.storage.local.set(
        {
            autoCommands:
                "alpha beta sqrt theta Theta phi Phi pi Pi tau nthroot cbrt sum prod int ans percent infinity infty gamma Gamma delta Delta epsilon epsiv zeta eta kappa lambda Lambda mu xi Xi rho sigma Sigma chi Psi omega Omega digamma iota nu upsilon Upsilon psi Psi square mid parallel nparallel perp to times div approx",
        },
        function () {}
    );
    console.log("background finished\n");
});

