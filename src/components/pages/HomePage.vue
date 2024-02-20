<template>
    <div v-if="showGames">
        <button @click="onNewGame">NEW GAME</button>
        <div id="gameBlocks">
            <GameCover class="gameBlock pointer" v-for="game in games"
                :key="game.GameID"
                :game="game"
            />
        </div>
    </div>
    <div v-else>
        <h2>LOADING ... </h2>
    </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useGamesStore } from '@/stores/games'
  import GameCover from '@/components/views/game/_GameCover.vue'
  import router from '@/router'

  const gamesStore = useGamesStore()
  const { games, gamesLoaded } = storeToRefs(gamesStore)

  const showGames = computed( ()=> gamesLoaded.value)

  function onNewGame(){
    router.push({name: 'newgame'})
  }

</script>

<style scoped>
    #gameBlocks { display:flex; gap:10px; flex-wrap:wrap; justify-content:left; align-items:center; }
    #gameBlocks .gameBlock { max-width: 20%; }
</style>