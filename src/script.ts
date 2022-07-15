/// <reference types="web-ext-types"/>
//import window from './globals/window';

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

const handler = (({ detail }: CustomEvent<string>) => {
    waitForDesmosLoaded(detail);
    document.removeEventListener('send-config', handler);
}) as EventListener;

document.addEventListener('send-config', handler);
