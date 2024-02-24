<template>
    <main style="margin-bottom:3%;">
        <h2 class="categoryTitle">
            <input type="text" class="categoryName" placeholder="Enter category name" name="categoryName" v-model="props.category.Name" :disabled="!showEditCategory">
            <pen-to-square-icon class="pointer" v-if="!showEditCategory" @click="onEditCategory" />
            <div class="categoryEditSubsection" :class="{'editingCategory': showEditCategorySection}">
                <div v-if="!isFinalJeopardy">
                    Sort By: &nbsp;
                    <select v-model="props.category.SortBy" style="font-size:inherit;">
                        <option v-for="option in categorySortOptions" :value="option">{{ option }}</option>
                    </select>
                </div>
                <div v-if="!isFinalJeopardy" class="flex-row flex-justify-space-between">
                    <p>Move: &nbsp;</p>
                    <div class="flex-row flex-justify-space-between">
                        <IconButton v-if="!isFirstCategory" class="color-white">
                            <template #icon>
                                <arrow-up-icon class="orderIcon upIcon pointer" @click="onMoveCategoryUp"/>
                            </template>
                            <template #content>&nbsp;</template>
                        </IconButton>
                        <IconButton v-if="!isLastCategory" class="color-white">
                            <template #icon>
                                <arrow-down-icon class="orderIcon downIcon pointer" @click="onMoveCategoryDown"/>
                            </template>
                            <template #content>&nbsp;</template>
                        </IconButton>
                    </div>
                </div>
                <div>
                    <IconButton class="color-green" @click="onSaveCategory">
                        <template #icon>
                            <floppy-disk-icon/>
                        </template>
                        <template #content>
                            save
                        </template>
                    </IconButton>
                </div>
                <div>
                    <IconButton class="color-orange" @click="onCancelCategoryEdit">
                        <template #icon>
                            <x-mark-icon />
                        </template>
                        <template #content>
                            cancel
                        </template>
                    </IconButton>
                </div>
                <div v-if="!isFinalJeopardy">
                    <IconButton class="color-red"  @click="onDeleteCategory">
                        <template #icon>
                            <trash-can-icon />
                        </template>
                        <template #content>
                            delete
                        </template>
                    </IconButton>
                </div>
            </div>
            <div v-if="isDeleting">
                <h3>Are you sure?</h3>
                <button class="button-round bg-color-red color-white" @click="onYesDeleteCategory">YES, DELETE CATEGORY</button>
                &nbsp;
                <button class="button-round bg-color-white color-black" @click="onCancelDeleteCategory">CANCEL</button>
            </div>
        </h2>
        <table class="categoryQuestionsTable" style="border-spacing: 0px; padding:1% 0% 0% 2%;">
            <colgroup>
                <col style="width:5%">
                <col style="width:40%">
                <col style="width:25%">
                <col style="width:25%">
            </colgroup>
            <thead v-if="showTableHeaders">
                <tr style="text-align:left;">
                    <th> <h4 class="bold color-white">Value</h4></th>
                    <th> <h4 class="bold color-white">Question</h4></th>
                    <th> <h4 class="bold color-white">Answer</h4></th>
                    <th>
                        <IconButton class="color-blue" v-if="showEditAll" @click="onEditAllQuestions($event)">
                            <template #icon>
                                <pencil-icon/>
                            </template>
                            <template #content>
                                edit all
                            </template>
                        </IconButton>
                        <IconButton class="color-green saveQnAIcon" v-if="showSaveAll" @click="onSaveAllQuestions">
                            <template #icon>
                                <floppy-disk-icon />
                            </template>
                            <template #content>
                                save all
                            </template>
                        </IconButton>
                    </th>
                    <th>
                       <p v-if="isCustomOrder" style="text-align:center !important;">{{  props.category?.SortBy }}</p>
                    </th>
                </tr>
            </thead>
            <tbody class="categorySectionBody">
                <QuestionAnswerPairRow v-for="(questionPair, idx) in questionAnswerPairs"
                    :key="questionPair.Value"
                    :category="props.category"
                    :question-answer-pair="questionPair"
                    :index="idx"
                    :count="questionAnswerPairs?.length ?? 0"

                    @editing="onQnAEdit"
                    @saved="onQnASave"
                    />
                <tr v-if="showAddQuestion">
                    <td colspan="5" style="text-align:left;padding-top:1%;">
                        <button @click="addQuestion">Add Question</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </main>
</template>

