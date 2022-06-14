async function updateAutoCommands() {
    const commands = await browser.storage.local.get('autoCommands');
    const script = document.createElement('script');
    script.src = browser.runtime.getURL('inject.js');
    const cmdString = commands.autoCommands.toString();
    console.log(cmdString); //eslint-disable-line
    script.onload = function () {
        const data = {
            autoCommands: cmdString,
        };
        document.dispatchEvent(new CustomEvent('yourCustomEvent', { detail: data }));

        (this as any).remove();
    };
    (document.head || document.documentElement).appendChild(script);
}

updateAutoCommands();
browser.storage.onChanged.addListener(updateAutoCommands);
