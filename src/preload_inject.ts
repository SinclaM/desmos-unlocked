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

console.log(window.ALMOND_OVERRIDES);
if (window.ALMOND_OVERRIDES === undefined) {
    window.ALMOND_OVERRIDES = new Proxy(
        {},
        {
            get(target, prop, receiver) {
                if (prop === 'define') {
                    oldDefine = window.define;
                    return newDefine;
                } else {
                    return Reflect.get(target, prop, receiver);
                }
            },
        }
    );
} else {
    window.dsu_proxy = new Proxy(
        window.ALMOND_OVERRIDES,
        {
            get(target, prop, receiver) {
                console.log('dsu_proxy working');
                if (prop === 'define') {
                    oldDefine = window.define;
                    return newDefine;
                } else {
                    return Reflect.get(target, prop, receiver);
                }
            },
        }
    );
    window.ALMOND_OVERRIDES = window.dsu_proxy;
    delete window.dsu_proxy;
}

