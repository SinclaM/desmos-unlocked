import window from './globals/window';
import extendMathQuill from './extend_mathquill';
//import { pollForValue } from './utils/utils';

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

window.dsuProxy = new Proxy(
    window.ALMOND_OVERRIDES ? window.ALMOND_OVERRIDES : {},
    {
        get(target, prop, receiver) {
            console.log('dsuProxy working');
            if (prop === 'define') {
                oldDefine = window.define;
                return newDefine;
            } else {
                return Reflect.get(target, prop, receiver);
            }
        },
    }
);
window.ALMOND_OVERRIDES = window.dsuProxy;
delete window.dsuProxy;

