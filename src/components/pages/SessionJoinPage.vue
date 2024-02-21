<template>
    <main>
        <div v-if="isMounted">
            <div v-if="hasExistingTeam" class="flex-column flex-gap-10">
                <div>
                    <h1>Existing Team</h1>
                    <p>You already joined this session as team:</p>
                    <p style="padding-left:10%;">
                        <span class="color-orange italic">{{ teamName }}</span>
                    </p>
                </div>
                <div class="flex-row flex-space-between">
                    <IconButton class="color-green" @click="enterSession">
                        <template #icon>
                            <h3><circle-check-icon/></h3>
                        </template>
                        <template #content>
                            <h3>USE THIS TEAM</h3>
                        </template>
                    </IconButton>
                    <IconButton class="color-blue" @click="useNewTeam">
                        <template #content>
                            <h3>NEW TEAM</h3>
                        </template>
                    </IconButton>
                </div>
            </div>
            <div v-else id="enterTeamNameSection">
                <div>
                    <h2>Team Name</h2>
                    <input class="fieldInput" id="teamName" type="text" placeholder="Enter a team name" v-model="teamName" autocomplete="off">
                </div>
                
                <IconButton v-if="!isJoining" @click="enterSession" :class="{ 'color-blue': canJoinSession}">
                    <template #icon>
                        <h3><up-right-from-square-icon/></h3>
                    </template>
                    <template #content>
                        <h3>JOIN SESSION</h3>
                    </template>
                </IconButton>
                <h2 v-if="isJoining"><spinner-icon/></h2>
            </div>
        </div>
        <div v-else>
            <h1><spinner-icon/></h1>
        </div>
    </main>
</template>

<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useRouter, useRoute } from 'vue-router';
    import { useGamesStore } from '@/stores/games'
    import { useMenuStore } from '@/stores/menu';
    import { useTeamsStore } from '@/stores/teams';
    import { useCode } from '@/composables/useCode'
    import { useCookie } from '@/composables/useCookie';
    import IconButton from '@/components/views/IconButton.vue';
    import UpRightFromSquareIcon from '@/components/icons/FontAwesome/UpRightFromSquareIcon.vue';
    import SpinnerIcon from '@/components/icons/FontAwesome/SpinnerIcon.vue';
    import CircleCheckIcon from '@/components/icons/FontAwesome/CircleCheckIcon.vue';

    const gamesStore = useGamesStore()
    const router = useRouter()
    const route = useRoute()
    const menuStore = useMenuStore()
    const teamsStore = useTeamsStore()

    const { currentGame } = storeToRefs(gamesStore);
    const teamCode = ref("")
    const teamName = ref("")
    const hasExistingTeam = ref(false)
    const existingTeam = ref("")
    const isMounted = ref(false)
    const isJoining = ref(false)

    const canJoinSession = computed( () => teamName.value != "")

    // Play a game (as a player)
    async function enterSession(){
        if(teamName.value != ""){
            isJoining.value = true
            await teamsStore.createTeam(teamCode.value, teamName.value)
            router.push( {name: "team", params: { gameID: route.params.gameID, sessionID: route.params.sessionID, teamID: teamCode.value }})
        }
    }

     // Check for existing cookie & if none, set one with this game,session
     function checkSessionCookie(){
        const cookieNameBase = `dtk-trivia-${route.params.gameID}_${route.params.sessionID}`;
        let cookieValue = useCookie("get", cookieNameBase)
        if(cookieValue != ""){
            let splits = cookieValue.split(" - ");
            teamName.value = splits?.[0] ?? "";
            teamCode.value = splits?.[1] ?? "";
            hasExistingTeam.value = true;
            existingTeam.value = cookieValue
        }
    }

    // Enter with existing team
    function useExistingTeam(){
        enterSession()
    }

    // Use a new team on this session
    function useNewTeam(){
        teamName.value = "";
        let { code } = useCode(5);
        teamCode.value = code
        hasExistingTeam.value = false;
    }

    onMounted( async () => {
        await gamesStore.getCurrentGame()
        let { code } = useCode(5)
        teamCode.value = code?.toUpperCase();
        menuStore.setMenuValue("subtitle1", currentGame.value.Name)
        checkSessionCookie();
        isMounted.value = true;
    })

    onBeforeUnmount(() => {
        menuStore.clearMenuValue("subtitle2")
    })

</script>

<style scoped>
    #enterTeamNameSection { display:flex; flex-direction: column; gap:20px; justify-content: left; }
    #teamName { font-size:22px; width:90%; }
    @media (min-width: 1024px) {
        
    }
</style>