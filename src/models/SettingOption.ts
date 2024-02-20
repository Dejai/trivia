

export default class SettingOption { 

    OptionID:number;
    Label:string;
    Type:string;
    Rule:string;
    SubRules?:string;
    Suggestion?:string;

    constructor(details:any){
        this.OptionID = details?.id ?? 0;
        this.Label = details?.label ?? 0;
        this.Type = details?.type ?? 0;
        this.Rule = details?.rule ?? 0;
        this.SubRules = details?.subRules ?? 0;
        this.Suggestion = details?.suggestion ?? 0;
    }
}