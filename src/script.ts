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
    // Get all the autoOperatorNames in the first editable field in the expression
    // window. Then, filter out the ones that are not only letters, in order to comply
    // with the MathQuill API. Then return the string of all these names.
    // Another approach would be use window.require("main/mathquill-operators").getAutoOperators()
    // and then remove the '|'s included in that string, but those operators returned by the
    // require are the Desmos defaults. It's possible that someone might override those defaults
    // (e.g. through DesModder). But then again, someone overriding the defaults might just do
    // it by overriding the main/mathquill-operators module anyway 🤷.
    return Object.keys(
        window.Desmos.MathQuill(document.querySelector(".dcg-mq-editable-field")).__options.autoOperatorNames
    )
        .filter((opName) => /^[a-zA-Z]+$/.test(opName))
        .join(" ");
}
