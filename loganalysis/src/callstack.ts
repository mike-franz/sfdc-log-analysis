import { stack } from './stack';

export class Callstack {

    constructor() {
        
        this.callStack = new stack();
        this.callStackOutputText = [];
    }

    private callStackOutputText: string[];
    private callStack : stack;

    public processStarted(lineNumber : number, lineSplit : string[])
    {
        let scopeName : string = '';
        if(lineSplit.length === 4)
        {
            scopeName = lineSplit[3];
        } 
        else if(lineSplit.length === 5)
        {
            scopeName = lineSplit[4];
        }
        else
        {
            console.debug('Invalid Code Unit Line: '  + lineNumber);
            return;
        }

        let scopeWithTabs = '';

        const stackSize = this.callStack.length();
        for(let index = 0; index < stackSize; index++)
        {
            scopeWithTabs += '\t';
        }

        scopeWithTabs += scopeName;

        this.callStackOutputText[this.callStackOutputText.length] = scopeWithTabs;
        this.callStack.push(scopeName);
    }

    public currentContext()
    {
        let context = this.callStack.peek();
        if(context === null)
        {
            console.log('Callstack is empty');
            return '';
        }

        return context;
    }

    public processExit()
    {
        if(!this.callStack.hasData())
        {
            return;
        }

        this.callStack.pop();
    }

    public appendToOutput(outputText : string[])
    {
        outputText.push(' ');
        outputText.push('-----------------------------------------------------------------------------');
        outputText.push('                           Call Workflow');
        outputText.push('-----------------------------------------------------------------------------');

        for(let i = 0; i < this.callStackOutputText.length; i++)
        {
            outputText.push(this.callStackOutputText[i]);
        }

        return outputText;
    }
}