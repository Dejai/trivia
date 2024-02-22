<template>
    <main>
        <div v-if="isLoggedIn">
            <h2>Game Details</h2>
            <FormContainer>
                <FormRow :stacked="true" :style="'width:20%;'">
                    <h3>Name</h3>
                    <input id="gameName" class="fieldInput" type="text" placeholder="Enter a name" v-model="currentGame.Name" @change="saveOnChange" @keyup="updateMenu">
                </FormRow>
                <FormRow :stacked="true" :style="'width:20%;'">
                    <h3>Description</h3>
                    <input id="gameDescription" class="fieldInput" type="text" placeholder="Enter a short description" v-model="currentGame.Description" @change="saveOnChange">
                </FormRow>
            </FormContainer>
        </div>
        <div v-else>
            <h2>Game Description</h2>
            <h3 style="padding-left:2%;">{{ currentGame.Description }}</h3>
        </div>
        <!-- <div>
            <h2>Type: {{ currentGame.Type }}</h2>
        </div> -->
        <!-- <hr style="margin:1% 0%;" /> -->
        <div id="gameSessionsSubSection" style="margin-top:2%;">
            <div id="gameSessionsHeader">
                <h2>Game Sessions</h2>
                <IconButton  v-if="showAddSessionButton" style="color:white;" @click="onAddSession">
                    <template #content>
                        <h3>ADD SESSION</h3>
                    </template>
                </IconButton>
            </div>
            <div v-if="showSessionInstruction">
                <p>Add new sessions for players to join & play a new instance of this game.</p>
            </div>
            <!-- List of existing sessions -->
            <div id="gameSessionSection" v-if="showSessionsTable">
                <div v-if="currentGame.Sessions.length > 0 && !hasErrors">
                    <SessionRowHeader />
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
    import SessionRowHeader from '@/components/views/game/SessionRowHeader.vue'
    import SessionForm from '@/components/views/game/SessionForm.vue'
    import { useFiltersStore } from '@/stores/filters'
    import IconButton from '@/components/views/IconButton.vue'
    import FormContainer from '@/components/views/forms/FormContainer.vue'
    import FormRow from '@/components/views/forms/FormRow.vue'

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
    const showAddSessionButton = computed( () => isLoggedIn.value && !showAddNewSession.value && !hasErrors && hasCategories.value )
    const showAddQnAMessage = computed ( () => isLoggedIn.value && !hasCategories.value)
    const showSessionErrorMessage = computed ( () => isLoggedIn.value && hasCategories.value && hasErrors)
    const showSessionInstruction = computed( () => isLoggedIn.value && !showSessionErrorMessage);
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
    #gameSessionSection { width: 100%; padding-left:2%;}
    #gameSessionsHeader { display: flex; flex-wrap: wrap; justify-content:left; gap:20px; align-items: center; }
    .teamSubmitSection { display:flex; flex-wrap: wrap; flex-direction: column; justify-content: left; align-items: center; gap:20px; }
    #answerInputField { min-width: 90%; font-size: 22px; }

    @media (min-width: 1024px) {

        #answerInputField { min-width:30%; max-width: 40%; }
        .teamSubmitSection { align-items: start; }
        #gameSessionSection { width: 35%; }


    }

</style>