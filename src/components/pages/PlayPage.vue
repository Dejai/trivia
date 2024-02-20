<template>
    <main>
        <div v-if="existingTeam">
            <h1>Existing Team</h1>
            <p>Looks like you already joined this game/session as team = {{ existingTeam }}</p>
            <p>Want to re-join as this team?</p>
            <button @click="useExistingTeam">YES, RE-JOIN</button>
            <button @click="useNewTeam">NO, NEW TEAM</button>
        </div>
        <div v-else>
            <div>
                Team Code: {{ teamCode }}
            </div>
            <div id="enter_team_name_section">
                <h2>Enter Team Name</h2>
                <input id="team_name" type="text" name="team_name" v-model="teamName" autocomplete="off">
            </div>
            <button @click="enterSession"> PLAY </button>
        </div>

    </main>
</template>


<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useRouter, useRoute } from 'vue-router';
    import { useGamesStore } from '@/stores/games'
    import { useAuthStore } from '@/stores/auth'
    import { useMenuStore } from '@/stores/menu';
    import { useTeamsStore } from '@/stores/teams';
    import { useCode } from '@/composables/useCode'
    import { useCookie } from '@/composables/useCookie';

    const gamesStore = useGamesStore()
    const router = useRouter()
    const authStore = useAuthStore()
    const route = useRoute()
    const menuStore = useMenuStore()
    const teamsStore = useTeamsStore()

    const { currentGame } = storeToRefs(gamesStore);
    const { isLoggedIn } = storeToRefs(authStore);
    const { teams } = storeToRefs(teamsStore)
    const teamCode = ref("")
    const teamName = ref("")
    const existingTeam = ref("")

    const hasExistingTeam = computed( () => existingTeam.value != "")

    // Play a game (as a player)
    async function enterSession(){
        await teamsStore.createTeam(teamCode.value, teamName.value)
        router.push( {name: "team", params: { gameID: route.params.gameID, sessionID: route.params.sessionID, teamID: teamCode.value }})
    }

     // Check for existing cookie & if none, set one with this game,session
     function checkSessionCookie(){
        const cookieNameBase = `dtk-trivia-${route.params.gameID}_${route.params.sessionID}`;
        console.log("Checking for cookie: " + cookieNameBase)
        let cookieValue = useCookie("get", cookieNameBase)
        console.log(cookieValue)
        if(cookieValue != ""){
            existingTeam.value = cookieValue
        }
    }

    // Enter with existing team
    function useExistingTeam(){
        teamCode.value = (existingTeam.value.split(" - ")?.[1] ?? "")?.toLowerCase()
        enterSession()
    }

    // Use a new team on this session
    function useNewTeam(){
        existingTeam.value = ""
    }

    onMounted( async () => {
        await gamesStore.getCurrentGame()
        let { code } = useCode(5)
        teamCode.value = code?.toUpperCase();
        menuStore.setMenuValue("subtitle1", currentGame.value.Name)
        checkSessionCookie();
    })

    onBeforeUnmount(() => {
        menuStore.clearMenuValue("subtitle2")
    })

</script>

<style scoped>
    .highlight { font-weight: bolder; }
    .highlight-orange { color:orange; }
    .highlight-red { color: red; }
    .teamSubmitSection { display:flex; flex-wrap: wrap; flex-direction: column; justify-content: left; align-items: center; gap:20px; }
    #answerInputField { min-width: 90%; font-size: 22px; }
    @media (min-width: 1024px) {
        #answerInputField { min-width:30%; max-width: 40%; }
        .teamSubmitSection { align-items: start; }
    }
</style>