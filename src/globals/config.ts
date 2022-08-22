import { CommandMap, emojis } from "../utils/commandMap";

export interface MathQuillConfig {
    autoCommands?: string;
    remaps?: CommandMap;
    charsThatBreakOutOfSupSub?: string;
    isAutoParenEnabled?: boolean;
    autoParenthesizedFunctions?: string;
    disableAutoSubstitutionInSubscripts?: string;
    enableMathquillOverrides?: boolean;
}

export const defaultConfig = {
    autoCommands:
        "keepmeKEEPME alpha beta sqrt theta Theta phi Phi pi Pi tau nthroot cbrt sum prod int ans percent infinity infty gamma Gamma delta Delta epsilon epsiv zeta eta kappa lambda Lambda mu xi Xi rho sigma Sigma chi Psi omega Omega digamma iota nu upsilon Upsilon Psi square mid parallel nparallel perp times div approx",
    remaps: emojis,
    charsThatBreakOutOfSupSub: "+-=<>*",
    isAutoParenEnabled: false,
    disableAutoSubstitutionInSubscripts: true,
    enableMathquillOverrides: false,
};
