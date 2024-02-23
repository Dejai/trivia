import Setting from './Setting';
import rules from '@/assets/config/rules.json'

export default class Session { 

    // Name: string;
    Code: string; 
    Expires: any;
    Settings: Setting[]; 
    IsExpired: boolean = false;

    constructor(details:any){
        // this.Name = details?.Name ?? "";
        this.Code = details?.Code ?? "";
        this.Expires = details?.Expires ?? {};
        this.Settings = this._mapToSettings(details?.Settings) ?? undefined;

        // Add missing settings ono load
        this._addMissingSettings()

        this.setIsExpired()
    }

    updateSession(details:any){
        // this.Name = details?.Name ?? this.Name;
        this.Code = details?.Code ?? this.Code;
        this.Expires = details?.Expires ?? this.Expires;
        this.Settings = this._mapToSettings(details?.Settings) ?? this.Settings;

        this.setIsExpired();
    }

    getSetting(settingName:string){
        return this.Settings?.filter( (x:Setting) => x.Name == settingName)?.[0] ?? undefined
    }

    _mapToSettings(settingList:any){
        // return undefined
        return (settingList != undefined) ? settingList?.map( (setting:any) => new Setting(setting) ) : [];
    }

    _addMissingSettings(){
        for(let rule of rules){
            let settingName = rule.Name
            let exists = this.Settings.filter( (x:Setting) => x.Name == settingName)?.[0] ?? undefined
            if(exists == undefined){
                this.Settings.push( new Setting(rule))
            }
        }
    }

    // Get the expiration date 
    getExpirationDate(){
        try {
            let m = this.Expires?.Month ?? ""
            let d = this.Expires?.Day ?? ""
            let y = this.Expires.Year ?? ""
            let date = new Date(`${m} ${d} ${y}`)
            return date
        } catch(err){
            return new Date()
        }
    }

    // Get the option ID & value f a given setting
    getSettingValue(settingName:string){
        let setting = this.Settings?.filter( (s:Setting) => s.Name == settingName )?.[0] ?? undefined
        let optionID = setting?.OptionID ?? 0
        let value = setting?.Value ?? ""
        return { optionID, value }
    }

    isExpired(){
        let today = new Date()
        let date = this.getExpirationDate()
        return date <= today
    }

    setIsExpired(){
        let today = new Date()
        let date = this.getExpirationDate()
        this.IsExpired = (date <= today)
    }
}