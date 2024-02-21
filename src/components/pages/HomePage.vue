<template>
    <div v-if="showGames">
        <!-- <button @click="onNewGame">NEW GAME</button> -->
        <div id="gameCoversSection" class="flex-row flex-wrap flex-align-start flex-gap-25">
            <GameCover class="gameBlock gameCoverCard" v-for="game in games"
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
  import { ref, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useGamesStore } from '@/stores/games'
  import GameCover from '@/components/views/game/_GameCover.vue'
  import router from '@/router'
  import SpinnerIcon from '@/components/icons/FontAwesome/SpinnerIcon.vue';

  const gamesStore = useGamesStore()
  const { games, gamesLoaded } = storeToRefs(gamesStore)

  const showGames = computed( ()=> gamesLoaded.value)

  function onNewGame(){
    router.push({name: 'newgame'})
  }
</script>

<style scoped>
    #gameCoversSection { width:100%; justify-content: center; }
    @media (min-width: 1024px) {
        #gameCoversSection { justify-content: left; }
    }
</style>