// Used to represent a single Answer

export default class Question {

    Text:string;
    SubText:string = "";
    AudioRef: string;
    ImageRef: string;
    Url:string;

    constructor(details:any){
        this.Text = decodeURIComponent(details?.Text ?? "");
        this.SubText = decodeURIComponent(details?.SubText ?? "");
        this.AudioRef = details?.AudioRef ?? "";
        this.ImageRef = details?.ImageRef ?? "";
        this.Url = details?.Url ?? ""
    }

}