interface CommandMap {
    [index: string]: Replacement;
}

interface Replacement {
    // The name to be used in the mock LaTeX command. Also acts as the name Desmos
    // uses when giving error messages. This is not necessarily the actual shortcut
    // recognized by MathQuill, although in practice it is often the same.
    cmdName: string;
    // Alt code for desired unicode symbol. In decimal, not hex.
    altCode: string;
    // A more detailed description, although in practice very similar to `shortcut`.
    // Not sure if/where this would appear in Desmos.
    description?: string;
}

type bindFunction = (latex: string, mqAltCode: string, description: string) => any; // FIXME

export function remap(cmds: { [index: string]: any }, replacements: CommandMap, bind: bindFunction) {
    Object.keys(replacements).forEach(
        (name) =>
            (cmds[name] = bind(
                `\\${replacements[name].cmdName}`,
                `&#${replacements[name].altCode}`,
                replacements[name].description
            ))
    );
}

export const emojis: CommandMap = {
    burger: { cmdName: "burger", altCode: "127828", description: "burger" },
    hotdog: { cmdName: "hotdog", altCode: "127789", description: "Hot dog" },
};
