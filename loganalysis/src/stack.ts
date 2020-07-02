export class stack {

    private data : string[];

    constructor()
    {
        this.data = [];
    }

    public push(line : string)
    {
        this.data.push(line);
    }

    public pop()
    {
        if(this.data.length == 0)
        {
            return null;
        }
  
        return this.data.pop();
    }

    public peek()
    {
        if(this.data.length == 0)
        {
            return null;
        }

        return this.data[0];
    }

    public hasData()
    {
        return this.data.length > 0;
    }

    public length()
    {
        return this.data.length;
    }
}