<template>
    <div>
        <h3>
            Configure the settings/rules that you want to use for your game.
        </h3>
        <table id="settings_table" class="edit_game_section_table" style="width:100%;">
            <colgroup>
                <col style="width:65%; text-align:left;"/>
            </colgroup>
            <tbody id="settings_table_body">
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useRoute } from 'vue-router'
    import { storeToRefs } from 'pinia';
    import { useGamesStore } from '@/stores/games'

    const gamesStore = useGamesStore()
    const { currentGame } = storeToRefs(gamesStore)
    const categories = computed( () => currentGame.value?.Categories?.sort( (a:any, b:any) => a.Order - b.Order ) )

</script>