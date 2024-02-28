<template>
    <main>
        <div id="playFinalJeopardyButtonSection width-80" v-if="showFinalJeopardyButton">
            <button class="bg-color-red color-white button-round" @click="showFinalJeopardy">
                <h1>Play Final Jeopardy!</h1>
            </button>
        </div>
        <div id="jeopardyBoard">
            <div class="columns width-80"  style="width:80%; position:relative;" v-if="!isFinalJeopardy">
                <JeopardyColumn :style="{width: mainCategoryWidths }" v-for="category in mainCategories" 
                    :key="category"
                    :category="category"

                    @revealed="onColumnRevealed"
                    @next="onNextQuestion"
                />
                <ModalView v-if="canPlayGame && !isGameStarted">
                    <template #header>
                        <h1 style="color:black !important;padding:5%;">Ready to Play?</h1>
                    </template>
                    <template #body>
                        <div>
                            <IconButton @click="onStartGame" class="color-green" style="font-size:24px;">
                                <template #icon>
                                    <play-icon />
                                </template>
                                <template #content>
                                    Start Game
                                </template>
                            </IconButton>
                        </div>
                    </template>
                </ModalView>
            </div>
            <div class="columns width-80" style="position:relative;" v-if="isFinalJeopardy">
                <JeopardyColumn :style="{width: '100%' }" v-for="category in finalJeopardy" 
                    :key="category"
                    :category="category"
                    @revealed="onColumnRevealed"
                />
            </div>
            <div id="teamSection" style="width:18%;">
                <h1 style="width:100%;">Teams</h1>
                
                <IconButton v-if="isFinalJeopardy && !filters.finalQuestionRevealed" @click="getTeamWagers">
                    <template #icon>
                        <h3>
                            <rotate-icon :spinning="isWagerRefreshSpinning"/>
                        </h3>
                    </template>
                    <template #content>
                        <h3>Check for Wagers</h3>
                    </template>
                </IconButton>
                <div class="teamRows" style="margin-bottom:5%; width:60%;">
                    <div class="teamSectionRow flex-row flex-wrap flex-justify-space-between flex-align-center flex-gap-30 color-white" v-for="(team, idx) in teamsSorted">
                        <h3 style="max-width:75%;" class="flex-row flex-nowrap">
                            <p class="color-gray">{{ idx+1 }} &nbsp;</p>
                            <p>
                                {{ team.Name }}
                                
                            </p>
                        </h3>
                        <h3 v-if="team.HasWager" :class="{'color-green': team.HasWager}">{{ team.FinalScore }}</h3>
                        <h3 v-else>{{ team.Score }}</h3>
                    </div>
                </div>
                    <IconButton @click="getTeamsForGame()" style="text-align:right;">
                        <template #icon>
                            <h4>
                                <rotate-icon :spinning="isTeamRefreshSpinning"/>
                            </h4>
                        </template>
                        <template #content>
                            <h4>Get Teams</h4>
                        </template>
                    </IconButton>
            </div>
            <br/>
            <div v-if="showNextQuestionSection" style="width:80%; text-align: center; padding-top:0.5%; ">
                <h2>Next Question:</h2>
                <h2>{{ nextQuestion }}</h2>
            </div>
        </div>
    </main>

</template>

<script setup lang="ts">
    import { ref, onMounted, computed, watch } from 'vue'
    import { useRoute } from'vue-router'
    import JeopardyColumn from '@/components/views/jeopardy/JeopardyColumn.vue'
    import { mapActions, storeToRefs } from 'pinia'
    import { useGamesStore } from '@/stores/games'
    import { useMenuStore } from '@/stores/menu'
    import { useTeamsStore } from '@/stores/teams'
    import type Category from '@/models/Category'
    import { useFiltersStore } from '@/stores/filters'
    import ModalView from '@/components/views/ModalView.vue'
    import PlayIcon from '@/components/icons/FontAwesome/PlayIcon.vue'
    import IconButton from '@/components/views/IconButton.vue'
    import RotateIcon from '@/components/icons/FontAwesome/RotateIcon.vue'
    import  CircleCheckIcon from '@/components/icons/FontAwesome/CircleCheckIcon.vue'
