<template>
    <main >
        <h1>Transfer from Trello</h1>
        <label>Select File</label>
        <input type="file" id="mediaFileInput" name="filename" accept="text/json" @change="getFileContent">
        <button v-if="hasFile" @click="saveTransfer">SAVE</button>
        <div v-if="hasFile" class="flex-row flex-justify-left flex-align-stretch flex-gap-30 width-100">
            <div class="section">
                <h2>From Trello</h2>
                <textarea style="height:80%;" v-model="trelloJson"></textarea>
            </div>
            <div class="section">
                <h2>New Way</h2>
                <textarea style="height:80%;" v-model="newJson"></textarea>
            </div>
        </div>
       
    </main>
</template>

<script setup lang="ts">

    import { ref, computed, onMounted } from 'vue'
    import { storeToRefs } from 'pinia'
    import Category from '@/models/Category'
    import { useGamesStore } from '@/stores/games'
    import router from '@/router';
    import { useRoute } from 'vue-router'

    const route = useRoute()
    const gamesStore = useGamesStore()

    const { currentGame } = storeToRefs(gamesStore)
    const trelloJson = ref("")
    const newJson = ref("")

    const hasFile = computed ( ()=> trelloJson.value != "")

    // Get file content
    function getFileContent(){
        let fileInput = document.getElementById("mediaFileInput") as HTMLInputElement;
        let file = fileInput?.files?.[0] ?? undefined
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                console.log(evt)
                trelloJson.value = evt.target?.result?.toString() ?? ""; 
                convert()
            }
            reader.onerror = function (evt) {
               console.error("Error reading file content");
            }
        }
    }

    function convert(){
        try { 
            let attempt1 = JSON.parse(trelloJson.value)
            let categories = JSON.parse(attempt1)
            let idx = 0;
            
            for(let category of categories){
                idx++

                
                // Make order a number
                category.Order = idx;

                let existingCatID = category.CategoryID ?? ""

                if(existingCatID == ""){
                    category.CategoryID = `Category-${idx}`
                }

                // Change name of questions
                category["QuestionAnswerPairs"] = category.Questions

                // Make sure category is tagged
                if(category.FinalJeopardy == "Yes"){
                    let finalJeopardyID = "FINALJEOPARDY"
                    category.CategoryID = finalJeopardyID
                    category.Order = 9999;
                    category["Tags"] = ["Final Jeopardy!"]
                    // If there is already a FJ category, delete it
                    let existingFJ = currentGame.value.Categories.filter( (x:any) => x.CategoryID == finalJeopardyID)?.[0];
                    if(existingFJ != undefined){
                        currentGame.value.manageCategories("delete", existingFJ);
                    }
                }
                // Adding new category
                console.log(category)
                let categoryObj = new Category(category)
                console.log(categoryObj)
                currentGame.value.manageCategories("add", categoryObj)
            }
            newJson.value = JSON.stringify(currentGame.value.Categories)

        } catch (err) {
            console.error(err);
        }
    }

    // Saving the transfer
    async function saveTransfer(){
        gamesStore.setGameSaveNeeded()
        await gamesStore.saveGame()
        alert("SAVED!")
        router.push( { name: "game", params: { gameID: route.params.gameID, tab:'overview' }})
    }

    onMounted( async () => {
        await gamesStore.getCurrentGame()
    })
</script>

<style scoped>
    .section { min-height: 600px; min-width:35%; }
    .section textarea { width: 100%; height: 100%; }
</style>