<template>
    <div id="gamePageContainer">
        <div id="navTabs">
            <div>
                <p>
                    <span v-if="isMounted && isLoggedIn">
                        <CircleUserIcon style="font-size:24px; color:blue; padding-right:3%;" @click="authStore.onAuthAction" />
                        Hi, {{ authStore.userName }}
                    </span>   
                    <span v-if="isMounted && !isLoggedIn" @click="authStore.onAuthAction" style="color:blue; cursor:pointer">Log in</span>
                    &nbsp;
                </p>
            </div>
            <p class="tab section" @click="onSwitchTab('overview')" :class="{ 'selected': showOverviewTab }">Overview</p>
            <div v-if="isLoggedIn">
                <p class="tab section showOnLogin" @click="onSwitchTab('qna')" :class="{ 'selected': showQnATab }" >Questions/Answers</p>
                <p class="tab section showOnLogin" @click="onSwitchTab('media')" :class="{ 'selected': showMediaTab }">Game Media</p>
            </div>
        </div>
        <div id="gamePageSubsection" v-if="isMounted">
            <div id="headerButtonSection" v-if="isLoggedIn">
                <HeaderButton @click="gamesStore.saveGame()" :class="{'toBeSaved': toBeSaved}">
                    <template #icon>
                        <floppy-disk-icon/>
                    </template>
                    <template #content>
                        <h3 v-if="!isSaving && !isSaveSuccess">Save Game</h3>
                        <h3 v-if="isSaving">Saving ... <spinner-icon /></h3>
                        <h3 v-if="isSaveSuccess">Saved!</h3>
                    </template>
                </HeaderButton>
                <HeaderButton @click="onAddCategory" v-if="showQnATab" style="color:white;">
                    <template #content>
                        <h3>Add New Category</h3>
                    </template>
                </HeaderButton>
                <HeaderButton @click="onValidateCategories" v-if="showQnATab" style="color:white;">
                    <template #icon>
                        <rotate-icon :spinning="isSpinning" />
                    </template>
                    <template #content>
                        <h3>
                            Check for Errors
                            &nbsp;&nbsp;
                            <span style="color:limegreen;" v-if="showNoErrorsMessage">All set. No errors</span>
                        </h3>

                    </template>
                </HeaderButton>
                <HeaderButton v-if="showMediaTab" @click="onShowMediaForm" style="color:white;">
                    <template #content>
                        <h3>Add Content</h3>
                    </template>
                </HeaderButton>
            </div>
            <div id="errorsSection" v-if="showErrors">
                <div v-for="error in errorsList">
                    <p>{{ error.Message }}</p>
                    <p v-if="error.hasDetails()" v-for="detail in error.Details" style="padding-left:3%;">
                        {{ detail }}
                    </p>
                </div>
            </div>
            <h3 v-if="!gameLoaded">LOADING ... </h3>
            <OverviewView :key="props.gameID" v-if="showOverviewTab"/>
            <QuestionsAnswersView :key="props.gameID" v-if="showQnATab"/>
            <MediaView :key="props.gameID" v-if="showMediaTab"/>
        </div>
    </div>
</template>


<script setup lang="ts">
    import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useGamesStore } from '@/stores/games'
    import { useAuthStore } from '@/stores/auth'
    import { useMenuStore } from '@/stores/menu'
    import { useFiltersStore } from '@/stores/filters'
    import { useMediaStore } from '@/stores/media'
    import ErrorMessage from '@/models/ErrorMessage';
    import OverviewView from '@/components/views/game/_OverviewView.vue'
    import QuestionsAnswersView from '@/components/views/game/QuestionsAnswersView.vue'
    import MediaView from '@/components/views/game/MediaView.vue'
    import HeaderButton from '@/components/views/game/HeaderButton.vue'
    import CircleUserIcon from '@/components/icons/FontAwesome/CircleUserIcon.vue'
    import FloppyDiskIcon from '../icons/FontAwesome/FloppyDiskIcon.vue'
    import SpinnerIcon from '../icons/FontAwesome/SpinnerIcon.vue'
    import RotateIcon from '@/components/icons/FontAwesome/RotateIcon.vue'

    const props = defineProps<{
        gameID:string
    }>()

    const router = useRouter()
    const route = useRoute()
    const gamesStore = useGamesStore()
    const menuStore = useMenuStore()
    const authStore = useAuthStore()
    const filtersStore = useFiltersStore()
    const mediaStore = useMediaStore()

    const { currentGame, toBeSaved, isSaving, isSaveSuccess } = storeToRefs(gamesStore);
    const { isLoggedIn } = storeToRefs(authStore)
    const isMounted = ref(false)
    const tabInPath = route.params?.tab ?? "overview"
    const currentTab = ref(tabInPath)

    const showSaveButton = computed( () => toBeSaved.value && !isSaving.value )
    const gameLoaded = computed( () => currentGame.value != undefined )

    const showErrors = ref(false)
    const errorsList = ref(new Array<ErrorMessage>)
    const showNoErrorsMessage = ref(false)
    const isSpinning = ref(false)

    // Showing the different tabs
    const showOverviewTab = computed( () => gameLoaded.value && (currentTab.value == "overview" || currentTab.value == "") )
    const showQnATab = computed( () => isLoggedIn.value && gameLoaded.value && currentTab.value == "qna" )
    const showMediaTab = computed( () => isLoggedIn.value && gameLoaded.value && currentTab.value == "media" )

    // Switch tab when tab is clicked
    function onSwitchTab(tabName:string) {
        currentTab.value = tabName
        router.push({ name: route.name?.toString(), params: { tab: tabName } })
        gamesStore.saveGame() // always save the game if switching tabs
    }

    function onAddCategory(){
        filtersStore.setFilter("categoryForm", true)
    }

    function onValidateCategories(){
        isSpinning.value = true
        let { hasErrors, errors } = currentGame.value.validateGame()
        setTimeout( () => {
            showErrors.value = hasErrors
            errorsList.value = errors 
            isSpinning.value = false;
            if(!hasErrors){
                showNoErrorsMessage.value = true;
                setTimeout(()=>{
                    showNoErrorsMessage.value = false;
                }, 2000)
            }
        }, 1000);
    }

    function onShowMediaForm(){
        filtersStore.setFilter("mediaForm", true);
    }

    onMounted( async () => {
        menuStore.setMenuValue("subtitle1", "loading")
        // let gameID = route.params.gameID?.toString() ?? ""
        await gamesStore.getCurrentGame()
        isMounted.value = true
        menuStore.setMenuValue("subtitle1", currentGame.value.Name)
    })

    onBeforeUnmount(() => {
        menuStore.clearMenuValue("subtitle1")
    })
</script>

<style scoped>
    #gamePageContainer { display:flex; flex-wrap: wrap; justify-content: left; align-items: start; gap:5%; }

    #navTabs { display:none; }
    #gamePageSubsection { width:99%; }

    .syncDetail { visibility: hidden;}
    .showSyncDetail { visibility: visible !important; }
    
    .tab.selected { background-color: white; color:black; }

    #headerButtonSection { width:100%; gap:2%; display:flex; flex-wrap: wrap; justify-content: left; align-items: center; padding:0% 0% 2% 0%; }

    #errorsSection p { color: red; }
    .toBeSaved { color:limegreen !important; }


    @media (min-width: 1024px) {
        #navTabs { display:flex; flex-direction: column; gap:10px; justify-content: left; align-items: left ; width:10%; }
        #navTabs .tab { cursor: pointer; padding:3% 1%; }
        #gamePageSubsection { width:85%; }
    }

</style>