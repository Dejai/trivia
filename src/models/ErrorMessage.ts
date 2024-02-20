// Used to capture a set of error messages (and related detail)

export default class ErrorMessage { 
    Message:string;
    Details:string[] = []

    constructor(message:string){
        this.Message = message
    }

    addDetail(detail:string){
        this.Details.push(detail)
    }

    hasDetails(){
        return this.Details.length > 0
    }
}
