"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const logParser_1 = require("./logParser");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('sfdcloganalysis.fullanalysis', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user= 
        console.log('Starting log processing');
        try {
            if (vscode.window.activeTextEditor != null) {
                vscode.window.showInformationMessage('Starting Log Analysis');
                var parser = new logParser_1.LogParser();
                parser.parse(vscode.window.activeTextEditor.document);
                vscode.window.showInformationMessage('Log Analysis Complete');
            }
            else {
                vscode.window.showInformationMessage('No log file found');
            }
        }
        catch (e) {
            vscode.window.showInformationMessage(e.message);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map