/// <reference types="web-ext-types"/>
import window from './globals/window';

function waitForDesmosLoaded(commands: string) {
    const interval = 10; // ms
    window.setTimeout(function () {
        if (window.Desmos?.MathQuill?.config && window.Desmos?.Calculator) {
            window.Desmos.MathQuill.config({
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
