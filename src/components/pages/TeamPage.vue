<template>
    <main id="teamPageMain" style="" v-if="isMounted">
        <div class="teamHeader">
            <h2 id="homemade_jeopardy_title" style="font-size:25px; margin-bottom:0px;">
                Team: <span id="team_code" class="highlight highlight-orange">{{ currentTeam.Name }}</span>
            </h2>
            <h2 id="homemade_jeopardy_title" style="font-size:25px; margin-bottom:0px;" v-if="currentTeam.HasWager">
                Wager: <span id="team_wagere" class="highlight highlight-red">{{ currentTeam.Wager }}</span>
            </h2>
        </div>
        <div class="teamSubmitSection" style="width:100%;" v-if="!showAddWager">
            <input id="answerInputField" type="text" placeholder="Enter answer here..." name="answer" autocomplete="off" v-model="currentTeam.Answer">
        </div>
        <div id="teamActionSection" style="" v-if="!showAddWager">
            <HeaderButton v-if="!isSubmitting" :class="{'canSubmit': canSubmit }" @click="onSubmitAnswer">
                <template #icon>
                    <pen-to-square-icon/>
                </template>
                <template #content>
                    <h2>
                        SUBMIT
                    </h2>
                </template>
            </HeaderButton>
            <HeaderButton  v-if="isSubmitting" style="color:limegreen;">
                <template #icon>
                    <spinner-icon/>
                </template>
                <template #content>
                    <h2>
                        SAVING ...
                    </h2>
                </template>
            </HeaderButton>
            <HeaderButton style="color:orange;" @click="onShowAddWager" v-if="!currentTeam.HasWager">
                <template #icon>
                    <pen-to-square-icon />
                </template>
                <template #content>
                    <h2>
                        Add Wager
                    </h2>
                </template>
            </HeaderButton>
        </div>
        <div v-if="showLastAnswer && !showAddWager" style="padding-top:5%;">
            <h3>Submitted: {{ lastAnswer }}</h3>
        </div>

        <div v-if="showAddWager && !isSubmittingWager">
            <h2>Enter Wager</h2>
            <input id="wagerInputField" type="number" min="0" placeholder="Enter wager" name="answer" autocomplete="off" v-model="theWager">
            <h3 style="font-style: italic; color:orange;">note: once you save your wager, it cannot be changed</h3>

            <div style="display:flex; justify-content: space-between; align-items: center; gap:2%;">
                <HeaderButton style="color:limegreen;" @click="onConfirmWager">
                    <template #icon>
                        <circle-check-icon/>
                    </template>
                    <template #content>
                        <h2>
                            Confirm Wager
                        </h2>
                    </template>
                </HeaderButton>
                <HeaderButton style="color:red;" @click="onCancelWager">
                    <template #icon>
                        <x-mark-icon/>
                    </template>
                    <template #content>
                        <h2>
                            Cancel
                        </h2>
                    </template>
                </HeaderButton>
            </div>
        </div>
        <div v-if="isSubmittingWager">
            <h1>
                <spinner-icon/>&nbsp;<span>Submitting Wager</span>
            </h1>
        </div>
    </main>
    <h1 v-else>
        <spinner-icon/>
    </h1>
</template>


<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { storeToRefs } from 'pinia';
    import { useGamesStore } from '@/stores/games'
    import { useTeamsStore } from '@/stores/teams'
    import { useMenuStore } from '@/stores/menu'
    import { useCookie } from '@/composables/useCookie';
    import HeaderButton from '../views/game/HeaderButton.vue'
    import PenToSquareIcon from '../icons/FontAwesome/PenToSquareIcon.vue'
    import SpinnerIcon from '../icons/FontAwesome/SpinnerIcon.vue'
    import CircleCheckIcon from '../icons/FontAwesome/CircleCheckIcon.vue';
    import XMarkIcon from '../icons/FontAwesome/XMarkIcon.vue';
    import appConfig from '@/assets/config/app.json'

    const route = useRoute()
    const gamesStore = useGamesStore()
    const menuStore = useMenuStore()
    const teamsStore = useTeamsStore()

    const { currentGame, gamesLoaded } = storeToRefs(gamesStore)
    const { currentTeam } = storeToRefs(teamsStore)
    const isMounted = ref(false)
    const isSubmitting = ref(false)
    const lastAnswer = ref("")
    const showLastAnswer = ref(false)

    const theWager = ref(0)
    const showAddWager = ref(false)
    const showWagerSet = ref(false)
    const isSubmittingWager = ref(false)

    const canSubmit = computed( () => currentTeam.value.Answer != "")
    const showGames = computed( ()=> gamesLoaded.value)

    // Submit an answer 
    async function onSubmitAnswer(){
        if(currentTeam.value.Answer != ""){
            isSubmitting.value = true
            let answ =  currentTeam.value.Answer
            await teamsStore.updateTeam(currentTeam.value)
            lastAnswer.value = answ
            showLastAnswer.value = true
            isSubmitting.value = false
        }
    }

    // Adding a new wager
    function onShowAddWager(){
        showAddWager.value = true
    }

    function onCancelWager(){
        showAddWager.value = false
    }

    // Confirming the wager
    async function onConfirmWager() {
        if(theWager.value != null) {
            currentTeam.value.Wager = theWager.value;
            isSubmittingWager.value = true
            await teamsStore.updateTeam(currentTeam.value)
            showWagerSet.value = true
            showAddWager.value = false;
            isSubmittingWager.value = false
        }
    }

    // Check/set cookie for this team session
    // Check for existing cookie & if none, set one with this game,session
    function checkSessionCookie() {
        const cookieNameBase = `dtk-trivia-${route.params.gameID}_${route.params.sessionID}`;
        const teamInfo = `${currentTeam.value.Name} - ${currentTeam.value.Code}`
        let cookieValue = useCookie("get", cookieNameBase)
        if(cookieValue != teamInfo){
            useCookie("set", cookieNameBase, teamInfo)
        }
    }

   

    onMounted( async () => {
        menuStore.setMenuValue("subtitle1", "loading")
        await gamesStore.getCurrentGame()
        menuStore.setMenuValue("subtitle1", currentGame.value.Name)
        await teamsStore.getTeam(route.params.teamID.toString())
        checkSessionCookie()
        isMounted.value = true
    })

</script>

<style scoped>

    #teamPageMain { display:flex; flex-direction: column; align-items: left; width:100%; }
    #teamActionSection{ display:flex; justify-content:space-between; align-items: center; width:100%;  }
    .canSubmit { color:limegreen }
    .highlight { font-weight: bolder; }
    .highlight-orange { color:orange; }
    .highlight-red { color: red; }

    .teamSubmitSection { display:flex; flex-wrap: wrap; flex-direction: column; justify-content: left; align-items: start; gap:20px; }
    #answerInputField { width:100%; font-size: 22px; }
    #wagerInputField { max-width:25%; font-size:22px; }

    @media (min-width: 1024px) {
        /* #answerInputField { width:30%; max-width: 40%; } */
        .teamSubmitSection { align-items: start; justify-content: left; }
        #teamPageMain { width: 40%; }

    }

</style>