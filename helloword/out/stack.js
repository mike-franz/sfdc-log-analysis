"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stack = void 0;
class stack {
    constructor() {
        this.data = [];
    }
    push(line) {
        this.data.push(line);
    }
    pop() {
        if (this.data.length == 0) {
            return null;
        }
        return this.data.pop();
    }
    peek() {
        if (this.data.length == 0) {
            return null;
        }
        return this.data[0];
    }
    hasData() {
        return this.data.length > 0;
    }
    length() {
        return this.data.length;
    }
}
exports.stack = stack;
//# sourceMappingURL=stack.js.map