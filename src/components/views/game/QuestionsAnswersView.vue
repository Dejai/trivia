<template>
    <div>
        <div v-if="isNewCategory">
            <CategoryForm
                :is-new="true"
                />
        </div>
        <div id="listOfCategories">
            <CategoryTableView v-for="(category, idx) in categories"
                :key="category"
                :category="category"
                :index="idx"
                :count="categories?.length ?? 0"
                />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useRoute } from 'vue-router'
    import { storeToRefs } from 'pinia';
    import { useGamesStore } from '@/stores/games'
    import { useFiltersStore } from '@/stores/filters'
    import CategoryTableView from '@/components/views/game//CategoryTableView.vue'
    import CategoryForm from '@/components/views/game/CategoryForm.vue'

    const route = useRoute()
    const gamesStore = useGamesStore()
    const filtersStore = useFiltersStore()
    const { currentGame } = storeToRefs(gamesStore)
    const { filters } = storeToRefs(filtersStore)

    const categories = computed( () => currentGame.value?.Categories?.sort( (a:any, b:any) => a.Order - b.Order ) )
    const isNewCategory = computed( () => filters.value.categoryForm )   

</script>

<style scoped>
    #listOfCategories { height:750px; overflow-y:scroll;}
    #headerActionSection { display:flex; flex-wrap: wrap; justify-content: left; align-items: center; gap: 40px; padding:2% 0%; }
    #errorsSection { padding:0% 0% 2% 2%; }
</style>

