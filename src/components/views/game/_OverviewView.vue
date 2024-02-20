<template>
    <main>
        
        <div v-if="isLoggedIn">
            <div>
                <h2>Name</h2>
                <div style="margin-left:3%;">
                    <input id="gameName" class="fieldInput-half" type="text" placeholder="Enter a name" v-model="currentGame.Name" @change="saveOnChange" @keyup="updateMenu">
                </div>
            </div>
            <div>
                <h2>Description</h2>
                <div style="margin-left:3%;">
                    <textarea id="gameDescription" class=fieldInput-half rows="3" placeholder="Enter description" v-model="currentGame.Description" @change="saveOnChange"></textarea>
                </div>
            </div>
        </div>
        <div v-else>
            <h2>{{ currentGame.Name }}</h2>
            <p> {{ currentGame.Description }}</p>
        </div>
        <div>
            <h2>Type: {{ currentGame.Type }}</h2>
        </div>
        <hr style="margin:3% 0%;" />
        <div id="gameSessionsSubSection">
            <div id="gameSessionsHeader">
                <h1>Game Sessions</h1>
                <HeaderButton  v-if="showAddSessionButton" style="color:white;" @click="onAddSession">
                    <template #content>
                        <h2>ADD SESSION</h2>
                    </template>
                </HeaderButton>
            </div>
            <div v-if="!showSessionErrorMessage">
                <p>Add new sessions for players to join & play a new instance of this game.</p>
            </div>
            <!-- List of existing sessions -->
            <div id="gameSessionSection" v-if="showSessionsTable">
                <div v-if="currentGame.Sessions.length > 0 && !hasErrors">
                    <SessionRow 
                        :key="'headerKey'"
                        :header="true"
                    />
                    <SessionRow v-for="session in sortedSessions" 
                        :key="session"
                        :gameID="currentGame.GameID"
                        :session="session"

                        @save="afterSaveNewSession"
                        @cancel="hideNewSessionForm"
                    />
                </div>
                <div v-else>
                    <div>
                        <p>This game doesn't have any open session right now. </p>
                    </div>
                </div>
            </div>
            <h3 v-if="showSessionErrorMessage" style="color:orange;">
                <p>Cannot add/play sessions for this game because it has errors. Check for any errors on the "Questions/Answers" tab</p>
            </h3>
            <!-- Adding a new Session -->
            <div id="sessionSection" v-if="showAddNewSession">
                <SessionForm 
                    :isNew="true"
                    @save="afterSaveNewSession"
                    @cancel="hideNewSessionForm"
                    />
            </div>
        </div>
    </main>
</template>


<script setup lang="ts">
    import { ref, computed, onMounted, mergeProps } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useGamesStore } from '@/stores/games'
    import { useAuthStore } from '@/stores/auth'
    import { useMenuStore } from '@/stores/menu'
    import SessionRow from '@/components/views/game/SessionRow.vue'
    import SessionForm from '@/components/views/game/SessionForm.vue'
    import { useFiltersStore } from '@/stores/filters'
import HeaderButton from './HeaderButton.vue'

    const gamesStore = useGamesStore()
    const authStore = useAuthStore()
    const menuStore = useMenuStore()
    const filtersStore = useFiltersStore()
    const { currentGame } = storeToRefs(gamesStore)
    const { filters } = storeToRefs(filtersStore)
    const { isLoggedIn } = storeToRefs(authStore);
    const showAddNewSession = ref(false)

    const { hasErrors } = currentGame.value.validateGame()

    const sortedSessions = computed( () =>  currentGame.value.Sessions?.sort( (a:any, b:any) => { return a.getExpirationDate() - b.getExpirationDate() }))
    // const hasErrors = computed( () => { let { isValid } = currentGame.value.validateGame() ?? false; return isValid } )
    const hasCategories = computed ( () => (currentGame.value.Categories.filter( (cat:any) => !cat.isFinalJeopardy()) ?? []).length > 0 )
    const showAddSessionButton = computed( () => isLoggedIn && !showAddNewSession.value && !hasErrors && hasCategories.value )
    const showAddQnAMessage = computed ( () => isLoggedIn && !hasCategories.value)
    const showSessionErrorMessage = computed ( () => isLoggedIn && hasCategories.value && hasErrors)
    const showSessionsTable = computed( () => hasCategories.value && !showAddNewSession.value )

    // Add a new session
    function onAddSession(){
        showAddNewSession.value = true
    }

    // Saving a new session
    function afterSaveNewSession(){
        saveOnChange();
        hideNewSessionForm();
    }

    function hideNewSessionForm(){
        showAddNewSession.value = false
    }

    // Update menuu
    function updateMenu(){
        menuStore.setMenuValue("subtitle1", currentGame.value.Name);
    }

    // On change in the field, trigger syncing
    function saveOnChange(){
        gamesStore.setGameSaveNeeded();
        gamesStore.setSyncNeeded();
    }

</script>


<style scoped>
    .highlight { font-weight: bolder; }
    .highlight-orange { color:orange; }
    .highlight-red { color: red; }

    #gameSessionsHeader { display: flex; flex-wrap: wrap; justify-content:left; gap:20px; align-items: center; }

    .teamSubmitSection { display:flex; flex-wrap: wrap; flex-direction: column; justify-content: left; align-items: center; gap:20px; }
    #answerInputField { min-width: 90%; font-size: 22px; }

    @media (min-width: 1024px) {

        #answerInputField { min-width:30%; max-width: 40%; }
        .teamSubmitSection { align-items: start; }

    }

</style>