import { BROWSER } from "../globals/env";
import "../globals/extension";
import { CommandMap } from "../utils/commandMap";

if (BROWSER === "firefox") {
    browser.runtime.onMessage.addListener(async function (request) {
        let isDesmodderActive: boolean;
        let remaps: CommandMap;
        switch (request.message) {
            // Check if DesModder is enabled by making a request to a non-existent file.
            // If DesModder is not enabled, this fetch will not throw an exception (just
            // a 404 response). If DesModder is enabled, DesModder's own net request rules
            // will block this request, result in an exception being thrown.
            case "check-desmodder":
                try {
                    await fetch("https://www.desmos.com/assets/build/calculator_desktop-this_does_not_exist.js");
                    isDesmodderActive = false;
                } catch {
                    isDesmodderActive = true;
                }
                return Promise.resolve(isDesmodderActive);

            // Inject the script which sets up ALMOND_OVERRIDES and wait for it to finish.
            case "inject-preload":
                remaps = cloneInto<CommandMap>((await browser.storage.local.get("remaps")).remaps as any, window);
                await new Promise<void>(function (resolve) {
                    const script = document.createElement("script");
                    script.src = browser.runtime.getURL("preloadScript.js");
                    script.onload = function () {
                        document.dispatchEvent(new CustomEvent("send-remaps", { detail: remaps }));
                        script.remove();
                        resolve();
                    };
                    script.onerror = (e) => console.error(e);
                    (document.head || document.documentElement).appendChild(script);
                });
                return Promise.resolve();
        }
    });
}
