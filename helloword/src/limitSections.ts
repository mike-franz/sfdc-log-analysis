export class LimitSections {

    constructor() {
        this.sectionNames = [];
        this.sectionText = new Array(new Array());
    }

    private sectionNames : string[];
    private sectionText : string[][];

    public upsertSection(sectionName : string, sectionText : string[])
    {
        let sectionIndex = this.getSectionIndex(sectionName);

        if(sectionIndex === -1)
        {
            sectionIndex = this.sectionNames.length;
            this.sectionNames[sectionIndex] = sectionName;
            this.sectionText[sectionIndex] = sectionText;

            return;
        }

        this.sectionText[sectionIndex] = sectionText;
    }

    public appendToOutput(outputText : string[])
    {
        for(let i = 0; i < this.sectionText.length; i++)
        {
            outputText.push('Limit Section: ' + this.sectionNames[i]);
            for(let j = 0; j < this.sectionText[i].length; j++)
            {
                outputText.push(this.sectionText[i][j]);
            }
        }

        return outputText;
    }

    private getSectionIndex(sectionName : string)
    {
        for(let i = 0; i < this.sectionNames.length; i++)
        {
            if(this.sectionNames[i] === sectionName)
            {
                return i;
            }
        }

        return -1;
    }



}