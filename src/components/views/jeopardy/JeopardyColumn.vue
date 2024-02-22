<template>

    <main>
        <div class="jeopardyColumn" >
            <h2 class="jeopardyColumnHeader pointer" style="width:100%;" @click="showCategoryHeader">
                <span v-if="showCategory">
                    {{ categoryName }}
                </span>
                <p v-else style="width:100%;">
                    &nbsp;
                </p>
            </h2>
            <JeopardyCell style="width:100%;" v-if="!isFinalJeopardyCagtegory" v-for="pair in pairs" 
                :key="pair.Value"    
                :pair="pair"
                :category-name="props.category.Name"
                :active="isActiveCategory"
                :is-final-jeopardy="props.category.isFinalJeopardy()"
                @next="onNext" />
            <FinalJeopardyCell style="width:100%;" v-if="isFinalJeopardyCagtegory" v-for="pair in pairs" 
                :key="pair.Value"    
                :pair="pair"
                :category-name="props.category.Name"
              />
        </div>
    </main>

</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import JeopardyCell from '@/components/views/jeopardy/JeopardyCell.vue'
    import Category from '@/models/Category'
    import FinalJeopardyCell from '@/components/views/jeopardy/FinalJeopardyCell.vue';

    const props = defineProps<{
        category: Category 
    }>()

    const emit = defineEmits(["revealed", "next"])

    const isFinalJeopardyCagtegory = ref(props.category.isFinalJeopardy())
    const showCategory = ref(false)
    const categoryName = props.category?.Name
    const pairs = props.category?.QuestionAnswerPairs;
    const isActiveCategory = ref(false)

    function onNext(){
        emit("next")
    }

    function showCategoryHeader(){
        showCategory.value = true
        isActiveCategory.value = true
        emit("revealed")
    }

</script>

<style>
    .jeopardyColumn { display:flex; flex-direction: column; gap:10px; justify-content: center; align-items: center; }

    .jeopardyColumnHeader { color:#F5F5F5; font-size:25px; height:100px; background-color:#060CE9; display:flex; justify-content: center; align-items: center; }


</style>