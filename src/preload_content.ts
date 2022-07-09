console.log('Preload running...');

const script = document.createElement('script');
script.src = browser.runtime.getURL('preload_inject.js');
script.onload = function () {
    (this as any).remove();
};
(document.head || document.documentElement).appendChild(script);


