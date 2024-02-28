<template>

    <main>
        <div class="jeopardyColumn" >
            <h1 class="jeopardyColumnHeader pointer" style="width:100%;" @click="showCategoryHeader">
                <span v-if="showCategory">
                    {{ categoryName }}
                </span>
                <p v-else style="width:100%;">
                    &nbsp;
                </p>
            </h1>
            <JeopardyCell style="width:100%;" v-if="!isFinalJeopardyCagtegory" v-for="pair in pairs" 
                :key="pair.Value"    
                :pair="pair"
                :category-name="props.category.Name"
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
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { useCookie } from '@/composables/useCookie'
    import JeopardyCell from '@/components/views/jeopardy/JeopardyCell.vue'
    import Category from '@/models/Category'
    import FinalJeopardyCell from '@/components/views/jeopardy/FinalJeopardyCell.vue';

    const props = defineProps<{
        category: Category 
    }>()
    const emit = defineEmits(["revealed", "next"])

    const route = useRoute()

    const isFinalJeopardyCagtegory = ref(props.category.isFinalJeopardy())
    const showCategory = ref(props.category.isFinalJeopardy() ?? false)
    const categoryName = props.category.isFinalJeopardy() ? "Final Jeopardy!" : props.category?.Name
    const pairs = props.category?.QuestionAnswerPairs;

    function onNext(){
        emit("next")
    }

    function showCategoryHeader(){
        if(!showCategory.value)
        {
            showCategory.value = true
            useCookie("set", _getCookieName(), "revealed")
            emit("revealed")
        }
    }

    function _getCookieName(){
        return `${route.params.sessionID}_${props.category.Name}`
    }

    onMounted( () => {
        if(useCookie("get", _getCookieName()) == "revealed"){
            showCategoryHeader()
        }
    })

</script>

<style>
    .jeopardyColumn { display:flex; flex-direction: column; gap:10px; justify-content: center; align-items: center; }

    .jeopardyColumnHeader { color:#F5F5F5; font-size:25px; height:100px; background-color:#060CE9; display:flex; justify-content: center; align-items: center; }


</style>