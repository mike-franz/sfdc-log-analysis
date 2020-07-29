"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Callstack = void 0;
const stack_1 = require("./stack");
class Callstack {
    constructor() {
        this.callStack = new stack_1.stack();
        this.callStackOutputText = [];
    }
    processStarted(lineNumber, lineSplit) {
        let scopeName = '';
        if (lineSplit.length === 4) {
            scopeName = lineSplit[3];
        }
        else if (lineSplit.length === 5) {
            scopeName = lineSplit[4];
        }
        else {
            console.debug('Invalid Code Unit Line: ' + lineNumber);
            return;
        }
        let scopeWithTabs = '';
        const stackSize = this.callStack.length();
        for (let index = 0; index < stackSize; index++) {
            scopeWithTabs += '\t';
        }
        scopeWithTabs += scopeName;
        this.callStackOutputText[this.callStackOutputText.length] = scopeWithTabs;
        this.callStack.push(scopeName);
    }
    currentContext() {
        let context = this.callStack.peek();
        if (context === null) {
            console.log('Callstack is empty');
            return '';
        }
        return context;
    }
    processExit() {
        if (!this.callStack.hasData()) {
            return;
        }
        this.callStack.pop();
    }
    appendToOutput(outputText) {
        outputText.push(' ');
        outputText.push('-----------------------------------------------------------------------------');
        outputText.push('                           Call Workflow');
        outputText.push('-----------------------------------------------------------------------------');
        for (let i = 0; i < this.callStackOutputText.length; i++) {
            outputText.push(this.callStackOutputText[i]);
        }
        return outputText;
    }
}
exports.Callstack = Callstack;
//# sourceMappingURL=callstack.js.map