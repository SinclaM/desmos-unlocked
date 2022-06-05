async function initializeAutoCommands() {
    let commands = await browser.storage.local.get("autoCommands");
    let injectedCode = `function waitForDesmosLoaded() {
                            let interval = 10; // ms
                            window.setTimeout(function() {
                                if (window.Desmos?.MathQuill?.config) {
                                    Desmos.MathQuill.config({
                                        autoCommands: "${commands.autoCommands}"
                                    });
                                } else {
                                    waitForDesmosLoaded();
                                }
                            }, interval);
                        }

                        waitForDesmosLoaded();
                        `;
    let script = document.createElement("script");
    script.textContent = injectedCode;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
}


async function updateAutoCommands() {
    let commands = await browser.storage.local.get("autoCommands");
    let injectedCode = `Desmos.MathQuill.config({
                            autoCommands: "${commands.autoCommands}"
                        });`;
    let script = document.createElement("script");
    script.textContent = injectedCode;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
}


initializeAutoCommands();
browser.storage.onChanged.addListener(updateAutoCommands);
