<template>
    <main id="boardSection">
        <JeopardyBoard />
    </main>
</template>

<script setup lang="ts">
    import { onMounted, onBeforeUnmount, ref } from 'vue'
    import { storeToRefs } from 'pinia'
    import JeopardyBoard from '@/components/views/jeopardy/JeopardyBoard.vue'
    import { useRoute } from 'vue-router'
    import { useMenuStore } from '@/stores/menu'
    import { useGamesStore } from '@/stores/games';

    const route = useRoute()
    const menuStore = useMenuStore()
    const gamesStore = useGamesStore()
    const { currentGame } = storeToRefs(gamesStore)

    onMounted( async () => {
        menuStore.setMenuValue("subtitle1", "loading")
        await gamesStore.getCurrentGame()
        gamesStore.setCurrentSession()
        let sessionID = route.params?.sessionID?.toString()
        menuStore.setMenuValue("subtitle1", currentGame.value.Name)
        menuStore.setMenuValue("subtitle2", sessionID)
    })

    onBeforeUnmount(() => {
        menuStore.clearMenuValue("subtitle2")
    })

</script>

<style scoped>
    #boardSection { padding-top:5%; }

    @media (min-width:1024px){
        #boardSection { padding-top:2%; }
    }
</style>