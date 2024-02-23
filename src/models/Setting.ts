import rules from '@/assets/config/rules.json'

export default class Setting { 

    Name: string;
    Type: string;
    OptionID: number;
    Value?:string

    constructor(details:any){
        this.Name = details?.Name ?? "";
        this.Type = details?.Type ?? "select";
        this.OptionID = details?.OptionID ?? 1;
        this.Value = details?.Value ?? this._getDefaultValue();
    }

    // Get default value
    _getDefaultValue(){
        let rule = rules.filter( (x:any) => x.Name == this.Name)?.[0]
        return rule?.Value ?? 0
    }
}