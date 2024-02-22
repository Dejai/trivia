<template>
    <div id="menuSection" class="width-100 flex-row flex-justify-left flex-align-center flex-nowrap" >
        <div id="menuItems" class="pointer width-100 flex-row flex-justify-left flex-gap-30">
            <h1 @click="onNavigateHome" class="leftMenuWidth">Trivia</h1>
            <h1 v-if="showMenuSubTitle1" class="gameTitle" @click="onNavigateGamePage">
                <span v-if="isLoading">
                    <spinner-icon/>
                </span>
                <p v-else>
                    {{ subtitle1 }}
                </p>
            </h1>
            <h2 v-if="showMenuSubTitle2">
                | 
                <span style="font-style:italic;font-size:smaller;">
                    session:
                     <span style="color:orange; font-style: italic;">{{ route.params?.sessionID ?? "" }} 
                    </span>
                </span> 
            </h2>
        </div>
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
    /* #menuSection {margin-bottom:10%;  } */
    #menuItems { flex-wrap: wrap;}

    @media (min-width:1024px) { 
        #menuItems { flex-wrap: nowrap;}
        #menuSection { margin-bottom:0px; }
    }

</style>