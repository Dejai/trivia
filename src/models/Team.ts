
export default class Team { 
    Name:string;
    Code:string;
    Answer:string;
    Score: number;
    FinalScore: number = 0;
    Wager?:number = undefined;

    // Calculated fields
    FinalAnswerCorrect: boolean = false;
    HasWager:boolean = false;

    constructor(details:any){
        this.Name = details?.name ?? details?.Name ?? ""
        this.Code = details?.code ?? details?.Code ?? ""
        this.Score = details?.score ?? details?.Score ?? 0
        this.FinalScore = details?.finalScore ?? details?.FinalScore ?? 0;
        this.Answer = details?.answer ?? details.Answer ?? ""
        // this.Wager = details?.wager ?? undefined;
        // Set wager
        this.setWager(details?.wager ?? undefined)
    }

    updateScore(modifier:number){
        this.Score += modifier
        this.FinalScore = this.Score //set the final score to match the score as it gets updated
    }

    // Setting final score
    setFinalScore(maxValue:number){
        let wagerVal = (this.Wager != undefined) ? this.Wager : 0
        let wagerMin = Math.min(maxValue, wagerVal)
        let modifier = (this.FinalAnswerCorrect) ? wagerMin : -(wagerMin)
        this.FinalScore = (this.Score + modifier)
    }
    setFinalAnswerPass(status:boolean){
        this.FinalAnswerCorrect = status;
    }

    // Set the wager for this team
    setWager(wagerValue:number|undefined){
        this.Wager = wagerValue
        this.HasWager = (this.Wager != undefined)
    }
}
