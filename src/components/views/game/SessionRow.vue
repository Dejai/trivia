<template>
    <main class="sessionRowContainer">
        <div class="sessionRow flex-row flex-justify-left flex-nowrap flex-align-start"  v-if="showSessionRow">
            <div class="column column1" :class="{ 'header': props.header, 'isExpired': props.session?.IsExpired }" @click="clearFilter">
                {{ props.session?.Code }}
            </div>
            <div class="column column2" :class="{ 'header': props.header, 'isExpired': props.session?.IsExpired }" @click="clearFilter">
                {{ expirationDate }}
            </div>
            <div v-if="showButtons" class="column column3 flex-row flex-justify-left flex-align-center flex-gap-20">
                <IconButton v-if="isActive" class="color-blue" @click="joinSession">
                    <template #icon>
                        <share-from-square-icon/>
                    </template>
                    <template #content>
                        <h4>JOIN</h4>
                    </template>
                </IconButton>
                <IconButton v-if="isGameAdmin" class="color-white" @click="editSession">
                    <template #icon>
                        <pen-to-square-icon/>
                    </template>
                    <template #content>
                        <h4>EDIT</h4>
                    </template>
                </IconButton>
                <IconButton v-if="isGameAdmin && isActive" class="color-green openBoardIcon" @click="openBoard">
                    <template #icon>
                        <play-icon/>
                    </template>
                    <template #content>
                        <h4>OPEN BOARD</h4>
                    </template>
                </IconButton>
            </div>
        </div>
        <div v-if="showSessionForm">
            <SessionForm
                :key="props.session?.Code"
                :session="props.session"

                @save="onSave"
                @cancel="onCancel"
                />
        </div>
    </main>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import { storeToRefs } from 'pinia'
    import router from '@/router'
    import { useAuthStore } from '@/stores/auth'
    import { useFiltersStore } from '@/stores/filters'
    import { useGamesStore } from '@/stores/games'
    import Session from '@/models/Session'
    import SessionForm from '@/components/views/game/SessionForm.vue'
    import IconButton from '@/components/views/IconButton.vue'
    import PenToSquareIcon from '@/components/icons/FontAwesome/PenToSquareIcon.vue'
    import ShareFromSquareIcon from '@/components/icons/FontAwesome/ShareFromSquareIcon.vue'
    import PlayIcon from '@/components/icons/FontAwesome/PlayIcon.vue'

    const props = defineProps<{
        session?:Session,
        gameID?:string,
        header?:boolean
    }>()
    const emit = defineEmits(["cancel", "save"])

    // STORES
    const authStore = useAuthStore()
    const filtersStore = useFiltersStore()
    const gamesStore = useGamesStore()

    // REFS
    const { isLoggedIn, userKey } = storeToRefs(authStore)
    const { filters } = storeToRefs(filtersStore)

    // COMPUTED
    const isGameAdmin = computed( () => gamesStore.isAdmin(userKey.value) )
    const expirationDate = computed( () => props.header ? "Expiration" : `${props.session?.Expires?.Month ?? ""} ${props.session?.Expires?.Day ?? ""}, ${props.session?.Expires?.Year ?? ""}`)
    const showButtons = computed( () => !props.header );
    const showSessionRow = computed( () => filters.value.session == "" )
    const showSessionForm = computed( () => (filters.value.session == props.session?.Code) && !props.header)
    const isExpired = computed( () => props.session?.isExpired() )
    const isActive = computed( () => !isExpired.value )

    function clearFilter(){
        filtersStore.clearFilter("session")
    }

    // Play a game (as a player)
    function joinSession(){
        router.push(  { name: "join", params: { gameID: props.gameID, sessionID: props.session?.Code } } )
    }

    // Edit a session details
    function editSession(){
        filtersStore.setFilter("session", props.session?.Code ?? "")
    }

    function onSave(){ emit("save") }
    function onCancel(){ emit("cancel") }

     // Open up the board
     function openBoard(){
        router.push( { name: "board", params: { gameID: props.gameID, sessionID: props.session?.Code } } )
    }

</script>

<style scoped>

    .sessionRowContainer { padding:5% 0%;}
    .sessionRow .header { font-size:18px; padding-bottom:2%; }
    .sessionRow .column { text-align: left; }
    .sessionRow .column1 { width: 20%; }
    .sessionRow .column2 { width: 40%; }
    /* .sessionRow .column3 { display:none; } */

    .openBoardIcon { display:none; }
    .isExpired { text-decoration: line-through !important; font-style: italic; }

    @media (min-width: 1024px) {
        .sessionRowContainer { padding:3% 0%;}
        .sessionRow .header { font-size:18px; }
        .openBoardIcon { display:flex; }
        .sessionRow .column1 { width: 20%; }
        .sessionRow .column2 { width: 40%; }
        .sessionRow .column3 { display:flex; width: 90%; }
    }
</style>