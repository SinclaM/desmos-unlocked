import window from '../globals/window';
import extendMathQuill from './extend_mathquill';
import { pollForValue } from '../utils/utils';
import injectScript from '../utils/injectScript';
import { postMessageUp, listenToMessageDown } from '../utils/messages';

let oldDefine!: any;
function newDefine(moduleName: string, dependencies: any, definition: any) {
    if (moduleName === 'mathquill_src') {
        // override should either be `{dependencies, definition}` or just `definition`
        dependencies = extendMathQuill;
    }
    return oldDefine(moduleName, dependencies, definition);
}

// without this, you get Error: touchtracking missing jquery
newDefine.amd = {
    jQuery: true,
};

window.ALMOND_OVERRIDES = new Proxy(window.ALMOND_OVERRIDES ? window.ALMOND_OVERRIDES : {}, {
    get(target, prop, receiver) {
        console.log('ALMOND_OVERRIDES proxy success');
        if (prop === 'define') {
            oldDefine = window.define;
            return newDefine;
        } else {
            return Reflect.get(target, prop, receiver);
        }
    },
});

function runCalculator() {
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
                // DesModder needs the following lines added
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

if (document.currentScript.getAttribute('run-calculator')) {
    pollForValue(
        () => (document.querySelector('script[src^=\'/assets/build/calculator_desktop\']') as HTMLScriptElement)?.src
    ).then((src) => {
        /* we blocked calculator_desktop.js earlier to ensure that the preload/override script runs first.
  Now we load it, but with '??' appended to prevent the web request rules from blocking it */
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
}
