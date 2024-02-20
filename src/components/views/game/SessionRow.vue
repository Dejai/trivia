<template>
    <main>
        <div class="sessionRow"  v-if="showSessionRow">
            <div style="width:8%;text-align: left;" :class="{ header: props.header, 'isExpired': props.session?.IsExpired }" @click="clearFilter">
                {{ props.session?.Code ?? "Code" }}
            </div>
            <div style="width:10%;text-align: left;" :class="{ header: props.header, 'isExpired': props.session?.IsExpired }" @click="clearFilter">
                {{ expirationDate ?? "Expiration" }}
            </div>
            <div v-if="showButtons" style="display:flex; justify-content: left; gap:4%; align-items: center; width:50%;">
                <HeaderButton v-if="isActive" style="color:lightblue;" @click="playGame">
                    <template #icon>
                        <share-from-square-icon/>
                    </template>
                    <template #content>
                        <h3>JOIN SESSION</h3>
                    </template>
                </HeaderButton>
                <HeaderButton v-if="isLoggedIn" style="color:white;"  @click="editSession">
                    <template #icon>
                        <pen-to-square-icon/>
                    </template>
                    <template #content>
                        <h3>EDIT SESSION</h3>
                    </template>
                </HeaderButton>
                <HeaderButton v-if="isLoggedIn && isActive" style="color:limegreen" @click="openBoard">
                    <template #icon>
                        <play-icon/>
                    </template>
                    <template #content>
                        OPEN BOARD
                    </template>
                </HeaderButton>
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
    import { ref, computed } from 'vue'
    import { storeToRefs } from 'pinia'
    import router from '@/router'
    import { useAuthStore } from '@/stores/auth'
    import { useFiltersStore } from '@/stores/filters'
    import { useNewTab } from '@/composables/useNewTab'
    import Game from '@/models/Game'
    import Session from '@/models/Session'
    import SessionForm from '@/components/views/game/SessionForm.vue'
    import HeaderButton from './HeaderButton.vue'
    import PenToSquareIcon from '@/components/icons/FontAwesome/PenToSquareIcon.vue'
    import ShareFromSquareIcon from '@/components/icons/FontAwesome/ShareFromSquareIcon.vue'
import PlayIcon from '@/components/icons/FontAwesome/PlayIcon.vue'

    const props = defineProps<{
        session?:Session,
        gameID?:string,
        header?:boolean
    }>()
    const emit = defineEmits(["cancel", "save"])

    const authStore = useAuthStore()
    const filtersStore = useFiltersStore()
    const { isLoggedIn } = storeToRefs(authStore)
    const { filters } = storeToRefs(filtersStore)

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
    function playGame(){
        router.push(  { name: "play", params: { gameID: props.gameID, sessionID: props.session?.Code } } )
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
    .sessionRow { display:flex; flex-wrap: wrap; justify-content:left; gap:10px; align-items: center; padding:0.5%; width:100%; }
    .sessionRow .header { font-size:22px; }
    .isExpired { text-decoration: line-through !important; font-style: italic; }
</style>