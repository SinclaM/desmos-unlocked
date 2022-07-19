<div align="center">

<p>
	<img  width="128" src="https://user-images.githubusercontent.com/82351204/179812535-eb396fdb-2ea3-47c1-999e-940af41f2cd5.png">
</p>
<h1>Desmos Unlocked</h1>

[![Chrome Web Store][WebStoreBadge]][WebStore]
[![Addons.mozilla.org][AmoBadge]][Amo]
[![Microsoft Edge Addons][EdgeBadge]][Edge]

</div>

Write beautiful equations in the Desmos graphing calculator by customizing the underlying math formula editor
from an easy-to-use control panel.

Desmos provides shortcuts for a limited amount of symbols (e.g `pi`, `theta`, `sqrt`) by default and this browser
extension expands shortcut functionality to the rest of the Greek letters as well as to some common and
more advanced mathematical symbols.

Support for the following features planned:
* A couple more Greek letters (`varrho`, `varpi`, `varepsilon`, `varphi`, `varkappa`, and `varsigma`), which currently conflict with the builtin `var` shortcut.
* Auto parenthesizing functions like `sin`, `log`, etc.
* Customizing which operators (`+`, `-`, `*`, etc.) will bring the cursor out of a superscript or subscript.
* Enabling shortucts in superscripts and subscripts.

## Download links
* Firefox: https://addons.mozilla.org/en-US/firefox/addon/desmos-unlocked/
* Chrome: https://chrome.google.com/webstore/detail/desmos-unlocked/mgkcmbkophlnagckoodcmaeofginaokm
* Edge: https://microsoftedge.microsoft.com/addons/detail/desmos-unlocked/lojelmbmlhfakfgnngkmmfhjbianabgh
* Opera: https://addons.opera.com/en/extensions/details/desmos-unlocked/

## Installing locally
You can also install the extension for Firefox, Chrome, Edge, and Opera as a temporary add-on. First, go to 
[releases](https://github.com/SinclaM/desmos-unlocked/releases) and download the zipped distribuition for 
your browser of choice from the latest release.

### Firefox
* Type `about:debugging` in the URL bar.
* Click on __This Firefox__.
* Under __Temporary Extensions__, click __Load Temporary Addon...__ and select the zip file you downloaded.
* The extension will remain installed until you restart Firefox.

### Google Chrome, Microsoft Edge, and Opera
* Unzip the file you downloaded.
* Type `about://extensions` in the URL bar.
* Enable __Developer mode__ via the toggle.
* Click __Load unpacked__ and select the folder that the zip file expanded to when you unzipped it. Make sure to select the folder itself and not any files in the folder.
* The extension will remain installed until you restart your browser.

## Building from source
### Operating system requirements
All instructions have been tested on macOS Monterrey 12.0.1 and Ubuntu 22.04, but any modern OS should work.
### Necessary tools
`npm` is necessary. Instructions have been tested with `npm` version 8.10.0 and `node` version 18.0.0. These tools can be downloaded from https://nodejs.org/en/download/.
### Commands to run
In the project root directory (where `package.json` is located), first run:

`npm install`

Once `npm` has finished installing dependencies, run:

`npm run app:firefox`, `npm run app:chrome`, `npm run app:edge`, or `npm run app:opera`

to build for Firefox, Chrome, Microsoft Edge, or Opera, respectively.

The built code will be located in the `dist` directory.

<!-- Badges -->
[AmoBadge]: https://img.shields.io/amo/v/%7B43359c03-2c83-4d28-8982-00e011b097ee%7D?label=Firefox&logo=Firefox&logoColor=%23FFFFFF
[EdgeBadge]: https://img.shields.io/badge/dynamic/json?label=Edge&logo=microsoft-edge&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Flojelmbmlhfakfgnngkmmfhjbianabgh
[WebStoreBadge]: https://img.shields.io/chrome-web-store/v/mgkcmbkophlnagckoodcmaeofginaokm?label=Chrome&logo=Google%20Chrome&logoColor=%23FFFFFF

<!-- Download -->
[Amo]: https://addons.mozilla.org/en-US/firefox/addon/desmos-unlocked/
[Edge]: https://microsoftedge.microsoft.com/addons/detail/desmos-unlocked/lojelmbmlhfakfgnngkmmfhjbianabgh
[WebStore]: https://chrome.google.com/webstore/detail/desmos-unlocked/mgkcmbkophlnagckoodcmaeofginaokm
