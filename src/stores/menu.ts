



import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {

    const gameName = ref("")
    const gameCode = ref("")

    const subtitle1 = ref("")
    const subtitle2 = ref("")

    const showGameSection = computed( () => gameName.value != "" || gameCode.value != "" )
    
    // Clear the game name
    function clearGameDetails(){
        gameName.value = ""
        gameCode.value = ""
    }

    function setGameDetails(obj:any){
        gameName.value = obj?.name ?? ""
        gameCode.value = obj?.code ?? ""
    }


    function setMenuValue(key:string, value:string){
        switch(key){
            case "subtitle1":
                subtitle1.value = value;
                break;
            case "subtitle2":
                subtitle2.value = value;
                break;
            default:
                break;
        }
    }

    function clearMenuValue(key?:string){
        if(key != undefined){
            setMenuValue(key, "")
        } else {
            setMenuValue("subtitle1", "")
            setMenuValue("subtitle2", "")
        }
    }


    return { gameName, gameCode, subtitle1, subtitle2, setGameDetails, clearGameDetails, setMenuValue, clearMenuValue }
})
