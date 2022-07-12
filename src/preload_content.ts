console.log('Preload running...');

browser.runtime.onMessage.addListener(async function (request) {
    if (request.injectPreload) {
        console.log('injectPreload Message from the background script:');
        console.log(request);
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
        return Promise.resolve({ response: 'goodbye' });
    }
    if (request.checkDesmodder) {
        console.log('checkDesmodder Message from the background script:');
        console.log(request);
        let isDesmodderActive: boolean;
        try {
            await fetch('https://www.desmos.com/assets/build/calculator_desktop-this_does_not_exist.js');
            isDesmodderActive = false;
            console.log('Preload reports DesModder is NOT active');
        } catch {
            isDesmodderActive = true;
            console.log('Preload reports DesModder is active');
        }
        return Promise.resolve({ response: isDesmodderActive });
    }
});