<script setup lang="ts">
    import Category from '@/models/Category'

    import { ref, computed } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useGamesStore } from '@/stores/games'
    import QuestionAnswerPair from '@/models/QuestionAnswerPair'
    import QuestionAnswerPairRow from '@/components/views/game/QuestionAnswerPairRow.vue'
    import ArrowDownIcon from '@/components/icons/FontAwesome/ArrowDownIcon.vue'
    import ArrowUpIcon from '@/components/icons/FontAwesome/ArrowUpIcon.vue'
    import PenToSquareIcon from '@/components/icons/FontAwesome/PenToSquareIcon.vue'
    import FloppyDiskIcon from '@/components/icons/FontAwesome/FloppyDiskIcon.vue'
    import XMarkIcon from '@/components/icons/FontAwesome/XMarkIcon.vue'
    import TrashCanIcon from '@/components/icons/FontAwesome/TrashCanIcon.vue'
    import PencilIcon from '@/components/icons/FontAwesome/PencilIcon.vue'
    import IconButton from '@/components/views/IconButton.vue'
    import appConfig from "@/assets/config/app.json"

    const props = defineProps<{
        category:Category,
        index?:number,
        count?:number
    }>()

    const gamesStore = useGamesStore()
    const { currentGame } = storeToRefs(gamesStore)

    const categorySortOptions = ref( appConfig.CategorySorts ?? [] )
    const showEditCategory = ref(false)
    const isDeleting = ref(false)
    const isFinalJeopardy = props.category.isFinalJeopardy()
    // Keep track of category values (before edited)
    const categoryCopy = ref(new Category({}))
    const questionsBeingEdited = ref(0)

    const showTableHeaders = computed( () => (props.category.QuestionAnswerPairs?.length ?? 0) > 0 )
    const isCustomOrder  = computed( () => props.category?.SortBy === "Custom Order")
    const questionAnswerPairs = computed( () => isCustomOrder.value 
                                                    ? props.category?.QuestionAnswerPairs?.sort( (a,b) => a.Order - b.Order ) 
                                                    : props.category?.QuestionAnswerPairs?.sort( (a,b) => a.Value - b.Value ) )
    const showEditCategorySection = computed( () => showEditCategory.value && !isDeleting.value )
    const showAddQuestion = computed( () => !isFinalJeopardy )
    const isFirstCategory = computed( () => props.index == 0)
    const isLastCategory = computed( () => props.index == (props.count ?? 0)-2 )
    const showEditAll = computed( () => questionsBeingEdited.value < props.category.QuestionAnswerPairs.length)
    const showSaveAll = computed( () => questionsBeingEdited.value == props.category.QuestionAnswerPairs.length)
    

    // Keeping track of questions being edited
    function onQnAEdit(){ questionsBeingEdited.value++ }
    function onQnASave(){ questionsBeingEdited.value-- }

    // Edit a question
    function addQuestion() {
        let nextValue = props.category.getNextQnAValue()
        let nextOrder = props.category.getNextQnAOrder()
        let newQnA = new QuestionAnswerPair({ Value: nextValue}, nextOrder, true)
        props.category.addNewPair(newQnA)
    }

    // A way to edit all questions
    function onEditAllQuestions(ev:any){
        let target = ev.target
        let table = target.closest("table")
        let buttons = table.querySelectorAll(".editQnAIcon")
        console.log(buttons)
        buttons.forEach( (element:any) => {
            element.click()
        });
    }

    function onSaveAllQuestions(ev:any){
        let target = ev.target
        let table = target.closest("table")
        let buttons = table.querySelectorAll(".saveQnAIcon")
        console.log(buttons)
        buttons.forEach( (element:any) => {
            element.click()
        });
        questionsBeingEdited.value = 0
    }

    // Editing the category
    function onEditCategory() {
        categoryCopy.value = new Category(props.category);
        showEditCategory.value = true
    }

    function onSaveCategory(){
        showEditCategory.value = false
        gamesStore.setGameSaveNeeded();
    }

    function onCancelCategoryEdit(){
        props.category.Name = categoryCopy.value.Name
        props.category.SortBy = categoryCopy.value.SortBy
        showEditCategory.value = false
    }

    function onDeleteCategory(){
        isDeleting.value = true
    }

    function onYesDeleteCategory(){
        currentGame.value.manageCategories("delete", props.category)
        gamesStore.setGameSaveNeeded();
    }

    function onCancelDeleteCategory(){
        isDeleting.value = false
    }

    // Swap this question's order in the list
    function onMoveCategoryUp(){
        if(isFirstCategory.value){ return }
        onSwapCategoryOrder("up")
        gamesStore.setGameSaveNeeded();
    }

    function onMoveCategoryDown(){
        if(isLastCategory.value){ return }
        onSwapCategoryOrder("down")
        gamesStore.setGameSaveNeeded();
    }

    function onSwapCategoryOrder(direction:string) {
        if(currentGame != undefined){
            let currOrder = props.category.Order
            let newOrder = direction == "up" ? currOrder-1 : currOrder+1
            currentGame.value.updateCategoryOrder(currOrder, newOrder) // moves this category
        }
    }

</script>

<style scoped>
    .categoryQuestionsTable { text-align:left; width:90%; }

    .categoryTitle .isFirstRow span.upIcon { color:gray; }
    .categoryTitle span.orderIcon { margin-right:1%; color:white;}

    .categoryName { font-size: inherit; }
    .categoryName[disabled] { color:white; background-color: transparent; border:none;}

    .categoryTitle { display:flex; flex-wrap:nowrap; justify-content: left; align-items: center; gap:10px; }
    .categoryEditSubsection { width:0px; opacity:0; overflow:hidden; height:0px; }
    .categoryEditSubsection.editingCategory { transition: width,opacity ease 1s; width:55%; opacity:100; height:inherit;  display:flex; align-items: center; gap:20px; }

   .isLastRow span.downIcon { color:gray; }

</style>