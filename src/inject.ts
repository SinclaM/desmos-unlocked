/// <reference types="web-ext-types"/>

function waitForDesmosLoaded(commands: string) {
    const interval = 10; // ms
    window.setTimeout(function () {
        if ((window as any).Desmos?.MathQuill?.config && (window as any).Desmos?.Calculator) {
            (window as any).Desmos.MathQuill.config({
                autoCommands: commands,
            });
        } else {
            waitForDesmosLoaded(commands);
        }
    }, interval);
}

document.addEventListener('sendConfig', function (e) {
    const data = (e as any).detail;
    waitForDesmosLoaded(data);
});
