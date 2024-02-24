<template>
    <main style="margin-bottom:3%;">
        <h2>Game Archives</h2>
        <table class="archiveTable" style="border-spacing: 0px;">
            <colgroup>
                <col style="width:10%">
                <col style="width:15%">
                <col />
                <col />
            </colgroup>
            <thead v-if="hasArchives">
                <tr style="text-align:left;">
                    <th> <h4 class="bold color-white">Session</h4></th>
                    <th> <h4 class="bold color-white">Date</h4></th>
                    <th> <h4 class="bold color-white">Winner(s)</h4></th>
                </tr>
            </thead>
            <tbody class="categorySectionBody">
                <tr v-if="hasArchives" v-for="archive in archives">
                    <td>{{ archive.Session }}</td>
                    <td>{{ archive.Date }}</td>
                    <td class="pointer">
                        <IconButton @click="toggleTeams($event)">
                            <template #icon>
                                <circle-chevron-right class="closedIcon"/>
                                <circle-chevron-down class="openedIcon hidden"/>
                            </template>
                            <template #content>
                                {{ archive.getWinners() }}
                            </template>
                        </IconButton>
                        <div class="archiveSessionTeams">
                            <table style="width:25%; border-top:2px dotted white; margin:2% 0%;">
                                <tr v-for="team in archive.Teams">
                                    <td>{{ team.Name }}</td>
                                    <td>{{ team.FinalScore }}</td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
                <tr v-else>
                    <td colspan="3">
                        <p>No archives found for this game</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </main>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useGamesStore } from '@/stores/games'
    import CircleChevronDown from '@/components/icons/FontAwesome/CircleChevronDownIcon.vue'
    import CircleChevronRight from '@/components/icons/FontAwesome/CircleChevronRightIcon.vue'
    import IconButton from '@/components/views/IconButton.vue'

    const gamesStore = useGamesStore()

    const { currentGame } = storeToRefs(gamesStore)
    const archives = computed( () => currentGame.value.Archives )
    const hasArchives = computed( () => archives.value.length > 0)

    function toggleTeams(ev:any){
        let target = ev.target as HTMLElement;
        let parent = target.parentElement;
        let teamList = parent?.querySelector(".archiveSessionTeams")
        let closedIcon = parent?.querySelector(".closedIcon")
        let openedIcon = parent?.querySelector(".openedIcon")
        if(teamList != undefined){
            if(teamList.classList.contains("expanded")){
                teamList.classList.remove("expanded")
                closedIcon?.classList.remove("hidden")
                openedIcon?.classList.add("hidden")
            } else { 
                teamList.classList.add("expanded")
                closedIcon?.classList.add("hidden")
                openedIcon?.classList.remove("hidden")
            }
        }
    }

</script>

<style scoped>
   .archiveTable { width: 100%; }
   .archiveSessionTeams { height:0px; overflow:hidden; transition: all ease 1s;}
    .archiveSessionTeams.expanded { height:initial;  }

   @media (min-width:1024px) {
    .archiveTable { width: 50%; }
   }

</style>