browser.runtime.onMessage.addListener(async function (request) {
    let isDesmodderActive: boolean;
    switch (request.message) {
        // Check if DesModder is enabled by making a request to a non-existent file.
        // If DesModder is not enabled, this fetch will not throw an exception (just
        // a 404 response). If DesModder is enabled, DesModder's own net request rules
        // will block this request, result in an exception being thrown.
        // Note: this case only applies to the manifest v2 versions of this extension.
        case "check-desmodder":
            try {
                await fetch("https://www.desmos.com/assets/build/calculator_desktop-this_does_not_exist.js");
                isDesmodderActive = false;
            } catch {
                isDesmodderActive = true;
            }
            return Promise.resolve(isDesmodderActive);

        // Inject the script which sets up ALMOND_OVERRIDES and wait for it to finish.
        // Note: this case only applies to the manifest v2 versions of this extension.
        case "inject-preload":
            await new Promise<void>(function (resolve) {
                const script = document.createElement("script");
                script.src = browser.runtime.getURL("preloadScript.js");
                script.onload = function () {
                    script.remove();
                    resolve();
                };
                script.onerror = (e) => console.error(e);
                (document.head || document.documentElement).appendChild(script);
            });
            return Promise.resolve();

        // Inject the script which sets up ALMOND_OVERRIDES and wait for it to finish.
        // Then, inject the script which loads in the calculator and wait for it to finish.
        // Note: this case only applies to the manifest v3 versions of this extension.
        case "redirect-detected":
            await new Promise<void>(function (resolve) {
                const script = document.createElement("script");
                script.src = browser.runtime.getURL("preloadScript.js");

                // Tell the injected script to initialize the calculator after finishing
                // its module overrides.
                // The attribute just needs a truthy value.
                script.setAttribute("run-calculator", "run-calculator");
                script.onload = function () {
                    script.remove();
                    resolve();
                };
                script.onerror = (e) => console.error(e);
                (document.head || document.documentElement).appendChild(script);
            });
            return Promise.resolve();
    }
});
