function initializeAutoCommands() {
    browser.storage.local.get("autoCommands", function (data) {
        let injectedCode = `function waitForDesmosLoaded() {
                                let interval = 10; // ms
                                window.setTimeout(function() {
                                    if (window.Desmos.MathQuill.config) {
                                        Desmos.MathQuill.config({
                                            autoCommands: "${data.autoCommands}"
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
    });
}


function updateAutoCommands() {
    browser.storage.local.get("autoCommands", function (data) {
        let injectedCode = `Desmos.MathQuill.config({
                                autoCommands: "${data.autoCommands}"
                            });`;
        let script = document.createElement("script");
        script.textContent = injectedCode;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    });
}


initializeAutoCommands();
browser.storage.onChanged.addListener(updateAutoCommands);
