import Category from "./Category";
import Session from "./Session";
import ErrorMessage from "./ErrorMessage";
import Archive from "./Archive";

export default class Game { 

    Name: string;
    Description: string; 
    GameID: string;
    Type:string;
    Categories: Category[];
    Sessions?: Session[];
    Admins: string[] = []
    Archives: Archive[]

    constructor(details:any){
        this.Name = details?.Name ?? "";
        this.Description = details?.Description ?? ""
        this.GameID = details?.GameID?.toLowerCase() ?? ""
        this.Categories = details?.Categories?.map( (obj:any) => new Category(obj)) ?? [];
        this.Sessions = details?.Sessions?.map( (obj:any) => new Session(obj) ) ?? [];
        this.Type = details?.Type ?? ""
        this.Admins = details?.Admins ?? []
        this.Archives = details?.Archives?.map( (x:any) => new Archive(x) ) ?? []
    }

    addAdmin(admin:string){
        this.Admins.push(admin)
    }

    // Check if this game contains certain text (for home page filtering)
    containsText(text:string){
        let lowerText = text.toLowerCase()
        let inName = this.Name.toLowerCase().includes(lowerText)
        let inDesc = this.Description.toLowerCase().includes(text)
        return inName || inDesc
    }

    // Get a single session
    getSession(sessionCode:string){
        return this.Sessions?.filter( (sess:Session) => sess.Code == sessionCode)?.[0] ?? undefined
    }

    // Manage sessions in a game
    manageSessions(action:string, sessionDetails:any|undefined) {
        let sessionCode = sessionDetails?.Code ?? ""
        let matchingSession = this.Sessions?.filter( (sess:any) => sess.Code == sessionCode )?.[0] ?? undefined
        switch(action){
            case "add":
            case "update":
                if(matchingSession != undefined){
                    matchingSession.updateSession(sessionDetails)
                } else {
                    this.Sessions?.push( new Session(sessionDetails) )
                }
                break;
            case "delete":
                if(matchingSession != undefined){
                    this.Sessions = this.Sessions?.filter( (s:any) => s.Code != sessionCode) ?? []
                }
                break;
            default:
                console.info("No session action taken");
                break
        }
    }

    // Manage categories in a game
    manageCategories(action:string, categoryDetails:any|undefined) {
        let categoryID = categoryDetails?.CategoryID ?? ""
        let matchingCategory = this.Categories?.filter( (cat:any) => cat.CategoryID == categoryID )?.[0] ?? undefined
        switch(action){
            case "add":
            case "update":
                if(matchingCategory != undefined){
                    matchingCategory.updateCategory(categoryDetails)
                } else {
                    this.Categories?.push( new Category(categoryDetails) )
                }
                break;
            case "delete":
                if(matchingCategory != undefined){
                    this.Categories = this.Categories?.filter( (cat:any) => cat.CategoryID != categoryID) ?? []
                }
                break;
            default:
                console.info("No category action taken");
                break
        }
    }

    updateCategoryOrder(oldOrder:number, newOrder:number){
        let oldSpot = this.Categories?.filter( (x:any) => x.Order == oldOrder)?.[0] ?? undefined
        let newSpot = this.Categories?.filter( (x:any) => x.Order == newOrder)?.[0] ?? undefined

        if(oldSpot != undefined){
            oldSpot.Order = newOrder
        }

        if(newSpot != undefined){
            newSpot.Order = oldOrder
        }
    }


    // Validate this game based on things expected
    validateGame(){

        let hasErrors = true;
        let errors = new Array<ErrorMessage>

        // Must be at least one category that is NOT the final jeopardy
        let categories = this.Categories.filter( (cat:any) => !cat.isFinalJeopardy()) ?? [];
        if(categories.length == 0){
            let catErr = new ErrorMessage("There must be at least one category that is NOT the final jeopardy category")
            errors.push(catErr)
        }

        // All non-Final-Jeopardy categories have same number of questions?
        let questionCount = categories.map( (x:any) => x.QuestionAnswerPairs.length )
        let uniqueCounts = new Set(questionCount)
        if(uniqueCounts.size > 1){
            let err = new ErrorMessage("Each category should have the same number of questions.")
            for(let cat of categories){
                err.addDetail(`${cat.Name} = ${cat.QuestionAnswerPairs?.length ?? 0}`)
            }
            errors.push(err)
        }

        // Make sure every answer has a value
        let qnaError = new ErrorMessage("Every question pair must have a question and an answer")
        let hasMissingQnA = false
        // Loop through the things
        for(let category of this.Categories){
            for(let pair of category.QuestionAnswerPairs){
                let question = pair.Question; 
                let hasQuestionValue = [question.Text, question.SubText, question.ImageRef, question.AudioRef].some( (x:string) => x != "")
                if(!hasQuestionValue){
                    qnaError.addDetail(`Missing question: ${category.Name} for ${pair.Value}`)
                    hasMissingQnA = true
                }

                let answer = pair.Answer; 
                let hasAnswerValue = [answer.Text, answer.SubText, answer.ImageRef, answer.AudioRef].some( (x:string) => x != "")
                if(!hasAnswerValue){
                    qnaError.addDetail(`Missing answer: ${category.Name} for ${pair.Value}`)
                    hasMissingQnA = true
                }
            }
        }
        if(hasMissingQnA){
            errors.push(qnaError);
        }


        hasErrors = errors.length > 0
        return { hasErrors, errors}
    }

}