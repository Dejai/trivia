// Used to allow for custom values that are associated with an object


export class Tag { 
    Name:string;
    constructor(name:string){
        this.Name = name
    }
}

export abstract class TagFactory {
    public static  getTags(values?:string[]): Tag[] {
        return []
        // return values?.map(x => new Tag(x)) ?? []
    }

}