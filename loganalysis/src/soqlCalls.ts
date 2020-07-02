import { Console } from "console";

export class SoqlCalls {

    private calls : string[];
    private callDetails : soqlCallDetails[];
    private callText : string;

    constructor() {
        this.callText = '';
        this.calls = new Array();
        this.callDetails = new Array();
    }

    public callBegin(lineNumber : number, lineSplit : string[])
    {
        if(lineSplit.length != 5)
        {
            console.log('Invalid SOQL line at ' + lineNumber);
            return;
        }

        this.callText = lineSplit[4];
    }

    public callEnd(lineNumber : number, lineSplit : string[])
    {
        if(lineSplit.length != 4)
        {
            console.log('Invalid SOQL line at ' + lineNumber);
            return;
        }

        let endDetails = lineSplit[3];

        for(let index = 0; index < this.calls.length; index++)
        {
            if(this.calls[index] === this.callText)
            {
                this.callDetails[index].updateDetails(endDetails);

                return;
            }
        }

        this.calls.push(this.callText);
        this.callDetails.push(new soqlCallDetails(endDetails));
    }

    public appendToOutput(outputText : string[])
    {
        outputText.push(' ');
        outputText.push('-----------------------------------------------------------------------------');
        outputText.push('                          SOQL Limits Sections');
        outputText.push('-----------------------------------------------------------------------------');

        for(let i = 0; i < this.calls.length; i++)
        {
            outputText.push(this.calls[i]);
            outputText.push('   Calls: ' + this.callDetails[i].details.length);
            outputText.push('   Result: ');
            
            for(let j = 0; j < this.callDetails[i].details.length; j++)
            {
                outputText.push('       ' + this.callDetails[i].details[j]);
            }
        }

        return outputText;
    }
}

class soqlCallDetails { 

    public details : string[];

    constructor(details : string) {
       this.details = new Array();
       this.details.push(details);
    }

    public updateDetails(details : string)
    {
        this.details.push(details);
    }
}