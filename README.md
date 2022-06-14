<img align="left" src="public/images/logo/128.png">

# Desmos Unlocked
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
* Chrome, Edge, Opera: __coming soon__

## Installing locally
You can also install the extension for Firefox, Chrome, Edge, and Opera as a temporary add-on. First, go to 
[releases](https://github.com/SinclaM/desmos-unlocked/releases) and download the zipped distribuition for 
your browser of choice from the latest release.

### Firefox
* Type `about:debugging` in the URL bar.
* Click on __This Firefox__.
* Under __Temporary Extensions__, click __Load Temporary Addon...__ and select the zip file you downloaded.
* The extension will remain installed until you restart Firefox.

### Google Chrome
* Unzip the file you downloaded.
* Type `chrome://extensions` in the URL bar.
* Enable __Developer mode__ via the toggle on the top right of the page.
* Click __Load unpacked__ and select the folder that the zip file expanded to when you unzipped it. Make sure to select the folder itself and not any files in the folder.
* The extension will remain installed until you restart Chrome.

### Microsoft Edge
* Unzip the file you downloaded.
* Type `edge://extensions` in the URL bar.
* Enable __Developer mode__ via the toggle on the bottom left of the page.
* Click __Load unpacked__ and select the folder that the zip file expanded to when you unzipped it. Make sure to select the folder itself and not any files in the folder.
* The extension will remain installed until you restart Edge.

### Opera
* Unzip the file you downloaded.
* Type `opera://extensions` in the URL bar.
* Enable __Developer mode__ via the toggle on the top right of the page.
* Click __Load unpacked__ and select the folder that the zip file expanded to when you unzipped it. Make sure to select the folder itself and not any files in the folder.
* The extension will remain installed until you restart Opera.

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
