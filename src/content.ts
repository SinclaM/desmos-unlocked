async function updateAutoCommands() {
    const commands = await browser.storage.local.get('autoCommands');
    const script = document.createElement('script');
    script.src = browser.runtime.getURL('script.js');
    const cmdString = commands.autoCommands.toString();
    script.onload = function () {
        const data = cmdString;
        document.dispatchEvent(new CustomEvent('sendConfig', { detail: data }));

        (this as any).remove();
    };
    (document.head || document.documentElement).appendChild(script);
}

updateAutoCommands();
browser.storage.onChanged.addListener(updateAutoCommands);
