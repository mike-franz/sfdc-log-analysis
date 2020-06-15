"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogParser = void 0;
const vscode = require("vscode");
const stack_1 = require("./stack");
const limitSections_1 = require("./limitSections");
class LogParser {
    constructor() {
        this.callStack = new stack_1.stack();
        this.callStackOutputText = [];
        this.headerOutputText = [];
        this.limitSections = new limitSections_1.LimitSections();
        this.isLimitSection = false;
        this.currentLimitSectionName = '';
        this.currentLimitSectionText = [];
        this.buildHeader();
    }
    /**
     * name
     */
    parse(document) {
        console.log('parsing');
        for (var lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
            let lineText = document.lineAt(lineNumber);
            this.processLine(lineNumber, lineText.text);
        }
        this.displayOutput();
    }
    processLine(lineNumber, lineText) {
        //Limit sections do not have a starting timestamp or pipe delimitor
        if (this.isLimitSection) {
            this.processLimitSection(lineNumber, lineText);
            return;
        }
        let lineSplit = lineText.split('|');
        if (lineSplit.length < 2) {
            return;
        }
        let command = lineSplit[1];
        switch (command) {
            case "CODE_UNIT_STARTED":
            case "METHOD_ENTRY":
                this.processStarted(lineSplit);
                break;
            case "CODE_UNIT_FINISHED":
            case "METHOD_EXIT":
                this.processExit();
                break;
            case "LIMIT_USAGE_FOR_NS":
                this.startLimitSection(lineNumber, lineSplit);
                break;
        }
        return lineNumber;
    }
    displayOutput() {
        let outputText = [];
        for (let i = 0; i < this.headerOutputText.length; i++) {
            outputText[outputText.length] = this.headerOutputText[i];
        }
        for (let i = 0; i < this.callStackOutputText.length; i++) {
            outputText[outputText.length] = this.callStackOutputText[i];
        }
        outputText = this.limitSections.appendToOutput(outputText);
        var setting = vscode.Uri.parse("untitled:" + "C:\LogAnalysis.txt");
        vscode.workspace.openTextDocument(setting).then((a) => {
            vscode.window.showTextDocument(a, 1, false).then(e => {
                e.edit(edit => {
                    edit.setEndOfLine(vscode.EndOfLine.LF);
                    for (let lineNumber = 0; lineNumber < outputText.length; lineNumber++) {
                        edit.insert(new vscode.Position(lineNumber, 0), outputText[lineNumber] + '\n');
                    }
                });
            });
        }, (error) => {
            console.error(error);
            debugger;
        });
    }
    startLimitSection(lineNumber, lineSplit) {
        if (lineSplit.length < 3) {
            console.error('Line ' + lineNumber + ': Invalid limit section start');
            return;
        }
        this.currentLimitSectionName = lineSplit[2];
        this.currentLimitSectionText = [];
        this.isLimitSection = true;
    }
    processLimitSection(lineNumber, lineText) {
        //Limit sections have a empty line before the next log line
        if (lineText.trim() === '') {
            this.isLimitSection = false;
            this.limitSections.upsertSection(this.currentLimitSectionName, this.currentLimitSectionText);
            return;
        }
        this.currentLimitSectionText[this.currentLimitSectionText.length] = lineText;
    }
    processStarted(lineSplit) {
        if (lineSplit.length < 5) {
            console.debug('Invalid Code Unit Line');
            return;
        }
        let scopeName = lineSplit[4];
        let scopeWithTabs = '';
        const stackSize = this.callStack.length();
        for (let index = 0; index < stackSize; index++) {
            scopeWithTabs += '\t';
        }
        scopeWithTabs += scopeName;
        this.callStackOutputText[this.callStackOutputText.length] = scopeWithTabs;
        this.callStack.push(scopeName);
    }
    processExit() {
        if (!this.callStack.hasData()) {
            return;
        }
        this.callStack.pop();
    }
    buildHeader() {
        this.headerOutputText[this.headerOutputText.length] = '-----------------------------------------------------------------------------';
        this.headerOutputText[this.headerOutputText.length] = '                                    Callstack';
        this.headerOutputText[this.headerOutputText.length] = '-----------------------------------------------------------------------------';
    }
}
exports.LogParser = LogParser;
//# sourceMappingURL=logParser.js.map