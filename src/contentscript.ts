async function updateAutoCommands() {
    const commands = await browser.storage.local.get('autoCommands');
    const script = document.createElement('script');
    script.src = browser.runtime.getURL('inject.js');
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

//function extendMathquill() {
    //const script = document.createElement('script');
    //script.src = browser.runtime.getURL('extend_mathquill.js');
    //script.onload = function() {
        //script.remove();
    //};
    //(document.head || document.documentElement).appendChild(script);
//}

//extendMathquill();
