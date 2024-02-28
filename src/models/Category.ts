import QuestionAnswerPair from "@/models/QuestionAnswerPair";
import { TagFactory, Tag } from "@/models/Tags";
import config from '@/assets/config/app.json'

export default class Category {

    CategoryID:string;
    Name:string;
    Order:number = 1;
    Tags:string[]; 
    SortBy:string;
    QuestionAnswerPairs: QuestionAnswerPair[];

    constructor(details:any){
        this.CategoryID = details?.CategoryID ?? "";
        this.Name = details?.Name ?? "";
        this.Order = details?.Order ?? 1;
        this.Tags = details?.Tags ?? [];
        this.SortBy = details?.SortBy ?? "Value"  // other option is Custom Order
        this.QuestionAnswerPairs = details?.QuestionAnswerPairs?.map( (obj:any, idx:number) => new QuestionAnswerPair(obj, idx, this.Name) ) ?? []
    }

    updateCategory(details:any){
        // this.Name = details?.Name ?? this.Name;
        this.CategoryID = details?.CategoryID ?? this.CategoryID;
        this.Name = details?.Name ?? this.Name;
        this.Order = details?.Order ?? this.Order;
        this.Tags = details?.Tags ?? this.Tags;
        this.SortBy = details?.SortBy ?? this.SortBy
    }

    hasTag(tagName:string){
        let match = this.Tags?.filter( (tag:string) => tag == tagName ) ?? []
        return match.length == 1
    }

    addNewPair(qnaPair:any){
        let newPair = qnaPair;
        if(this.QuestionAnswerPairs != null){
            this.QuestionAnswerPairs.push(newPair)
        }
    }

    // Use the next possible order
    getNextQnAOrder(){
        return (this?.QuestionAnswerPairs?.length) ?? 0
    }

    // Get the next possible value
    getNextQnAValue(){
        let vals:number[] = this?.QuestionAnswerPairs?.map( (x:any) => x.Value) ?? []
        let max = Math.max(...vals) ?? 0
        return (max + 1)
    }


    updateQuestionOrder(oldOrder:number, newOrder:number){
        let oldSpot = this.QuestionAnswerPairs?.filter( (x:any) => x.Order == oldOrder)?.[0] ?? undefined
        let newSpot = this.QuestionAnswerPairs?.filter( (x:any) => x.Order == newOrder)?.[0] ?? undefined

        if(oldSpot != undefined){
            oldSpot.Order = newOrder
        }

        if(newSpot != undefined){
            newSpot.Order = oldOrder
        }
    }

    removePair(value:number){
        this.QuestionAnswerPairs = this.QuestionAnswerPairs?.filter( pair => pair.Value != value) ?? [];
    }

    // Return if this category is a final jeopardy category
    isFinalJeopardy(){
        return (this.Tags?.filter( (t:string) => t == config.Tags.FinalJeopardy )?.length ?? 0) > 0
    }

}