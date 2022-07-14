console.log('Preload running...');

browser.runtime.onMessage.addListener(async function (request) {
    let isDesmodderActive: boolean;
    switch (request.message) {

        // Check if DesModder is enabled by making a request to a non-existent file.
        // If DesModder is not enabled, this fetch will not throw an exception (just
        // a 404 response). If DesModder is enabled, DesModder's own net request rules
        // will block this request, result in an exception being thrown.
        // Note: this case only applies to the manifest v2 versions of this extension.
        case 'check-desmodder':
            console.log(`preload_content heard message: ${request.message}`);
            try {
                await fetch('https://www.desmos.com/assets/build/calculator_desktop-this_does_not_exist.js');
                isDesmodderActive = false;
                console.log('preload_content reports DesModder is NOT active');
            } catch {
                isDesmodderActive = true;
                console.log('preload_content reports DesModder is active');
            }
            return Promise.resolve(isDesmodderActive);

        // Inject the script which sets up ALMOND_OVERRIDES and wait for it to finish.
        // Note: this case only applies to the manifest v2 versions of this extension.
        case 'inject-preload':
            console.log(`preload_content heard message: ${request.message}`);
            await new Promise<void>(function (resolve) {
                const script = document.createElement('script');
                script.src = browser.runtime.getURL('preload_inject.js');
                script.onload = function () {
                    (this as any).remove();
                    resolve();
                };
                script.onerror = (e) => console.log(e);
                (document.head || document.documentElement).appendChild(script);
            });
            return Promise.resolve();

        // Inject the script which sets up ALMOND_OVERRIDES and wait for it to finish.
        // Then, inject the script which loads in the calculator and wait for it to finish.
        // Note: this case only applies to the manifest v3 versions of this extension.
        case 'redirect-detected':
            console.log(`preload_content heard message: ${request.message}`);
            console.log(`url detected is ${request.url}`);
            await new Promise<void>(function (resolve) {
                const script = document.createElement('script');
                script.src = browser.runtime.getURL('preload_inject.js');
                script.onload = function () {
                    (this as any).remove();
                    resolve();
                };
                script.onerror = (e) => console.log(e);
                (document.head || document.documentElement).appendChild(script);
            });
            await new Promise<void>(function (resolve) {
                const script = document.createElement('script');
                script.src = browser.runtime.getURL('run_calculator.js');
                script.onload = function () {
                    (this as any).remove();
                    resolve();
                };
                script.onerror = (e) => console.log(e);
                (document.head || document.documentElement).appendChild(script);
            });
            return Promise.resolve();
    }
});