import QuestionAnswerPair from '@/models/QuestionAnswerPair'

    // STORES
    const route = useRoute()
    const gamesStore = useGamesStore()
    const menuStore = useMenuStore()
    const teamsStore = useTeamsStore()
    const filtersStore = useFiltersStore()

    // REFS
    const { currentGame, currentSession, gameStartDate } = storeToRefs(gamesStore)
    const { teams } = storeToRefs(teamsStore)
    const { filters } = storeToRefs(filtersStore)
    const isFinalJeopardy = ref(false)
    const canPlayGame = ref(false)
    const isGameStarted = ref(false)
    const columnsRevealed = ref(0)
    const categories = ref(currentGame?.value?.Categories)
    const nextQuestion = ref("")
    const showFinalJeopardyButton = ref(false)
    const isTeamRefreshSpinning = ref(false)
    const isWagerRefreshSpinning = ref(false)
    const showNextQuestionSection = ref(false)

    // COMPUTED
    const mainCategories = computed( () => currentGame?.value?.Categories.filter( (cat:Category) => !cat.isFinalJeopardy()) )
    const mainCategoryWidths = computed( () => (96 / mainCategories.value.length ) + "%" )
    const finalJeopardy = computed( () => currentGame?.value?.Categories.filter( (cat:Category) => cat.isFinalJeopardy()) )
    const teamsSorted = computed( ()=> teams.value.sort( (a,b) => b.Score - a.Score ))
    const selectQuestionOption = computed( () =>  currentSession.value.getSettingValue("Selecting Questions")?.optionID )

    // FUNCTIONS 
    async function getTeamsForGame(){
        isTeamRefreshSpinning.value = true
        await teamsStore.getTeams()
        setTimeout( () => {
            isTeamRefreshSpinning.value = false
        }, 1000);
    }

    async function getTeamWagers(){
        isWagerRefreshSpinning.value = true
        await teamsStore.getTeamWagers()
        setTimeout( () => {
            isWagerRefreshSpinning.value = false
        }, 1000);
    }

    // Pick the next available question
    function getRandomQuestion(){
        try { 
            let questionPool = _getQuestionPool()
            if(questionPool.length > 0 ){
                let randIdx = Math.floor(Math.random()*questionPool.length)
                let question = questionPool[randIdx] as QuestionAnswerPair
                if(question != undefined){
                    question._canOpen = true
                    question._showSelectable = true
                    nextQuestion.value = question._quesitonKey
                }
            } else { 
                showFinalJeopardyButton.value = true
                showNextQuestionSection.value = false
            }
        } catch(err){
            console.error(err);
        }
    }

    // Start a new game
    function onStartGame(){
        isGameStarted.value = true
        gameStartDate.value = new Date()
        filtersStore.setFilter("gameStarted", true)
        // If the game select option is last right, let all cells be selectable
        if(selectQuestionOption.value == 2){
            _setAllQuesitonsCanOpen()
        }
        onNextQuestion()
    }

    function onColumnRevealed(){
        columnsRevealed.value += 1;
        canPlayGame.value = (columnsRevealed.value >= mainCategories?.value?.length)
    }

    function onNextQuestion(){
        if(selectQuestionOption.value == 1){
            showNextQuestionSection.value = true
            getRandomQuestion()
        } else if(selectQuestionOption.value == 2){
            let questionPool = _getQuestionPool()
            if(questionPool.length == 0){
                showFinalJeopardyButton.value = true
            }
        }
    }

    function showFinalJeopardy(){
        isFinalJeopardy.value = true
        showFinalJeopardyButton.value = false
        showNextQuestionSection.value = false
    }

    // Get a pool of questions that are available in game
    function _getQuestionPool(){
        let questionPool = new Array<QuestionAnswerPair>()
        for(let category of currentGame.value.Categories){
            if(category.isFinalJeopardy()){
                continue
            }

            let availableQnA = category.QuestionAnswerPairs.filter( (x:QuestionAnswerPair) => !x._prevOpen )
            for(let qna of availableQnA){
                questionPool.push(qna)
            }
        }
        return questionPool
    }

    // For certain game types, just make all questions available to open
    function _setAllQuesitonsCanOpen(){
        let questionPool = _getQuestionPool()
        for(let question of questionPool){
            question._canOpen = true
        }
    }

    onMounted( async () => {
        if(currentGame.value == null){
            await gamesStore.getCurrentGame()
        }
        categories.value = currentGame?.value?.Categories
        gamesStore.setCurrentSession()
        await teamsStore.getTeams()
    })

</script>

<style>

    #playFinalJeopardyButtonSection { text-align:center; padding:1% 0%; }

    #jeopardyBoard { display:flex; flex-wrap: wrap; align-items:start; justify-content: space-between;}
    
    .columns { display:flex; flex-wrap: wrap; justify-content:left; align-items: start; gap:10px;  }

    #question_view { z-index:100; width:100%; position:fixed; bottom:0; top:0; background-color:#060CE9; color:#F5F5F5; text-align:center; overflow-y: scroll; }
    #value_header { position:fixed; top:7px; right:7px; font-size:22px; width:20%; font-weight:bolder;}
    #revealAnswerButton { font-size:15px; cursor:pointer; }
    .answer_link { color:white; font-size:50%; }
    #assign_scores_block { padding:1%; text-align:right; }
    #close_question_view { position:fixed; z-index:1000; top:0; left:0; width:10%; padding:1%; text-align:left; cursor:pointer; }

    /* .teamSectionRow { display:flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 30px; } */

    #teamSection { display:flex; flex-direction: column; gap:10px; justify-content: left; align-items: start; }

    .boardModal{ 
        position: absolute;
        z-index: 1000;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>