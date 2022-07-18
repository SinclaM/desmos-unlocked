/// <reference types="web-ext-types"/>
import { pollForValue } from "./utils/utils";
import window from "./globals/window";

const handler = (({ detail }: CustomEvent<string>) => {
    // Have to wait for all the preload modifications to finish
    pollForValue(() => window.Desmos?.MathQuill?.config).then(() => {
        (window as any).Desmos.MathQuill.config({
            autoCommands: detail,
        });
        document.removeEventListener("send-config", handler);
    });
}) as EventListener;

document.addEventListener("send-config", handler);
