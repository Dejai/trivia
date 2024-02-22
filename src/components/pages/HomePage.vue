<template>
    <div id="homePageSection" v-if="showGames">
        <IconButton @click="onNavigateNewGame">
                <template #content>
                    <h2>Add New Game</h2>
                </template>
            </IconButton>
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
  import { ref, onMounted, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useGamesStore } from '@/stores/games'
  import GameCover from '@/components/views/game/_GameCover.vue'
  import router from '@/router'
  import SpinnerIcon from '@/components/icons/FontAwesome/SpinnerIcon.vue';
  import IconButton from '@/components/views/IconButton.vue'


  const gamesStore = useGamesStore()
  const { games, gamesLoaded } = storeToRefs(gamesStore)

  const showGames = computed( ()=> gamesLoaded.value)

  function onNavigateNewGame() {
    router.push({name: 'newgame'});
  }

</script>

<style scoped>
    #homePageSection { padding-top:5%;}
    #gameCoversSection { width:100%; justify-content: center; }
    @media (min-width: 1024px) {
        #homePageSection { padding-top:2%;}
        #gameCoversSection { justify-content: left; }
    }
</style>