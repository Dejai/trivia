// Used to represent a single File used within the trivia world

export default class File {
    Name:string;
    Path:string;

    constructor(name:string, path:string){
        this.Name = name;
        this.Path = path;
    }   

}