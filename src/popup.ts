import {desmosDefualtAutoCommands, basicAutoCommands, advancedAutoCommands} from './utils/autoCommands';
import {massSet, storeConfig, populateGrid} from './utils/utils';

const setToDefault = document.getElementById('set-to-default');
const setToDesmosDefault = document.getElementById('set-to-desmos-default');

setToDefault.onclick = function () {
    massSet(
        Array.from(document.querySelectorAll('#desmos-default .latex-item, #basic .latex-item'))
            .map((item) => item.id)
            .filter(function (item) {
                return item !== 'ge' && item !== 'le' && item !== 'ne' && item !== 'pm' && item !== 'mp';
            }),
        'autoCommands'
    );
};

setToDesmosDefault.onclick = function () {
    massSet(
        Array.from(document.querySelectorAll('#desmos-default .latex-item')).map((item) => item.id),
        'autoCommands'
    );
};

// Log changes to storage for testing
// browser.storage.onChanged.addListener(function (changes, namespace) {
//     for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
//         console.log(
//             `Storage key '${key}' in namespace '${namespace}' changed.`,
//             `Old value was '${oldValue}', new value is '${newValue}'.`
//         );
//     }
// });

// Add all the dynamically loaded nodes to the DOM using templates and give
// sliders their funcionality
async function initialize() {
    await populateGrid('grid-item-template', 'desmos-default', desmosDefualtAutoCommands);
    await populateGrid('grid-item-template', 'basic', basicAutoCommands);
    await populateGrid('grid-item-template', 'advanced', advancedAutoCommands);

    // Make the sliders actually update user configs when clicked
    document.querySelectorAll('.latex-item').forEach(function (item) {
        item.querySelector('.onoffswitch-checkbox').addEventListener('click', storeConfig);
    });
}

document.addEventListener('DOMContentLoaded', initialize);


