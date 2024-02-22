<template>
    <div id="homePageSection" class="paddingFromMenu" v-if="showGames">
        <IconButton id="addNewGameButton" @click="onNavigateNewGame" class="color-green">
                <template #content>
                    <h3>Add New Game</h3>
                </template>
            </IconButton>
        <div id="gameCoversSection" class="flex-row flex-wrap flex-align-start flex-gap-25">
            <GameCover class="gameBlock gameCoverCard" v-for="game in sortedGames"
                :key="game.GameID"
                :game="game"
            />
        </div>
    </div>
    <div v-else>
        <h2>
            LOADING <spinner-icon/>
        </h2>
    </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useGamesStore } from '@/stores/games'
  import GameCover from '@/components/views/game/_GameCover.vue'
  import router from '@/router'
  import SpinnerIcon from '@/components/icons/FontAwesome/SpinnerIcon.vue';
  import IconButton from '@/components/views/IconButton.vue'
  import type Game from '@/models/Game'


  const gamesStore = useGamesStore()
  const { games, gamesLoaded } = storeToRefs(gamesStore)

  const sortedGames = computed( () => games.value.sort( (a:Game, b:Game) => a.Name.localeCompare(b.Name) ))

  const showGames = computed( ()=> gamesLoaded.value)

  function onNavigateNewGame() {
    router.push({name: 'newgame'});
  }

</script>

<style scoped>
    #addNewGameButton { padding-bottom: 5%; }
    #gameCoversSection { width:100%; justify-content: center; gap:25px }
    @media (min-width: 1024px) {
        #addNewGameButton { padding-bottom: 2%; }  
        #gameCoversSection { justify-content: left; gap:25px; }
    }
</style>