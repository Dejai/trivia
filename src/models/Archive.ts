import Team from '@/models/Team'

export default class Archive { 
    Date:Date;
    Session:string;
    Teams: Team[]
    constructor(details:any){
        this.Date = details?.Date ?? ""
        this.Session = details?.Session ?? ""
        console.log(details);
        this.Teams = details?.Teams?.map( (x:any) => new Team(x)) ?? []

        // sort teams ased on final score
        this.Teams.sort( (a:any, b:any) => b.FinalScore - a.FinalScore)
    }

    getWinners() :string {
        let highScore = 0;
        console.log(this.Teams)
        let winningScore = Math.max(...this.Teams.map( (x:Team) => x.FinalScore))
        let winners = this.Teams.filter( (x:Team) => x.Score == winningScore).map( (y:Team) => y.Name)
        return winners.join(" / ")
    }
}
