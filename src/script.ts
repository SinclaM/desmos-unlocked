/// <reference types="web-ext-types"/>
import { pollForValue } from "./utils/utils";
import window from "./globals/window";
import { MathQuillConfig } from "./globals/config";

const handler = (({ detail }: CustomEvent<MathQuillConfig>) => {
    // Have to wait for all the preload modifications to finish
    pollForValue(() => window.Desmos?.MathQuill?.config).then(() => {
        // detail.isAutoParenEnabled could be undefined. We have to
        // check if it is strictly true or false. Stay classy, JavaScript.
        if (detail.isAutoParenEnabled === true) {
            detail.autoParenthesizedFunctions = getAutoOperators();
        } else if (detail.isAutoParenEnabled === false) {
            // The MathQuill API requires a space-delimited list
            // of only letters. An empty string will throw an error.
            // So we set the autoParenthesizedFunctions to this
            // placeholder that is not even a function anyway (and
            // is unlikely to ever be made one).
            detail.autoParenthesizedFunctions = "THISISNOTAFUNCTION";
        }
        delete detail.isAutoParenEnabled;
        window.Desmos.MathQuill.config(detail);
        document.removeEventListener("send-config", handler);
    });
}) as EventListener;

document.addEventListener("send-config", handler);

function getAutoOperators() {
    // getAutoOperators will return a string which is almost a space-delimited list of only
    // letters (as MathQuill expects). Except some functions in this string are followed by a
    // | and more verbose breakdown of the function. For example, in this string might be
    // ln|natural-log. The regex filters out the verbose parts and keeps just the function
    // names.
    return window
        .require("main/mathquill-operators")
        .getAutoOperators()
        .replace(/\|[^ ]*/g, "");
}
