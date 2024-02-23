<template>
    <main>
        <div v-if="isGameAdmin">
            <h2>Game Details</h2>
            <FormContainer>
                <FormRow :stacked="true" :class="'gameDetailsInput'">
                    <h3>Name</h3>
                    <input id="gameName" class="fieldInput" type="text" placeholder="Enter a name" v-model="currentGame.Name" @change="saveOnChange" @keyup="updateMenu">
                </FormRow>
                <FormRow :stacked="true" :class="'gameDetailsInput'">
                    <h3>Description</h3>
                    <input id="gameDescription" class="fieldInput" type="text" placeholder="Enter a short description" v-model="currentGame.Description" @change="saveOnChange">
                </FormRow>
            </FormContainer>
        </div>
        <div v-else>
            <h2>Game Description</h2>
            <h3 style="padding-left:5%;">{{ currentGame.Description }}</h3>
        </div>
        <!-- <div>
            <h2>Type: {{ currentGame.Type }}</h2>
        </div> -->
        <div id="gameSessionsSubSection">
            <div id="gameSessionsHeader" class="flex-row flex-wrap flex-justify-left flex-align-center flex-gap-20">
                <h2>Game Session{{gameSessionPlurality}}</h2>
                <IconButton  v-if="showAddSessionButton" style="color:white;" @click="onAddSession">
                    <template #content>
                        <h3>ADD SESSION</h3>
                    </template>
                </IconButton>
            </div>
            <!-- Session Messages -->
            <p v-if="showSessionInstruction">Add new sessions for players to join & play a new instance of this game.</p>
            <p v-if="showNoAvailableSessionMessage">This game doesn't have any open sessions right now. </p>
            <p v-if="showSessionErrorMessage" class="color-orange">Cannot add/play sessions for this game because it has errors. Check for any errors on the "Questions/Answers" tab</p>
           
            <!-- List of existing sessions -->
            <div id="gameSessionSection" v-if="showSessionsTable">
                <div>
                    <SessionRowHeader v-if="showSessionColumns" />
                    <SessionRow v-for="session in sortedSessions" 
                        :key="session"
                        :gameID="currentGame.GameID"
                        :session="session"

                        @save="afterSaveNewSession"
                        @cancel="hideNewSessionForm"
                    />
                </div>
            </div>
            <!-- Adding a new Session -->
            <div id="sessionSection" v-if="showAddNewSession">
                <SessionForm 
                    :session="newSession"
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
    import { useFiltersStore } from '@/stores/filters'
    import Session from '@/models/Session'
    import SessionRow from '@/components/views/game/SessionRow.vue'
    import SessionRowHeader from '@/components/views/game/SessionRowHeader.vue'
    import SessionForm from '@/components/views/game/SessionForm.vue'
    import IconButton from '@/components/views/IconButton.vue'
    import FormContainer from '@/components/views/forms/FormContainer.vue'
    import FormRow from '@/components/views/forms/FormRow.vue'

    // STORES
    const gamesStore = useGamesStore()
    const authStore = useAuthStore()
    const menuStore = useMenuStore()
    const filtersStore = useFiltersStore()

    // REFS
    const { currentGame } = storeToRefs(gamesStore)
    const { filters } = storeToRefs(filtersStore)
    const { isLoggedIn, userKey } = storeToRefs(authStore);
    const showAddNewSession = ref(false)
    const newSession = ref(new Session({}))

    const { hasErrors } = currentGame.value.validateGame()

    // COMPUTED
    const isGameAdmin = computed( () => gamesStore.isAdmin(userKey.value) )

    const visibleSessions = computed( () => (isGameAdmin.value) ? currentGame.value.Sessions : currentGame.value.Sessions.filter( (x:Session) => !x.IsExpired && x.Code != "TEST" ) )
    const sortedSessions = computed( () =>  visibleSessions.value?.sort( (a:any, b:any) => { return a.getExpirationDate() - b.getExpirationDate() }))
    const hasVisibleSessions = computed( () => visibleSessions.value.length > 0)
    const showSessionsTable = computed( () => !showAddNewSession.value && hasVisibleSessions.value && !hasErrors )
    const isFilteredBySession = computed( () => filters.value.session != "")
    const showSessionColumns = computed( () => filters.value.session == "" )
    const showAddSessionButton = computed( () => isGameAdmin.value && !showAddNewSession.value && !isFilteredBySession.value )
    const showNoAvailableSessionMessage = computed( () => (isGameAdmin.value && !hasErrors && !hasVisibleSessions.value) || (!isGameAdmin.value && !hasVisibleSessions.value) )
    const showSessionErrorMessage = computed ( () => isGameAdmin.value && hasErrors)
    const showSessionInstruction = computed( () => isGameAdmin.value && sortedSessions.value.length == 0 && !showAddNewSession.value );
    const gameSessionPlurality = computed( () => !isFilteredBySession.value && !showAddNewSession.value ? "s" : "")

    // Add a new session
    function onAddSession(){
        newSession.value = new Session({})
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
    .gameDetailsInput { width:80%; }
    #gameSessionSection { width: 100%; padding-left:2%;}
    #gameSessionsHeader { margin-bottom:1%; }
    #gameSessionsSubSection { margin-top:5%; }
    .teamSubmitSection { display:flex; flex-wrap: wrap; flex-direction: column; justify-content: left; align-items: center; gap:20px; }
    #answerInputField { min-width: 90%; font-size: 22px; }

    @media (min-width: 1024px) {
        .gameDetailsInput { width:20%; }
        #gameSessionsSubSection { margin-top:3%; }

        #answerInputField { min-width:30%; max-width: 40%; }
        .teamSubmitSection { align-items: start; }
        #gameSessionSection { width: 35%; }


    }

</style>