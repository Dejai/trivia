<template>
    <div id="menuSection" class="width-100 flex-row flex-justify-left flex-align-center flex-nowrap" >
        <div id="menuItems" class="pointer width-100 flex-row flex-justify-left flex-align-center flex-gap-30">
            <h1 @click="onNavigateHome" class="leftMenuWidth color-blue">Trivia</h1>
            <h1 v-if="showMenuSubTitle1" class="gameTitle" @click="onNavigateGamePage">
                <span v-if="isLoading">
                    <spinner-icon/>
                </span>
                <p v-else>
                    {{ subtitle1 }}
                </p>
            </h1>
            <h1 v-if="showMenuSubTitle2" style="border-left:2px solid gray;padding-left:1%;">
                <span class="italic" style="font-size:80%;">
                    session:
                     <span style="color:orange; font-style: italic;">{{ route.params?.sessionID ?? "" }} 
                    </span>
                </span> 
            </h1>
            
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue';
    import { useRoute } from 'vue-router'
    import { storeToRefs } from 'pinia';
    import { useGamesStore } from '@/stores/games'
    import { useMenuStore } from '@/stores/menu'
    import { useFiltersStore } from '@/stores/filters'
    import SpinnerIcon from '@/components/icons/FontAwesome/SpinnerIcon.vue'

    import router from '@/router'

    const route = useRoute()
    const gamesStore = useGamesStore()
    const menuStore = useMenuStore()
    const filtesStore = useFiltersStore()

    const { currentGame } = storeToRefs(gamesStore)
    const { gameName, subtitle1, subtitle2 } = storeToRefs(menuStore)
    const { filters } = storeToRefs(filtesStore)

    const isLoading = computed( () => subtitle1.value == "loading" )
    const showMenuSubTitle1 = computed( () =>  subtitle1.value != "" )
    const showMenuSubTitle2 = computed( () =>  subtitle2.value != "" )

    // Navigate to home
    function onNavigateHome(){
        if(!filters.value.preventUnload){
            router.push( { name: "home" } )
        }
    }

    // Go back to game page
    function onNavigateGamePage(){
        if(!filters.value.preventUnload){
            router.push({name: "game", params: { gameID: currentGame.value.GameID , tab: route.params.tab }})
        }
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