

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import Team from '@/models/Team'

export const useFiltersStore = defineStore('filters', () => {

    // The default set of filters
    const defaultFilters: { [id: string] : any } = {
        session: "",
        category: "",
        categoryForm: false,
        categoryEdit: false,
        qnaPair: -1,
        qnaForm: false,
        gameStarted: false,
        mediaForm: false,
        wagers:false,
        finalQuestionRevealed:false
    }

    const filters = ref(defaultFilters)

    function setFilter(key:string, value:any){
        filters.value[key] = value
    }

    function clearFilter(key:string){
        let currVal = filters.value[key] ?? undefined
        switch(typeof(currVal)){
            case "string":
                filters.value[key] = ""
                break;
            case "number":
                filters.value[key] = -1;
                break;
            case "boolean":
                filters.value[key] = false
                break;
            default:
                break;
        }
    }

    return { filters, setFilter, clearFilter }
})
