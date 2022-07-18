/// <reference types="web-ext-types"/>
import { pollForValue } from "./utils/utils";
import window from "./globals/window";
import { MathQuillConfig } from "./globals/config";


const handler = (({ detail }: CustomEvent<MathQuillConfig>) => {
    // Have to wait for all the preload modifications to finish
    pollForValue(() => window.Desmos?.MathQuill?.config).then(() => {
        window.Desmos.MathQuill.config({
            autoCommands: detail.autoCommands,
        });
        document.removeEventListener("send-config", handler);
    });
}) as EventListener;

document.addEventListener("send-config", handler);
