<template>
    <div>
        <h3 class="nameSection"> {{gameName}}</h3>
        <p>{{gameDesc}}</p>
        <slot name="gameIcon"></slot>

        <button @click="openGame">OPEN</button>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import Game from '@/models/Game'
    import { useGamesStore } from '@/stores/games'

    const props = defineProps<{
        game: Game
    }>()

    const router = useRouter()
    const gamesStore = useGamesStore()
    
    const gameName = props.game.Name;
    const gameDesc = props.game.Description;
    const gameID = props.game.GameID

    // Open up the selected game
    function openGame() {
        router.push({name: "game", params: { gameID: gameID, tab: "overview" }})
    }

</script>