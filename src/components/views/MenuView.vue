<template>
    <div id="menuSection" class="dtk-menu-sticky2" >
        <h1 class="pointer"  style="width:100%;">
            <span @click="onNavigateHome">Trivia</span>
            <span style="padding-left:0.5%;" v-if="showMenuSubTitle1" @click="onNavigateGamePage">
                |
                <span v-if="isLoading">
                    <spinner-icon/>
                </span>
                <span v-else>
                    {{ subtitle1 }}
                </span>
            </span>
            <span style="padding-left:0.5%;" v-if="showMenuSubTitle2">
                | 
                <!-- <span v-if="isGameBoard"> -->
                    <span style="font-style:italic;font-size:smaller;">session: <span style="color:orange; font-style: italic;">{{ route.params?.sessionID ?? "" }} </span></span> </span>
                <!-- </span> -->
                <!-- <span v-else> -->
                    <!-- {{ subtitle2 }} -->
                <!-- </span> -->
                
        </h1>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue';
    import { useRoute } from 'vue-router'
    import { storeToRefs } from 'pinia';
    import { useGamesStore } from '@/stores/games'
    import { useMenuStore } from '@/stores/menu'
    import SpinnerIcon from '@/components/icons/FontAwesome/SpinnerIcon.vue'

    import router from '@/router'

    const route = useRoute()
    const gamesStore = useGamesStore()
    const menuStore = useMenuStore()

    const { currentGame } = storeToRefs(gamesStore)
    const { gameName, subtitle1, subtitle2 } = storeToRefs(menuStore)

    const isLoading = computed( () => subtitle1.value == "loading" )
    const isGameBoard = computed( () => route.name == "game" )
    const showMenuSubTitle1 = computed( () =>  subtitle1.value != "" )
    const showMenuSubTitle2 = computed( () =>  subtitle2.value != "" )

    // Navigate to home
    function onNavigateHome(){
        router.push( { name: "home" } )
    }

    // Go back to game page
    function onNavigateGamePage(){
        router.push({name: "game", params: { gameID: currentGame.value.GameID , tab: route.params.tab }})
    }

    function _routeNameMatch(routeName:string|undefined = ""){
        return ["board", "game", "play", "team"].includes(routeName)
    }

    onMounted( async () => {
        if(currentGame.value == null){
            await gamesStore.getCurrentGame()
        }
        gameName.value = currentGame?.value?.Name
    })
</script>

<style scoped>
    /* #menuSection { position: sticky; top: 0; z-index: 100; opacity: 100; margin-bottom:2%; display:flex; justify-content: left; flex-wrap: wrap; align-items: center; gap:20px; } */
    #menuSection { width:100%; margin-bottom:2%; display:flex; justify-content: left; flex-wrap: wrap; align-items: center; gap:20px; }
    
</style>