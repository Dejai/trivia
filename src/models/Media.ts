
export default class Media{

    Name:string;
    DisplayName:string;
    FileName:string;
    Url:string;
    Type:string = ""

    constructor(details:any){
        let gameID = details?.GameID ?? ""
        this.Name = details?.Name?.replace(`${gameID}_`, "") ?? "n/a";
        this.DisplayName = this.Name.replace(this.getFileExt(), "")
        this.FileName = details?.Name ?? "n/a";
        this.Url = details?.Url ?? "";
        this.setMediaType();
    }

    getFileExt(){
        let dotIdx = this.Name.indexOf(".")
        let ext =  this.Name.substring(dotIdx)
        return ext
    }

    setMediaType(){
        let ext = this.getFileExt()
        switch(ext){
            case ".png":
            case ".jpeg":
            case ".jpg":
                this.Type = "Image";
                break;
            case ".mp3":
                this.Type = "Audio";
                break;
            default:
                this.Type = "Unknown";
                break;
        }
    }
}