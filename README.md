## vscode-js-console-utils-plus

Easily insert, annotate and remove console.log statements

![](https://i.imgur.com/0tiesd2.gif)

## Installing

<!-- This extension is available for free in the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=whtouche.vscode-js-console-utils) -->
This extension is not available in the Visual Studio Code Marketplace now, but you can install it from the [VSIX file](https://github.com/luofc21/vscode-js-console-utils-plus/releases/tag/v1.0.0-alpha).
![img](./assets/images/installByVsix.png)

## Usage

With selection:
* Highlight a variable (or really any text)
* Press Cmd+Shift+W
* The output (on a new line) will be: console.log('variable: ', variable);
* Config the output format in the extension settings (console.formatText: 'variable ===>', varible), the output will be: console.log('variable ===>', varible);
![img](./assets/images/config.png)

Without selection:
* Press Cmd+Shift+W
* The output (on the same line) will be: console.log();

To remove console.logs:
* Press Cmd+Shift+D
* This will delete all console.log statements in the current document

To annotate console.logs:
* Press Cmd+Shift+A
* This will annotate all console.log statements in the current document

## To Do
* Add support for other console.* methods (warn, error, time, timeEnd, etc)
* Add ability to delete console.* across project (currently just the open file)
* ~~When deleting console.*, report how many were deleted~~, across how many files
* Allow configuration to only delete certain types of console.* statements

## License
[MIT License](LICENSE)