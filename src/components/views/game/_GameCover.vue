<template>
    <div class="gameCoverCard flex-column flex-gap-15" @click="openGame">
        <h3 class="gameCoverName"> {{gameName}}</h3>
        <p style="width:90%;">{{gameDesc}}</p>
        <IconButton class="color-blue" >
            <template #icon>
                <share-from-square-icon/>
            </template>
            <template #content>
                Open
            </template>
        </IconButton>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import Game from '@/models/Game'
    import { useGamesStore } from '@/stores/games'
    import IconButton from '@/components/views/IconButton.vue'
    import ShareFromSquareIcon from '@/components/icons/FontAwesome/ShareFromSquareIcon.vue';

    const props = defineProps<{
        game: Game
    }>()

    const router = useRouter()
    const gamesStore = useGamesStore()
    
    const gameName = props.game.Name;
    const gameDesc = (props.game.Description.length > 55) ? props.game.Description.substring(0,53)+"...": props.game.Description;
    const gameID = props.game.GameID

    // Open up the selected game
    function openGame() {
        router.push({name: "game", params: { gameID: gameID, tab: "overview" }})
    }

</script>

<style scoped>
    .gameCoverName { color:white; }
    .gameCoverCard { box-shadow: 0 4px 8px 0 rgba(224, 224, 236, 0.2); transition: 0.3s; padding:5%; cursor:pointer; width:95%; height:160px; border-radius: 25px; }
    .gameCoverCard:hover { transform: scale(1.02) }

    @media (min-width: 1024px) {
        .gameCoverCard { width: 15%; padding:1%; }
    }
</style>