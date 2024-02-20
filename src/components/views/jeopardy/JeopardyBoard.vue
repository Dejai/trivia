<template>
    <main>
        <!-- <h2 v-if="showColumnTip">Click on the headers to reveal your categories</h2> -->
        <div id="jeopardyBoard">
            <div class="columns"  style="width:80%; position:relative;" v-if="!isFinalJeopardy">
                <JeopardyColumn :style="{width: mainCategoryWidths }" v-for="category in mainCategories" 
                    :key="category"
                    :category="category"

                    @revealed="onColumnRevealed"
                    @next="onNext"
                />
                <ModalView v-if="canPlayGame && !isGameStarted">
                    <template #header>
                        <h1 style="color:black !important;padding:5%;">Ready to Play?</h1>
                    </template>
                    <template #body>
                        <div>
                            <HeaderButton @click="onStartGame" style="font-size:24px; color:limegreen;">
                                <template #icon>
                                    <play-icon />
                                </template>
                                <template #content>
                                    Start Game
                                </template>
                            </HeaderButton>
                        </div>
                    </template>
                </ModalView>
            </div>
            <div class="columns" style="width:80%; position:relative;" v-if="isFinalJeopardy">
                <JeopardyColumn :style="{width: '100%' }" v-for="category in finalJeopardy" 
                    :key="category"
                    :category="category"
                    @revealed="onColumnRevealed"
                />
            </div>
            <div id="teamSection" style="width:15%;">
                <h1 style="width:100%;">Teams</h1>
                <HeaderButton v-if="!isGameStarted" @click="getTeamsForGame()">
                    <template #icon>
                        <h3>
                            <rotate-icon :spinning="isTeamRefreshSpinning"/>
                        </h3>
                    </template>
                    <template #content>
                        <h3>Get Teams</h3>
                    </template>
                </HeaderButton>
                <HeaderButton v-if="isFinalJeopardy && !filters.finalQuestionRevealed" @click="getTeamWagers">
                    <template #icon>
                        <h3>
                            <rotate-icon :spinning="isWagerRefreshSpinning"/>
                        </h3>
                    </template>
                    <template #content>
                        <h3>Check for Wagers</h3>
                    </template>
                </HeaderButton>
                <div class="teamRows">
                    <div class="teamSectionRow" v-for="team in teamsSorted">
                        <h3 style="max-width:75%;"><span style="color:limegreen" v-if="team.HasWager"><circle-check-icon/> &nbsp;</span>{{ team.Name }}</h3>
                        <h3 v-if="team.HasWager">{{ team.FinalScore }}</h3>
                        <h3 v-else>{{ team.Score }}</h3>
                    </div>
                </div>
            </div>
            <br/>
            <div v-if="isGameStarted && !isFinalJeopardy" style="width:80%; text-align: center; padding-top:0.5%; ">
                <h2>Next Question:</h2>
                <h2 v-if="showFinalJeopardyButton">
                    <button style="background-color:red; color:white; border:none;" @click="showFinalJeopardy">
                        <h2>FINAL JEOPARDY!</h2>
                    </button>
                </h2>
                <h2 v-else>{{ nextQuestion }}</h2>
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
    import HeaderButton from '@/components/views/game/HeaderButton.vue'
    import RotateIcon from '@/components/icons/FontAwesome/RotateIcon.vue'
    import  CircleCheckIcon from '@/components/icons/FontAwesome/CircleCheckIcon.vue'

    const route = useRoute()
    const gamesStore = useGamesStore()
    const menuStore = useMenuStore()
    const teamsStore = useTeamsStore()
    const filtersStore = useFiltersStore()

    const { currentGame } = storeToRefs(gamesStore)
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

    const currentSession = computed( () => currentGame?.value.getSession(route.params.sessionID ))
    const mainCategories = computed( () => currentGame?.value?.Categories.filter( (cat:Category) => !cat.isFinalJeopardy()) )
    const mainCategoryWidths = computed( () => (96 / mainCategories.value.length ) + "%" )
    const finalJeopardy = computed( () => currentGame?.value?.Categories.filter( (cat:Category) => cat.isFinalJeopardy()) )
    const teamsSorted = computed( ()=> teams.value.sort( (a,b) => b.Score - a.Score ))

    // Game settings
    // const sessionSettings = computed( () => currentSession?.value?.Settings ?? {} )
    // const userPicksQuestion = computed( () => currentSession?.value.getSettingValue("Selecting Questions")?.optionID == 2)

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
            let availableCells = Array.from(document.querySelectorAll(".questionCell:not(.cellViewed)"))
            for(let cell of availableCells){
                cell.classList.remove("selectableCell")
            }
            let randIdx = Math.floor(Math.random()*availableCells.length)
            let cell = availableCells[randIdx]
            if(cell != undefined){
                cell.classList.add("selectableCell")
                let questionKey = cell.getAttribute("data-question-key")
                nextQuestion.value = questionKey ?? ""
            } else { 
                showFinalJeopardyButton.value =true
            }
        } catch(err){
            console.info(err);
        }
        
    }

    // Start a new game
    function onStartGame(){
        isGameStarted.value = true
        filtersStore.setFilter("gameStarted", true)
        getRandomQuestion();
    }

    function onColumnRevealed(){
        columnsRevealed.value += 1;
        canPlayGame.value = (columnsRevealed.value >= mainCategories?.value?.length)
    }

    function onNext(){
        getRandomQuestion()
    }

    function showFinalJeopardy(){
        isFinalJeopardy.value = true
    }

    onMounted( async () => {
        if(currentGame.value == null){
            await gamesStore.getCurrentGame()
        }
        categories.value = currentGame?.value?.Categories
        await teamsStore.getTeams()
    })

</script>

<style>
    #jeopardyBoard { display:flex; flex-wrap: wrap; align-items:start; justify-content: space-between;}
    
    .columns { display:flex; flex-wrap: wrap; justify-content:left; align-items: start; gap:10px;  }

    #question_view { z-index:100; width:100%; position:fixed; bottom:0; top:0; background-color:#060CE9; color:#F5F5F5; text-align:center; overflow-y: scroll; }
    #value_header { position:fixed; top:7px; right:7px; font-size:22px; width:20%; font-weight:bolder;}
    #revealAnswerButton { font-size:15px; cursor:pointer; }
    .answer_link { color:white; font-size:50%; }
    #assign_scores_block { padding:1%; text-align:right; }
    #close_question_view { position:fixed; z-index:1000; top:0; left:0; width:10%; padding:1%; text-align:left; cursor:pointer; }

    .teamSectionRow { display:flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 30px; }

    #teamSection { display:flex; flex-direction: column; gap:10px; justify-content: left; align-items: start; }

    .teamRows .teamSectionRow:nth-child(1) { color: gold !important; }
    .teamRows .teamSectionRow:nth-child(2) { color: white !important; }
    .teamRows .teamSectionRow:nth-child(3) { color: maroon !important; }

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