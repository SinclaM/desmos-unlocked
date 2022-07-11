console.log('Preload running...');

let ranAlready = false;

browser.runtime.onMessage.addListener(function (request) {
    if (request.injectPreload && !ranAlready) {
        ranAlready = true;
        const script = document.createElement('script');
        script.src = browser.runtime.getURL('preload_inject.js');
        script.onload = function () {
            (this as any).remove();
            return Promise.resolve({ farewell: 'goodbye' });
        };
        (document.head || document.documentElement).appendChild(script);
    }
});
