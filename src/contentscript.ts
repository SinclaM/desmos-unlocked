async function initializeAutoCommands() {
    const commands = await browser.storage.local.get('autoCommands');
    const injectedCode = `function waitForDesmosLoaded() {
                            let interval = 10; // ms
                            window.setTimeout(function() {
                                if (window.Desmos?.MathQuill?.config && window.Desmos?.Calculator) {
                                    Desmos.MathQuill.config({
                                        autoCommands: '${commands.autoCommands}'
                                    });
                                } else {
                                    waitForDesmosLoaded();
                                }
                            }, interval);
                        }

                        waitForDesmosLoaded();
                        `;
    const script = document.createElement('script');
    script.textContent = injectedCode;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
}

async function updateAutoCommands() {
    const commands = await browser.storage.local.get('autoCommands');
    const injectedCode = `Desmos.MathQuill.config({
                            autoCommands: '${commands.autoCommands}'
                        });`;
    const script = document.createElement('script');
    script.textContent = injectedCode;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
}

initializeAutoCommands();
browser.storage.onChanged.addListener(updateAutoCommands);
