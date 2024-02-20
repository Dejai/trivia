<template>
    <main>
        <FormContainer :title="'Edit Question/Answer Pair'">
            <FormRow>
                <label for="">Value</label>
                <input type="number" name="qnaNumber" v-model="qnaValue">
            </FormRow>
            <FormRow>
                <label for="">Question</label>
                <input type="text" name="qnaQuestionText" v-model="question.Text">
            </FormRow>
            <FormRow>
                <label for="">Answer</label>
                <input type="number" name="qnaAnswerText" v-model="answer.Text">
            </FormRow>

            <FormActions>
                <div>
                    <button @click="saveQnAForm">SAVE</button>
                    &nbsp;
                    <button @click="cancelQnAForm">CANCEL</button> &nbsp;
                </div>
                <div v-if="!props.isNew && !props.category?.isFinalJeopardy()">
                    <button @click="removeQuestion">DELETE</button>
                </div>
            </FormActions>
        </FormContainer>

        <div id="questionAnswerPairContainer" class="hidden">
            <div>
                <h3>Value</h3>
                <div>
                    <label>Value</label> <br/>
                    <textarea v-model="qnaValue"></textarea>
                </div>
            </div>
            <div id="questionContainer">
                <h3>Question</h3>
                <div>
                    <label>Text</label> <br/>
                    <textarea ></textarea>
                </div>
                <div>
                    <label>Auido</label>
                    <button>Add Audio</button>
                </div>
                <div>
                    <label>Image</label>
                    <button>Add Image</button>
                </div>
                <div>
                    <label>URL</label>
                    <input type="text" placeholder="enter a URL" v-model="question.Url">
                </div>
            </div>
            <div id="answerContainer">
                <h3>Answer</h3>
                <div>
                    <label>Text</label> <br/>
                    <textarea v-model="answer.Text"></textarea>
                </div>
                <div>
                    <label>Auido</label>
                    <button>Add Audio</button>
                </div>
                <div>
                    <label>Image</label>
                    <button>Add Image</button>
                </div>
                <div>
                    <label>URL</label>
                    <input type="text" placeholder="enter a URL"  v-model="answer.Url">
                </div>
            </div>
        </div>
        <div>
            <div class="questionFormActions" style="width:50%; padding-top:5%;">
                    <div>
                           
                        <button @click="saveQnAForm">SAVE</button>
                        &nbsp;
                        <button @click="cancelQnAForm">CANCEL</button> &nbsp;
                    </div>
                    <div v-if="!props.isNew && !props.category?.isFinalJeopardy()">
                        <button @click="removeQuestion">DELETE</button>
                    </div>
                </div>
             
        </div>
    </main>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useGamesStore } from '@/stores/games'
    import { useFiltersStore } from '@/stores/filters'
    import type QuestionAnswerPair from '@/models/QuestionAnswerPair'
    import type Category from '@/models/Category'
    import Question from '@/models/Question'
    import Answer from '@/models/Answer'
    import FormContainer from '@/components/views/forms/FormContainer.vue'
    import FormRow from '@/components/views/forms/FormRow.vue'
    import FormActions from '@/components/views/forms/FormActions.vue'

    const props = defineProps<{
        questionAnswerPair:QuestionAnswerPair,
        isNew?:boolean,
        category?:Category
    }>()

    const gamesStore = useGamesStore()
    const filtersStore = useFiltersStore()

    const qnaValue = ref(props.questionAnswerPair?.Value ?? "")
    const question = ref(props.questionAnswerPair?.Question ?? new Question({}))
    const answer = ref(props.questionAnswerPair?.Answer ?? new Answer({}))

    // Save an edit form
    function saveQnAForm(){
        props.questionAnswerPair.Value = qnaValue.value
        if(props.isNew && props.category != undefined){
            props.category.addNewPair(props.questionAnswerPair)
        }
        filtersStore.clearFilter("qnaPair")
        filtersStore.clearFilter("category")
        filtersStore.clearFilter("qnaForm")
    }

    function removeQuestion(){
        let approved = confirm("Are you sure you want to delete this question? " + props.questionAnswerPair.Value)
        if(approved && props.category != undefined){
            props.category.removePair(props.questionAnswerPair.Value)
            cancelQnAForm()
        }
    }

    function cancelQnAForm(){
        filtersStore.clearFilter("qnaPair")
        filtersStore.clearFilter("category")
        filtersStore.clearFilter("qnaForm")
        filtersStore.clearFilter("categoryForm")
    }


</script>

<style scoped>
    #questionAnswerPairContainer { min-width:100%; display:flex; flex-wrap:wrap; justify-content:space-between; align-items: center; }
    .questionFormActions { display:flex; flex-wrap: wrap; justify-content:space-between; align-items: center; }
</style>