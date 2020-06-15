"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimitSections = void 0;
class LimitSections {
    constructor() {
        this.sectionNames = [];
        this.sectionText = new Array(new Array());
    }
    upsertSection(sectionName, sectionText) {
        let sectionIndex = this.getSectionIndex(sectionName);
        if (sectionIndex === -1) {
            sectionIndex = this.sectionNames.length;
            this.sectionNames[sectionIndex] = sectionName;
            this.sectionText[sectionIndex] = sectionText;
            return;
        }
        this.sectionText[sectionIndex] = sectionText;
    }
    appendToOutput(outputText) {
        for (let i = 0; i < this.sectionText.length; i++) {
            outputText.push('Limit Section: ' + this.sectionNames[i]);
            for (let j = 0; j < this.sectionText[i].length; j++) {
                outputText.push(this.sectionText[i][j]);
            }
        }
        return outputText;
    }
    getSectionIndex(sectionName) {
        for (let i = 0; i < this.sectionNames.length; i++) {
            if (this.sectionNames[i] === sectionName) {
                return i;
            }
        }
        return -1;
    }
}
exports.LimitSections = LimitSections;
//# sourceMappingURL=limitSections.js.map