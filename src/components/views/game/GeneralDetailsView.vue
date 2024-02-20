<template>
    
</template>


<script setup lang="ts">
    import { ref } from 'vue'
    import { useRoute } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useGamesStore } from '@/stores/games'

    const gamesStore = useGamesStore()
    const route = useRoute()
    
    const { currentGame } = storeToRefs(gamesStore);
    const gameName = ref(currentGame?.value?.Name ?? "")
    const gameDesc = ref(currentGame?.value?.Description ?? "")

</script>

<style>
</style>