



import router from '@/router'


export function useTagManager(action:string, tag:string, tagList:string[] = [] ){
    let idx = tagList.indexOf(tag)
    switch(action){
        case "add":
            if(idx == -1){
                tagList.push(tag)
            }
            break;
        case "delete":
            if(idx >= 0){
                tagList = tagList.splice(idx, 1)
            }
            break;
        default:
            console.info("Could not update tag")
            break;
    }
    return tagList
}
