<template>
    <main style="display:relative;">
        <div v-if="!props.isPreview" class="pointer questionCell finalJeopardyCategoryCell" :class=" { 'cellViewed' : wasOpened }" @click="openCell($event)" :data-question-key="questionKey">
            <span class="finalJeopardyCategory" :class="{'isCategoryVisible': isCategoryVisible}">{{ categoryName }} </span>
            
            <ModalView v-if="isWagersNeedConfirmed">
                <template #header>
                    <p style="color:black !important;padding:5%;">All Wagers Set?</p>
                </template>
                <template #body>
                    <div>
                        <HeaderButton @click="onConfirmWagers" style="font-size:24px; color:limegreen;">
                            <template #icon>
                                <play-icon />
                            </template>
                            <template #content>
                            Yes, Show Question
                            </template>
                        </HeaderButton>
                        <HeaderButton @click="onCancelConfirmWagers($event)" style="font-size:24px; color:red;">
                            <template #icon>
                                <x-mark-icon />
                            </template>
                            <template #content>
                                Not Yet
                            </template>
                        </HeaderButton>
                    </div>
                </template>
            </ModalView>
        </div>

        <div  :class="{ 'cellOpen': isOpen }">
            <div class="openCellBlock cellOpened" v-if="isOpen" >
                <div class="openCellHeaderRow">
                    <table style="width:100%;">
                        <tr>
                            <td>
                                <TimerCountdownView :seconds="30" @click="playFinalJeopardyAudio" /> 
                                <audio ref="finalJeopardyAudio" id="finalJeopardyAudio" class="hidden" controls>
                                    <source src="@/assets/audio/finalJeopardy.mp3" type="audio/mpeg">
                                </audio>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="qnaSection questionSection" v-if="showQuestion">
                    <Image v-if="showQuestionImage" :url="questionImageUrl" :is-jeopardy="true" />
                    {{ questionText }}
                </div>
                <div v-if="showQuestion">
                    <HeaderButton @click="revealAnswer">
                        <template  #icon>
                           <h2><eye-icon /></h2>
                        </template>
                        <template #content>
                            <h2>Reval Answer</h2>
                        </template>
                    </HeaderButton>
                </div>
                <div class="qnaSection answerSection" v-if="showAnswer">
                    <Image v-if="showAnswerImage" :url="answerImageUrl" :is-jeopardy="true" />
                    {{  answerText  }}
                </div>
                <h2><spinner-icon v-if="showWhoGotItRIghtLoading" /></h2>
                <div v-if="showWhoGotItRIght" style="width:25%;">
                    <h2>Who Got it Right?</h2>
                    <div id="teamAnswerList">
                        <WhoGotItRight v-for="team in teams"
                            :key="team.Code"
                            :type="'jeopardy1'"
                            :score-value="0"
                            :team="team"
                            :is-final-question="true"
                            @add="onAddRight"
                            @subtract="onSubtractRight"
                        />
                    </div>
                    <div style="width:100%; display:flex; flex-direction: column; align-items: center; justify-content: right;">
                        <HeaderButton class="assignmentButton clickable" @click="assignFinalPoints">
                            <template #icon>
                                <h3><plus-icon/></h3>
                            </template>
                            <template #content>
                                <h3>Assign Final Points</h3>
                            </template>
                        </HeaderButton>
                    </div>
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
    import QuestionAnswerPair from '@/models/QuestionAnswerPair'
    import WhoGotItRight from '@/components/views/jeopardy/WhoGotItRight.vue'
    import Image from '@/components/views/media/Image.vue'
    import TimerCountdownView from '../TimerCountdownView.vue'
    import SpinnerIcon from '@/components/icons/FontAwesome/SpinnerIcon.vue'
    import HeaderButton from '../game/HeaderButton.vue'
    import EyeIcon from '@/components/icons/FontAwesome/EyeIcon.vue'
    import XMarkIcon from '@/components/icons/FontAwesome/XMarkIcon.vue'
    import PlusIcon from '@/components/icons/FontAwesome/PlusIcon.vue'
    import PlayIcon from '@/components/icons/FontAwesome/PlayIcon.vue'
    import ModalView from '@/components/views/ModalView.vue'

    
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
    const { filters } = storeToRefs(filtersStore)
    const { teams } = storeToRefs(teamsStore)
    const { media } = storeToRefs(mediaStore)

    const finalJeopardyAudio = ref(null)
    const isOpen = ref( props.isPreview ?? false)
    const wasOpened = ref(false)
    const showQuestion = ref(true)
    const showAnswer = ref(false)
    const showWhoGotItRIght = ref(false)
    const numberRight = ref(0)
    const isCategoryVisible = ref(false)

    const isWagersReady = ref(false)
    const isWagersNeedConfirmed = ref(false)

    const isAssignDisabled = computed( () => numberRight.value == 0 )
    const isAssignEnabled = computed( () => numberRight.value > 0 )
    const isNobodyRightDisabled = computed( () => numberRight.value > 0 )
    const isNobodyRightEnabled = computed( () => numberRight.value == 0 )
    const showWhoGotItRIghtLoading = computed( () => showAnswer.value && !showWhoGotItRIght.value)


    const cellValue = props.categoryName
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

    // Revealing the answers given
    async function revealAnswer() {
        let defaultAnswer = (route.params.sessionID == "TEST") ? "test answer" : ""
        showQuestion.value = false
        showAnswer.value = true 
        let answers = await teamsStore.getTeamAnswers()
        for(let team of teams.value){
            let match = answers.filter( (ans:any) => ans.code == team.Code)?.[0];
            team.Answer = (match != undefined) ? match.answer : defaultAnswer
            console.log(team.Answer);
        }
        showWhoGotItRIght.value = true
    }
    
    // Confirm that we are ready to proceed with the wagers
    function onConfirmWagers(){ 
        console.log("confirming wagers")
        isWagersReady.value = true;  isWagersNeedConfirmed.value = false; }

    function onCancelConfirmWagers(ev:any) { 
        console.info("Canceling wagers")
        isWagersNeedConfirmed.value = false; 
        console.log(isWagersNeedConfirmed.value);
        ev.stopPropagation()
    }

    function openCell(event:any){
        let target = event.target;

        if(!isCategoryVisible.value){
            isCategoryVisible.value = true;
            return
        }

        // Make sure we confirmwagers
        if(!isWagersReady.value){
            isWagersNeedConfirmed.value = true
            return
        }

        isOpen.value = true
        wasOpened.value = true
        filtersStore.setFilter("finalQuestionRevealed", true)
    }

    // Adding or increasing the number right
    function onAddRight(){ numberRight.value++ }
    function onSubtractRight(){ numberRight.value-- }

    function playFinalJeopardyAudio(){
        if(finalJeopardyAudio.value != undefined){
            let audio = finalJeopardyAudio.value as HTMLAudioElement
            setTimeout(() => {
                audio.play()
            }, 100)
        }
    }

    async function assignFinalPoints(){
        for(let team of teams.value){
            team.setFinalScore()
        }
        closeCell()
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


    .finalJeopardyCategoryCell { height:500px !important; position:relative; display:flex; justify-content: center; align-items: center; }
    .finalJeopardyCategory { visibility: hidden;  }
    .finalJeopardyCategory.isCategoryVisible { visibility: visible;}
    .questionSection {width:50%; font-size:2.5em; padding: 2em; }
    .qnaSection { width:50%; font-size:2.5em; padding: 2em; }


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