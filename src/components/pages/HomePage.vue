<template>
    <div id="homePageSection" class="paddingFromMenu" v-if="showGames">
        <div id="homeIconSection" class="flex-row flex-justify-left flex-align-center dtk-menu-sticky">
            <div v-if="!isSearching">
                <IconButton id="addNewGameButton" @click="onNavigateNewGame" class="color-green">
                    <template #content>
                        <h3>Add New Game</h3>
                    </template>
                </IconButton>
            </div>
            <div v-if="!isSearching">
                <IconButton id="searchButton" @click="onShowSearch" class="color-white">
                    <template #icon>
                        <magnifying-glass-icon/>
                    </template>
                    <template #content>
                        <h3>Search for Game</h3>
                    </template>
                </IconButton>
            </div>
            <div v-if="isSearching" class="flex-row flex-justify-left flex-gap-10">
                <input id="homePageSearch" type="text" placeholder="Search for game ..." v-model="searchText">
                <IconButton id="cancelSearchButton" @click="onCancelSearch" class="color-red">
                    <template #icon>
                        <x-mark-icon/>
                    </template>
                    <template #content>
                        <h3>Cancel</h3>
                    </template>
                </IconButton>
            </div>
        </div>
        <div id="gameCoversSection" class="flex-row flex-wrap flex-align-center dtk-after-sticky paddingFromMenu">
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
  import XMarkIcon from '@/components/icons/FontAwesome/XMarkIcon.vue'
  import MagnifyingGlassIcon from '@/components/icons/FontAwesome/MagnifyingGlassIcon.vue'
  import type Game from '@/models/Game'

  const gamesStore = useGamesStore()

  const { games, gamesLoaded } = storeToRefs(gamesStore)
  const isSearching = ref(false)
  const searchText = ref("")

  const filteredGames = computed( () => games.value.filter( (x:Game) => (searchText.value != "") ? x.containsText(searchText.value) : true ) )
  const sortedGames = computed( () => filteredGames.value.sort( (a:Game, b:Game) => a.Name.localeCompare(b.Name) ))
  const showGames = computed( ()=> gamesLoaded.value)

  function onShowSearch(){
    isSearching.value = true
  }

  function onCancelSearch(){
    isSearching.value = false
    searchText.value = ""
  }

  function onNavigateNewGame() {
    router.push({name: 'newgame'});
  }

</script>

<style scoped>
    #homeIconSection { gap: 30px; min-height:20px; background-color:var(--color-background); padding:5% 0%; }
    #addNewGameButton { padding-bottom: 5%; }
    #gameCoversSection { width:100%; justify-content: center; gap:35px }
    #homePageSearch { border-radius: 25px; font-size:22px; border:none;}
    @media (min-width: 1024px) {
        #homeIconSection { gap: 20px; padding:3% 0%; }
        #addNewGameButton { padding-bottom: 2%; }  
        #gameCoversSection { justify-content: left; gap:25px; }
    }
</style>