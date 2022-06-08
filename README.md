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

## Building from source
### Operating system requirements
I used MacOS Monterrey 12.0.1 to build this extension, but any modern OS should work.
### Necessary tools
`npm` is necessary. I am using `npm == 8.10.0` and `node` v18.0.0. These tools can be downloaded from https://nodejs.org/en/download/.
### Commands to run
In the project root directory (where `package.json` is located), first run:

`npm install`

Once `npm` has finished installing dependencies, run:

`npm run app:firefox`, `npm run app:chrome`, or `npm run app:edge`

to build for Firefox, Chrome, or Microsoft Edge, respectively.

The built code will be located in the `dist` directory.
