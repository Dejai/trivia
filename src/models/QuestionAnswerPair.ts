// Used to group together a question & answer pair

import Answer from "./Answer";
import Question from "./Question";
import { useTagManager } from "@/composables/useTagManager"
import config from '@/assets/config/app.json'

export default class QuestionAnswerPair {

    Value:number;
    Order: number;
    Tags: string[] = [];
    Question: Question;
    Answer: Answer;

    constructor(details:any, order:number, isNew?:boolean){
        this.Value = Number(details?.Value) ?? -1;
        this.Tags = details?.Tags ?? []
        this.Question = new Question(details?.Question ?? {})
        this.Answer = new Answer(details?.Answer ?? {})
        this.Order = order;
        if(isNew){
            this.addTag(config.Tags.NewQuestion)
        }
    }

    udpate(details:any){
        this.Value = details?.Value ?? this.Value
        this.Tags = details?.Tags ?? this.Tags
        this.Order = details?.Order ?? this.Order
        this.Value = details?.Value ?? this.Value
    }

    updateTags(action:string, tag:string){
        this.Tags = useTagManager(action, tag, this.Tags)
    }

    updateOrder(order:number){
        this.Order = order
    }

    addTag(tag:string){
        this._manageTags("add", tag)
    }
    removeTag(tag:string){
        this._manageTags("remove", tag)
    }

    // Manage the tags on this QnA pair
    _manageTags(action:string, tag:string){
        let tagAlreadySet = this.Tags.includes(tag)
        switch(action){
            case "add":
                if(!tagAlreadySet){
                    this.Tags.push(tag)
                }
                break;
            case "delete":
            case "remove":
                if(tagAlreadySet){
                    this.Tags = this.Tags.filter( (x:string) => x != tag)
                }
                break;
            default:
                break;
        }
    }

    // Confirm if this QnA pair is a new one
    isNew(){
        return this.Tags.includes(config.Tags.NewQuestion)
    }

    isDailyDouble(){
        return this.Tags.includes(config.Tags.DailyDouble)
    }
}