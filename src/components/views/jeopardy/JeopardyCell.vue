<template>
    <main>
        <div v-if="!props.isPreview" class="pointer questionCell" :class=" { 'cellViewed' : wasOpened }" @click="openCell($event)" :data-question-key="questionKey">
            {{ cellValue }} 
        </div>

        <div  :class="{ 'cellOpen': isOpen }">
            <div class="openCellBlock cellOpened" v-if="isOpen" >

                <div class="openCellHeaderRow">
                    <table style="width:100%;">
                        <colgroup>
                            <col style="width:33%;"/>
                            <col style="width:33%;"/>
                            <col style="width:33%;"/>
                        </colgroup>
                        <tr>
                            <td>
                                <span>{{ props.categoryName }}</span>
                               
                            </td>
                            <td>
                                <TimerCountdownView :seconds="timerSeconds" @timeup="onShowRevealAnswer"/> 
                            </td>
                            <td>
                                <span>{{ cellValuNumber }}</span>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="qnaSection questionSection" v-if="showQuestion">
                    <Image v-if="showQuestionImage" :url="questionImageUrl" :is-jeopardy="true" />
                    {{ questionText }}
                </div>
                <div v-if=" (showRevealAnswer || props.isPreview ) && !showAnswer">
                    <IconButton @click="revealAnswer">
                        <template  #icon>
                           <h2><eye-icon /></h2>
                        </template>
                        <template #content>
                            <h2>Reval Answer</h2>
                        </template>
                    </IconButton>
                </div>
                <div class="qnaSection answerSection" v-if="showAnswer">
                    <Image v-if="showAnswerImage" :url="answerImageUrl" :is-jeopardy="true" />
                    {{  answerText  }}
                </div>
                <h3 class="flex-row flex-justify-center flex-align-center flex-gap-10" v-if="showWhoGotItRightLoading">
                    <spinner-icon/>
                    <span>Loading team answers</span>
                </h3>
                <div v-if="showWhoGotItRight" style="width:25%; overflow:hidden;">
                    <h2>Who Got it Right?</h2>
                    <p class="flex-row flex-justify-center">
                        <IconButton @click="refreshAnswers()">
                            <template #icon>
                                <rotate-icon :spinning="isRefreshAnswersSpinning"/>
                            </template>
                            <template #content>
                                <p>Refresh answers</p>
                            </template>
                        </IconButton>
                    </p>
                    
                    <div id="teamAnswerList">
                        <WhoGotItRight v-for="team in teams"
                            :key="team.Code"
                            :type="'jeopardy1'"
                            :score-value="cellValuNumber"
                            :team="team"

                            @add="onAddRight"
                            @subtract="onSubtractRight"
                        />
                    </div>
                    <div style="margin-top:5%; width:100%; display:flex; flex-direction: column; align-items: center; justify-content: right;">
                        <IconButton class="assignmentButton" :class="{'clickable': isAssignEnabled }"  @click="assignPoints">
                            <template #icon>
                                <h3><plus-icon/></h3>
                            </template>
                            <template #content>
                                <h3>Assign Points</h3>
                            </template>
                        </IconButton>
                        <IconButton class="assignmentButton" :class="{'clickable': isNobodyRightEnabled }"  @click="nobodyRight">
                            <template #icon>
                                <h3><x-mark-icon/></h3>
                            </template>
                            <template #content>
                               <h3>Nobody got it correct</h3>
                            </template>
                        </IconButton>
                    </div>
                    <!-- <button id="assignScoresButton" class="pointer" :disabled="isAssignDisabled" @click="assignPoints">Assign Points</button> -->
                    <!-- <button id="nobodyGotItRightButton" class="pointer" :disabled="isNobodyRightDisabled" @click="nobodyRight"></button> -->
                </div>
                <div v-if="props.isPreview">
                    <button @click="closePreview">Close Preview</button>
                </div>
            </div>
        </div>
    </main>

