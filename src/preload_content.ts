console.log('Preload running...');

browser.runtime.onMessage.addListener(async function (request) {
    let isDesmodderActive: boolean;
    switch (request.message) {
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
            break;
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
            break;
    }
});

