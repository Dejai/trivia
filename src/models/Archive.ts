import Team from '@/models/Team'

export default class Archive { 
    Date:Date;
    Session:string;
    Teams: Team[]
    constructor(details:any){
        this.Date = details?.Date ?? ""
        this.Session = details?.Session ?? ""
        this.Teams = details?.Team?.map( (x:any) => new Team(x)) ?? []
    }
}
