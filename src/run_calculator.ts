import window from './globals/window';
import { postMessageUp, listenToMessageDown } from './utils/messages';
import injectScript from './utils/injectScript';
import { pollForValue } from './utils/utils';

function runCalculator() {
    /* The following script should have failed earlier because we blocked calculator_desktop.js.
  We copy it verbatim here to actually load the calculator. */

    window.require(
        ['toplevel/calculator_desktop', 'testbridge', 'jquery'],
        function (calcPromise: any, TestBridge: any, $: any) {
            $('.dcg-loading-div-container').hide();
            if (calcPromise === undefined) {
                console.error('No calc promise');
            }
            calcPromise.then(function (calc: any) {
                if (calc === undefined) {
                    console.error('No calc');
                }
                window.Calc = calc;
                TestBridge.ready();
                // following lines added
                listenToMessageDown((message) => {
                    if (message.type === 'set-script-url') {
                        injectScript(message.value);
                        // cancel listener
                        return true;
                    }
                });
                postMessageUp({
                    type: 'get-script-url',
                });
            });
        }
    );
}

pollForValue(
    () => (document.querySelector("script[src^='/assets/build/calculator_desktop']") as HTMLScriptElement)?.src
).then((src) => {
    /* we blocked calculator_desktop.js earlier to ensure that the preload/override script runs first.
  Now we load it, but with '?' appended to prevent the web request rules from blocking it */
    const script = document.createElement('script');
    script.src = src + '??';
    console.log(src);
    script.async = false;
    script.onload = () => {
        // remove from DOM
        script.remove();
        runCalculator();
    };
    script.onerror = () => {
        console.error('Injected script onerror');
    };
    document.body.appendChild(script);
});
