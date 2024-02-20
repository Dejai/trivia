<template>
    <main>
        <!-- <span style="font-size:smaller;"> {{ newGame.GameID }} </span> -->
        <FormContainer>
            <p>
                {{ newGame.GameID }}
                <button @click="_getNewCode">Change Code</button>
            </p>
            <FormRow>
                <label for="">Game Name</label> 
                <input type="text" :class="{'missingRequiredField': missingGameName}" name="categoryName" autocomplete="off" v-model="newGame.Name" placeholder="Enter a name for your game"/> 
            </FormRow>
            <FormRow>
                <label for="">Game Type</label> 
                <select v-model="newGame.Type">
                    <option v-for="option in gameTypeOptions" :value="option">{{ option }}</option>
                </select>
            </FormRow>
            <FormActions>
                <div>
                    <button @click="onAddGame">CREATE GAME</button>
                    &nbsp;
                    <button @click="onCancel">CANCEL</button> 
                </div>
            </FormActions>
            <div v-if="isFetching">
                <spinner-icon style="font-size:44px;" />
            </div>
        </FormContainer>
    </main>
</template>

<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useAuthStore } from '@/stores/auth'
    import { useCode } from '@/composables/useCode'
    import { useFetch } from '@/composables/useFetch'
    import { useMenuStore } from '@/stores/menu'
    import { useGamesStore } from '@/stores/games'
    import config from '@/assets/config/app.json'
    import GameTemplate from '@/assets/config/template/game.json'
    import Game from '@/models/Game'
    import router from '@/router'
    import SpinnerIcon from '@/components/icons/FontAwesome/SpinnerIcon.vue'
    import FormContainer from '@/components/views/forms/FormContainer.vue'
    import FormRow from '@/components/views/forms/FormRow.vue'
    import FormActions from '@/components/views/forms/FormActions.vue'

    
    const authStore = useAuthStore()
    const { isLoggedIn, userKey } = storeToRefs(authStore)

    // If not logged in, make sure we are
    if(!isLoggedIn){
        authStore.onAuthAction()
    }

    const saveAttempts = ref(0)
    const isFetching = ref(false)
    const menuStore = useMenuStore()
    const gamesStore = useGamesStore()

    // Form validation
    const missingGameName = computed( () => saveAttempts.value > 0 && newGame.value.Name == "")

    const newGame = ref(new Game(GameTemplate));
    const gameTypeOptions = config.GameTypes

    // Add a new game
    async function onAddGame() {
        saveAttempts.value ++;
        let failures = [missingGameName].some( (x:any) => x.value == true)
        if(failures){
            return
        }
        newGame.value.addAdmin(userKey.value)
        isFetching.value = true
        
        // Create the game
        await useFetch("POST", "https://files.the-dancinglion.workers.dev/trivia/", { body: JSON.stringify(newGame.value)})

        // Then make sure things get synced
        gamesStore.setSyncNeeded();
        await gamesStore.saveGame();
        
        // Finally, go to the new game
        router.push({name: "game", params: { gameID: newGame.value.GameID?.toLocaleLowerCase() , tab: "overview" }})
    }

    function onCancel(){
        router.push( { name: 'home'})
    }

    // Get a new code for this session
    function _getNewCode(){
        let part1 = useCode(3)
        let part2 =useCode(4, "mix")
        newGame.value.GameID = part1.code.toLowerCase() + part2.code.toLowerCase()
    }

    onMounted( () => {
        if(newGame.value.GameID == ""){
            _getNewCode()
        }
        menuStore.setMenuValue("subtitle1", `Create New Game`)
    })

    onBeforeUnmount(() => {
        menuStore.clearMenuValue("subtitle1")
    })

</script>


<style scoped>
    #gamePageContainer { display:flex; flex-wrap: wrap; justify-content: left; align-items: start; gap:5%; }
    #gamePageSubsection { min-width: 45%; max-width:80%;  }
    #navTabs { display:flex; flex-direction: column; gap:10px; justify-content: left; align-items: left ; min-width:10%; max-width:15%; }
    #navTabs .tab { cursor: pointer; padding:5% 1%; }
    .tab.selected { background-color: white; color:black; }

    .missingRequiredField { border: 2px solid red !important;}
</style>