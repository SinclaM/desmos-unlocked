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

// If ALMOND_OVERRIDES is already defined, DesModder must be enabled.
const isDesmodderActive: boolean = window.ALMOND_OVERRIDES;


// Layer a proxy over DesModder's ALMOND_OVERRIDES proxy, if it's enabled.
window.ALMOND_OVERRIDES = new Proxy(isDesmodderActive ? window.ALMOND_OVERRIDES : {}, {
    get(target, prop, receiver) {
        if (prop === 'define') {
            console.log('ALMOND_OVERRIDES proxy success');

            // If DesModder is enabled, we have to make sure to forward the operation
            // to DesModder's own ALMOND_OVERRIDES proxy. If we use ALMOND_OVERRIDES.define,
            // we'll get infinite recursion. And if we just use window.define, then we'll
            // overwrite DesModder's module overrides.
            oldDefine = isDesmodderActive ? Reflect.get(target, prop, receiver) : window.define;
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
