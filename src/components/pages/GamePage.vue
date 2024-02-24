<template>
    <div id="gamePageContainer" class="flex-row flex-wrap flex-justify-left flex-align-start flex-gap-30">
        <div id="gamePageMenu" :style="{'height': sideMenuHeight }" class="gamePagePadding flex-column flex-gap-10 flex-justify-left flex-align-start leftMenuWidth">
            <p class="width-100 flex-column flex-justify-left flex-align-start flex-gap-30">
                <span v-if="isMounted && isLoggedIn" class="width-100 flex-row flex-justify-left flex-align-center flex-gap-10">
                    <CircleUserIcon class="color-blue" style="font-size:24px; padding-right:3%;" @click="authStore.onAuthAction" />
                    Hi, {{ authStore.userName }}
                </span>   
                <span v-if="isMounted && !isLoggedIn" @click="authStore.onAuthAction" class="color-blue pointer">Log in</span>
            </p>
            <div id="navTabs" class="flex-gap-5 flex-justify-left flex-align-start">
                <p class="tab section" @click="onSwitchTab('overview')" :class="{ 'selected': showOverviewTab }">Overview</p>
                <p v-if="isGameAdmin" class="tab section showOnLogin" @click="onSwitchTab('qna')" :class="{ 'selected': showQnATab }" >Questions/Answers</p>
                <p v-if="isGameAdmin" class="tab section showOnLogin" @click="onSwitchTab('media')" :class="{ 'selected': showMediaTab }">Game Media</p>
            </div>
        </div>
        <div id="gamePageSubsection" class="gamePagePadding" v-if="isMounted">
            <div id="headerButtonSection" v-if="isGameAdmin">
                <IconButton @click="gamesStore.saveGame()" :class="{'toBeSaved': toBeSaved}">
                    <template #icon>
                        <floppy-disk-icon/>
                    </template>
                    <template #content>
                        <h3 v-if="!isSaving && !isSaveSuccess">SAVE</h3>
                        <h3 v-if="isSaving">SAVING... <spinner-icon /></h3>
                        <h3 v-if="isSaveSuccess">Saved!</h3>
                    </template>
                </IconButton>
                <IconButton @click="onAddCategory" v-if="showQnATab" style="color:white;">
                    <template #content>
                        <h3>Add New Category</h3>
                    </template>
                </IconButton>
                <IconButton @click="onValidateCategories" v-if="showQnATab" style="color:white;">
                    <template #icon>
                        <rotate-icon :spinning="isSpinning" />
                    </template>
                    <template #content>
                        <h3>
                            Check for Errors
                            &nbsp;&nbsp;
                            <span class="color-green" v-if="showNoErrorsMessage">All set. No errors</span>
                        </h3>
                    </template>
                </IconButton>
                <IconButton v-if="showMediaTab" @click="onShowMediaForm" style="color:white;">
                    <template #content>
                        <h3>Add Content</h3>
                    </template>
                </IconButton>
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
    import IconButton from '@/components/views/IconButton.vue'
    import CircleUserIcon from '@/components/icons/FontAwesome/CircleUserIcon.vue'
    import FloppyDiskIcon from '@/components/icons/FontAwesome/FloppyDiskIcon.vue'
    import SpinnerIcon from '@/components/icons/FontAwesome/SpinnerIcon.vue'
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

    /* Refs */
    const defaultTab = "overview"
    const { currentGame, toBeSaved, isSaving, isSaveSuccess } = storeToRefs(gamesStore);
    const { isLoggedIn, userKey } = storeToRefs(authStore)
    const isMounted = ref(false)
    const tabInPath = route.params?.tab ?? defaultTab;
    const currentTab = ref(tabInPath)
    const showErrors = ref(false)
    const errorsList = ref(new Array<ErrorMessage>)
    const showNoErrorsMessage = ref(false)
    const isSpinning = ref(false)

    /* Computed */
    const gameLoaded = computed( () => currentGame.value != undefined )
    const isGameAdmin = computed( () => gamesStore.isAdmin(userKey.value) )
    const showOverviewTab = computed( () => gameLoaded.value && (currentTab.value == "overview" || currentTab.value == "") )
    const showQnATab = computed( () => isGameAdmin.value && gameLoaded.value && currentTab.value == "qna" )
    const showMediaTab = computed( () => isGameAdmin.value && gameLoaded.value && currentTab.value == "media" )
    const sideMenuHeight = computed( () => window.innerWidth >= 1024 ? `${window.innerHeight}px` : '' )

    /* FUNCTIONS */
    
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
        await gamesStore.getCurrentGame()
        isMounted.value = true
        menuStore.setMenuValue("subtitle1", currentGame.value.Name)
    })
</script>

<style scoped>
    .gamePagePadding { padding-top:5%; }
    #gamePageMenu { width: 100%; border-bottom:2px solid white; padding-bottom:5%;  }
    #navTabs { display:flex; flex-wrap:nowrap; width:100%; }
    #navTabs .tab { padding:1% 3%; text-align:center; cursor:pointer; }
    .tab.selected { background-color: #007FFF;; color:white; }

    #gamePageSubsection { width:99%; }

    .syncDetail { visibility: hidden;}
    .showSyncDetail { visibility: visible !important; }

    #headerButtonSection { width:100%; gap:2%; display:flex; flex-wrap: wrap; justify-content: left; align-items: center; padding:0% 0% 2% 0%; }
    #errorsSection p { color: red; }
    .toBeSaved { color:limegreen !important; }

    @media (min-width: 1024px) {
        .gamePagePadding { padding-top:1%; }

        #gamePageMenu { width: 8%; border-bottom: none; }
        #navTabs {  display: block; }
        #navTabs .tab { cursor: pointer; padding:3% 1%; }
        #gamePageSubsection { width:85%; }
    }

</style>