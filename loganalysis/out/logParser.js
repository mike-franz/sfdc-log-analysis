"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogParser = void 0;
const vscode = require("vscode");
const limitSections_1 = require("./limitSections");
const callstack_1 = require("./callstack");
const soqlCalls_1 = require("./soqlCalls");
class LogParser {
    constructor() {
        this.limitSections = new limitSections_1.LimitSections();
        this.callstack = new callstack_1.Callstack();
        this.soqlCalls = new soqlCalls_1.SoqlCalls();
        this.isLimitSection = false;
        this.isInCumulativeLimitSection = false;
        this.fatalErrorOccurred = false;
        this.currentLimitSectionName = '';
        this.currentLimitSectionText = [];
    }
    /**
     * name
     */
    parse(document) {
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
                this.callstack.processStarted(lineNumber, lineSplit);
                break;
            case "CODE_UNIT_FINISHED":
            case "METHOD_EXIT":
                this.callstack.processExit();
                break;
            case "CUMULATIVE_LIMIT_USAGE":
                this.isInCumulativeLimitSection = true;
                break;
            case "CUMULATIVE_LIMIT_USAGE_END":
                this.isInCumulativeLimitSection = false;
                break;
            case "LIMIT_USAGE_FOR_NS":
                this.startLimitSection(lineNumber, lineSplit);
                break;
            case "SOQL_EXECUTE_BEGIN":
                this.soqlCalls.callBegin(lineNumber, lineSplit);
                break;
            case "SOQL_EXECUTE_END":
                this.soqlCalls.callEnd(lineNumber, lineSplit, this.callstack.currentContext());
                break;
            case "FATAL_ERROR":
                this.fatalErrorOccurred = true;
                break;
        }
        return lineNumber;
    }
    displayOutput() {
        let outputText = [];
        outputText = this.limitSections.appendToOutput(outputText);
        outputText = this.soqlCalls.appendToOutput(outputText);
        outputText = this.callstack.appendToOutput(outputText);
        var setting = vscode.Uri.parse("untitled:" + "LogAnalysis_" + Date.now() + ".txt");
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
        if (this.isInCumulativeLimitSection == false || this.fatalErrorOccurred) {
            return;
        }
        //Limit sections have a empty line before the next log line
        if (lineText.trim() === '') {
            this.isLimitSection = false;
            this.limitSections.upsertSection(this.currentLimitSectionName, this.currentLimitSectionText);
            return;
        }
        this.currentLimitSectionText[this.currentLimitSectionText.length] = lineText;
    }
}
exports.LogParser = LogParser;
//# sourceMappingURL=logParser.js.map