</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useRoute } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useFiltersStore } from '@/stores/filters'
    import { useMediaStore } from '@/stores/media'
    import { useTeamsStore } from '@/stores/teams'
    import { useGamesStore } from '@/stores/games'
    import QuestionAnswerPair from '@/models/QuestionAnswerPair'
    import WhoGotItRight from '@/components/views/jeopardy/WhoGotItRight.vue'
    import Image from '@/components/views/media/Image.vue'
    import TimerCountdownView from '@/components/views/TimerCountdownView.vue'
    import SpinnerIcon from '@/components/icons/FontAwesome/SpinnerIcon.vue'
    import IconButton from '@/components/views/IconButton.vue'
    import EyeIcon from '@/components/icons/FontAwesome/EyeIcon.vue'
    import XMarkIcon from '@/components/icons/FontAwesome/XMarkIcon.vue'
    import PlusIcon from '@/components/icons/FontAwesome/PlusIcon.vue'
    import RotateIcon from '@/components/icons/FontAwesome/RotateIcon.vue'
    
    const props = defineProps<{
        pair?: QuestionAnswerPair ,
        categoryName?: string,
        isPreview?:boolean
    }>()
    const emit = defineEmits(["next"])

    const route = useRoute()
    const mediaStore = useMediaStore();
    const filtersStore = useFiltersStore()
    const teamsStore = useTeamsStore()
    const gamesStore = useGamesStore()

    const { filters } = storeToRefs(filtersStore)
    const { teams } = storeToRefs(teamsStore)
    const { media } = storeToRefs(mediaStore)
    const { currentGame, currentSession } = storeToRefs(gamesStore)
    const isRefreshAnswersSpinning = ref(false)
    const isOpen = ref( props.isPreview ?? false)
    const wasOpened = ref(false)
    const showQuestion = ref(true)
    const showRevealAnswer = ref(false)
    const showAnswer = ref(false)
    const showWhoGotItRight = ref(false)
    const numberRight = ref(0)

    const isAssignEnabled = computed( () => numberRight.value > 0 )
    const isNobodyRightEnabled = computed( () => numberRight.value == 0 )
    const showWhoGotItRightLoading = computed( () => showAnswer.value && !showWhoGotItRight.value)
    const timerSeconds = computed( () => Number(currentSession.value.getSettingValue("Seconds to Answer")?.value ?? 7) )

    const cellValue = props.pair?.Value
    const cellValuNumber = Number(cellValue)
    const questionKey = `${props.categoryName} for ${cellValue}`

    const question = props.pair?.Question
    const questionText = question?.Text ?? ""
    const questionImageUrl = mediaStore.getMediaURL(question?.ImageRef)
    const showQuestionImage = (questionImageUrl != "")
    const answer = props.pair?.Answer
    const answerText = answer?.Text ?? ""
    const answerImageUrl = mediaStore.getMediaURL(answer?.ImageRef)
    const showAnswerImage = (answerImageUrl != "")

    // Show the button to reveal the answer
    function onShowRevealAnswer(){
        showRevealAnswer.value = true
    }

    // Revealing the answers given
    async function revealAnswer() {
        let defaultAnswer = (route.params.sessionID == "TEST") ? "test answer" : ""
        showQuestion.value = false
        showAnswer.value = true 
        // Add a 2-second delay in retrieving answers
        setTimeout( async () => {
            await refreshAnswers()
            showWhoGotItRight.value = true
        }, 2000)
    }

    // Get the team answers
    async function refreshAnswers(){
        isRefreshAnswersSpinning.value = true
        let defaultAnswer = (route.params.sessionID == "TEST") ? "test answer" : ""
        let answers = await teamsStore.getTeamAnswers()
        for(let team of teams.value){
            let match = answers.filter( (ans:any) => ans.code == team.Code)?.[0];
            team.Answer = (match != undefined) ? match.answer : defaultAnswer
        }
        isRefreshAnswersSpinning.value = false
    }

    function openCell(event:any){
        let target = event.target;
        // If the game has not been started, don't open a cell
        if(!filters.value.gameStarted){ return }

        let isSelectable = target?.classList?.contains("selectableCell") ?? false
        let prevViewed = wasOpened.value

        if(isSelectable || prevViewed){
            let proceed = prevViewed ? confirm("Already opened. Open again?") : true
            if(proceed){
                isOpen.value = true
                wasOpened.value = true
            }
        }
    }

    // Adding or increasing the number right
    function onAddRight(){ numberRight.value++ }
    function onSubtractRight(){ numberRight.value-- }

    function assignPoints(){
        if(numberRight.value > 0){
            closeCell()
        }
    }

    function nobodyRight(){
        if(numberRight.value == 0){
            closeCell()
        }
    }

    function closeCell(){
        showQuestion.value = true
        showAnswer.value = true 
        isOpen.value = false
        emit("next")
    }

    function closePreview(){
        emit("next")
    }
</script>

<style scoped>
    /* .openCellHeaderRow { display:flex; flex-wrap:wrap; justify-content:center; align-items: center; padding:1%; width:45%; gap:20%; font-size:22px; } */
    .openCellHeaderRow { width:45%; font-size:32px; }
    .cellOpen { display: block !important;  z-index:100; width:100%; position:fixed; bottom:0; top:0; right:0;  background-color:#060CE9; color:#F5F5F5; text-align:center; overflow-y: scroll; }
    
    .openCellBlock { display: flex; flex-direction:column; gap:20px; justify-content: center; align-items: center; }

    .questionCell { color:yellow; text-align:center; font-weight:bolder; cursor:pointer; background-color:#060CE9; font-size:64px; cursor:pointer; width:100%; }
    .cellViewed { color:black !important; background-color: gray !important; cursor:pointer; }


    .questionSection {width:50%; font-size:2.5em; padding: 2em; }
    .qnaSection { width:50%; font-size:2.5em; padding:1em; }


    #value_header { position:fixed; top:7px; right:7px; font-size:22px; width:20%; font-weight:bolder;}

    #revealAnswerButton { font-size:15px; cursor:pointer; }
    .answer_link { color:white; font-size:50%; }
    #assign_scores_block { padding:1%; text-align:right; }
    #close_question_view { position:fixed; z-index:1000; top:0; left:0; width:10%; padding:1%; text-align:left; cursor:pointer; }

    #teamAnswerList { max-height:500px; overflow-y:scroll; position:relative; padding: 2%; text-align: center; }

    @keyframes tilt-shaking {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(1deg); }
        50% { transform: rotate(0eg); }
        75% { transform: rotate(-1deg); }
        100% { transform: rotate(0deg); }
    }

    .selectableCell:not(.cellViewed) { animation: tilt-shaking 0.25s infinite; border:1px dashed white; }

    .assignmentButton { color: gray; }
    .assignmentButton.clickable { color: white !important; }

</style>