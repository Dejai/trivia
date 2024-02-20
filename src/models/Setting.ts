export default class Setting { 

    Name: string;
    Type: string;
    OptionID: number;
    Value?:string

    constructor(details:any){
        this.Name = details?.Name ?? "";
        this.Type = details?.Type ?? "select";
        this.OptionID = details?.OptionID ?? 1;
        this.Value = details?.Value ?? undefined;
    }
}