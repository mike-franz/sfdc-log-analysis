"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoqlCalls = void 0;
class SoqlCalls {
    constructor() {
        this.callText = '';
        this.calls = new Array();
        this.callDetails = new Array();
    }
    callBegin(lineNumber, lineSplit) {
        if (lineSplit.length != 5) {
            console.log('Invalid SOQL line at ' + lineNumber);
            return;
        }
        this.callText = lineSplit[4];
    }
    callEnd(lineNumber, lineSplit, currentContext) {
        if (lineSplit.length != 4) {
            console.log('Invalid SOQL line at ' + lineNumber);
            return;
        }
        let endDetails = lineSplit[3];
        for (let index = 0; index < this.calls.length; index++) {
            if (this.calls[index] === this.callText) {
                this.callDetails[index].updateDetails(endDetails, currentContext);
                return;
            }
        }
        this.calls.push(this.callText);
        this.callDetails.push(new soqlCallDetails(endDetails, currentContext));
    }
    appendToOutput(outputText) {
        //Don't output this section if there are no SOQL calls
        if (this.calls.length == 0) {
            return outputText;
        }
        outputText.push(' ');
        outputText.push('-----------------------------------------------------------------------------');
        outputText.push('                          SOQL Limits Sections');
        outputText.push('-----------------------------------------------------------------------------');
        for (let i = 0; i < this.calls.length; i++) {
            outputText.push(this.calls[i]);
            outputText.push('   Calls: ' + this.callDetails[i].details.length);
            outputText.push('   Result: ');
            for (let j = 0; j < this.callDetails[i].details.length; j++) {
                outputText.push('       ' + this.callDetails[i].details[j]);
            }
            outputText.push(' ');
        }
        return outputText;
    }
}
exports.SoqlCalls = SoqlCalls;
class soqlCallDetails {
    constructor(details, context) {
        this.details = new Array();
        this.details.push('Context: ' + context + ' Details: ' + details);
    }
    updateDetails(details, context) {
        this.details.push('Context: ' + context + ' Details: ' + details);
    }
}
//# sourceMappingURL=soqlCalls.js.map