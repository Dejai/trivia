<template>
    <main>
        <FormContainer :title="'New Category'">
            <p>Category ID: {{ categoryID }}</p>
            <FormRow>
                <label for="">Category Name</label>
                <input type="text" name="categoryName" placeholder="Enter a name" autocomplete="off" v-model="categoryName" required @focus="_clearFormError($event)">
            </FormRow>
            <FormRow>
                <label for="">Sort By?</label>
                <select v-model="categorySort">
                    <option v-for="option in categorySortOptions" :value="option">{{ option }}</option>
                </select>
            </FormRow>
            <FormActions>
                <div>
                    <button v-if="isNewCategory" @click="onAddCategory">ADD CATEGORY</button>
                    <button v-else @click="onUpdateCategory">UPDATE CATEGORY</button>
                    &nbsp;
                    <button @click="onCancelCategoryChange">CANCEL</button> 
                </div>
                <div v-if="!isNewCategory && !props.category?.isFinalJeopardy()">
                    <button @click="onDeleteCategory">DELETE</button>
                </div>
            </FormActions>
        </FormContainer>
    </main>
</template>

<script setup lang="ts">

    import { onMounted, ref, computed } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useCode } from '@/composables/useCode'
    import { useGamesStore } from '@/stores/games'
    import { useFiltersStore } from '@/stores/filters'
    import type Category from '@/models/Category'
    import FormContainer from '@/components/views/forms/FormContainer.vue'
    import FormRow from '@/components/views/forms/FormRow.vue'
    import FormActions from '@/components/views/forms/FormActions.vue'
    import config from "@/assets/config/app.json"

    const props = defineProps<{
        category?:Category,
        isNew?:boolean
    }>()

    const emit = defineEmits(["cancel", "save"])

    const gamesStore = useGamesStore()
    const filtersStore = useFiltersStore()
    const { currentGame } = storeToRefs(gamesStore)
    
    const categoryID = ref(props.category?.CategoryID ?? "")
    const categoryName = ref(props.category?.Name ?? "")
    const categoryOrder = ref(props.category?.Order ?? 0)
    const categorySort = ref(props.category?.SortBy ?? "Value")

    const categorySortOptions = ref( config.CategorySorts ?? [] )

    const isNewCategory = computed( () => props.isNew )
    const gameExists = computed( () => currentGame.value != undefined )

    const categoryTags = ref( props.category?.Tags ?? [])

    // Cancel making changes to a session
    function onCancelCategoryChange(){
        _clearFilter()
        emit("cancel")
    }

    // Add a session
    function onAddCategory(){
        let errors = 0
        let requiredFields = Array.from(document.querySelectorAll("[required]"))
        for(let field of requiredFields) {
            let input = <HTMLInputElement>field;
            let value = input.value ?? "";
            if(value == ""){
                input.classList.add("missingRequiredField")
                errors++;
            }
        }
        if(gameExists.value && errors == 0){
            currentGame.value.manageCategories("add", _getCategoryObj())
            _clearFilter()
            emit("save")
        }
    }

    // Update a session 
    function onUpdateCategory(){
        if(gameExists.value){
            currentGame.value.manageCategories("update", _getCategoryObj())
            _clearFilter()
            emit("save")
        }
    }

    // Delete a session
    function onDeleteCategory(){
        let proceed = confirm("Are you sure you want to remove this category? This cannot be undone!")
        if(proceed && gameExists.value){
            currentGame.value.manageCategories("delete", props.category)
            _clearFilter()
        }
    }

    // Clear filter on session form 
    function _clearFilter(){
        filtersStore.clearFilter("category")
        filtersStore.clearFilter("categoryForm")
        filtersStore.clearFilter("categoryEdit")
    }

    // Clear error class
    function _clearFormError(event:any){
        let target = event.target;
        if(target != undefined){
            target.classList.remove("missingRequiredField")
        }
    }

     // Get the added/updated session object
     function _getCategoryObj(){
        let categoryObj =  {
            "CategoryID": categoryID.value,
            "Name": categoryName.value,
            "Order": categoryOrder.value,
            "SortBy": categorySort.value,
            "Tags": categoryTags.value
        }
        return categoryObj
    }

    function _getNewCode(){
        let { code } = useCode(4)
        categoryID.value = code
    }

    onMounted( () => {
        if(categoryID.value == ""){
            _getNewCode()
        }
    })

</script>

<style scoped>
    #sessionForm { display:flex; flex-direction: column; gap:10px; padding-left:5%; margin-bottom:3%; }
    .sessionFormRow { display:flex; flex-wrap: wrap; gap:10px; justify-content: left; align-items: center;  }
    /* .sessionFormRow.hover:hover { background-color:gray; color:white; cursor:pointer; } */
    .sessionFormRow label { width:15%; }

    .sessionFormActions { display:flex; flex-wrap: wrap; justify-content:space-between; align-items: center; }


</style>