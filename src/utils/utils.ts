import { AutoCommandsToSymbols } from "./autoCommands";

interface FuncAny {
    (): any;
}

export async function pollForValue(func: FuncAny) {
    return await _pollForValue(func);
}

function _pollForValue<T>(func: () => T) {
    return new Promise<T>((resolve) => {
        const interval = setInterval(() => {
            const val = func();
            if (val !== null && val !== undefined) {
                clearInterval(interval);
                resolve(val);
            }
        }, 50);
    });
}

// Log changes to storage for testing
export function monitorStorage() {
    browser.storage.onChanged.addListener(function (changes, namespace) {
        for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
            console.log(
                `Storage key '${key}' in namespace '${namespace}' changed.`,
                `Old value was '${oldValue}', new value is '${newValue}'.`
            );
        }
    });
}

// Set many sliders at once. Used when the user presses a reset-to-default button.
// toSet is an array of all the strings for the option 'opt' to be set.
export function massSet(toSet: string[], opt: string) {
    document.querySelectorAll(".grid .latex-item").forEach(function (item) {
        item.querySelector<HTMLInputElement>(".onoffswitch-checkbox").checked = toSet.includes(item.id);
    });

    // MathQuill requires autoCommands to be a non-empty space-delimited list of
    // commands. So keepmeKEEPME should always remain in storage for autoCommands
    // to avoid MathQuill throwing errors if the user disables all shortucts.
    // [opt] because otherwise it will assign the literal string 'opt' as the field name.
    browser.storage.local.set({ [opt]: opt === "autoCommands" ? "keepmeKEEPME " + toSet.join(" ") : toSet.join(" ") });
}

// Create the DOM node for the items that will be placed in the grid.
// e.g. 'α alpha [slider]'
function createGridItem(templateID: string, symbol: string, shortcut: string, commands: string[]) {
    let html = document.getElementById(templateID).innerHTML;
    html = html.replace(/#symbol#/g, symbol);
    html = html.replace(/#shortcut#/g, shortcut);
    const node = new DOMParser().parseFromString(html, "text/html").body.firstElementChild as HTMLElement;
    node.querySelector<HTMLInputElement>(".onoffswitch-checkbox").checked = commands.includes(shortcut);

    // Stop overflow of long shortcuts by letting them span both columns.
    // This feels like a bad way of styling this but oh well.
    if (shortcut.length > 9) {
        node.style.gridColumn = "1 / span 2";
    }

    return node;
}

// Populate the grid with fancy sliders for all the symbols -> shortcuts in dict.
export function populateGrid(templateID: string, gridID: string, dict: AutoCommandsToSymbols, autoCommands: string) {
    const grid = document.getElementById(gridID);
    for (const shortcut in dict) {
        grid.append(createGridItem(templateID, dict[shortcut], shortcut, (autoCommands as string).split(" ")));
    }
}

export async function storeConfig(this: HTMLInputElement) {
    let wordToStore = this.parentElement.parentElement.id;
    const opt = this.parentElement.parentElement.getAttribute("opt");
    const storageObj = await browser.storage.local.get(opt);
    const currentlyStored = storageObj[opt].toString();
    if (this.checked) {
        if (currentlyStored !== "") {
            wordToStore = " " + wordToStore;
        }
        browser.storage.local.set({ [opt]: currentlyStored + wordToStore });
    } else {
        const newStorage = currentlyStored
            .split(" ")
            .filter((word) => word != wordToStore)
            .join(" ");
        browser.storage.local.set({ [opt]: newStorage });
    }
}

export async function toggleConfig(configOption: string) {
        const stored = await browser.storage.local.get(configOption);
        browser.storage.local.set({ [configOption]: !stored[configOption] });
}
