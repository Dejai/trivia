<template>
    <tr class="questionRow rowSection pointer" :class="{'isFirstRow': isFirstRow, 'isLastRow':isLastRow, 'justModified':justModified }">
        <td class="questionValue clickToEdit">
            <span style="color:limegreen" v-if="props.questionAnswerPair.isDailyDouble() && !showEditQna">*</span>
            <input class="qnaFormField" type="number" v-model="qnaValue" :disabled="!showEditQna"/>
            <input type="checkbox" name="dailyDouble" v-if="showEditQna" @change="onToggleDailyDouble($event)" :checked="props.questionAnswerPair.isDailyDouble()">
        </td>
        <td class="questionText clickToEdit">
            <div class="qnaContentManagement">
                <image-icon v-if="questionHasImage && !showEditQna" style="color:gold;" title="This question has an image" @click="onPreviewQuestion"/>
                <volume-icon v-if="questionHasAudio && !showEditQna" title="This question has audio" @click="onPreviewQuestion"/>
                <textarea class="qnaFormField" type="text" v-model="props.questionAnswerPair.Question.Text" :disabled="!showEditQna"></textarea>
                <br/>
            </div>
            <div class="mediaSection" v-if="showEditQna">
                <div>
                    <label>Image:</label> &nbsp;
                    <select v-model="props.questionAnswerPair.Question.ImageRef">
                        <option value="">&nbsp;</option>
                        <option v-for="image in images" :value="image.FileName">{{ image.Name }}</option>
                    </select>
                </div>
                <div>
                    <label>Audio:</label> &nbsp;
                    <select v-model="props.questionAnswerPair.Question.AudioRef">
                        <option value="">&nbsp;</option>
                        <option v-for="audio in audios" :value="audio.FileName">{{ audio.Name }}</option>
                    </select>
                </div>
            </div>
        </td>
        <td class="answerText clickToEdit">
            <div class="qnaContentManagement">
                <image-icon v-if="answerHasImage" style="color:gold;" title="This answer has an image" @click="onPreviewQuestion"/>
                <volume-icon v-if="answerHasAudio" title="This answer has audio" @click="onPreviewQuestion"/>
                <textarea class="qnaFormField" type="text" v-model="props.questionAnswerPair.Answer.Text" :disabled="!showEditQna"></textarea>
            </div>
            <div class="mediaSection" v-if="showEditQna">
                <div>
                    <label>Image:</label> &nbsp;
                    <select v-model="props.questionAnswerPair.Answer.ImageRef">
                        <option value="">&nbsp;</option>
                        <option v-for="image in images" :value="image.FileName">{{ image.Name }}</option>
                    </select>
                </div>
                <div>
                    <label>Audio:</label> &nbsp;
                    <select v-model="props.questionAnswerPair.Answer.AudioRef">
                        <option value="">&nbsp;</option>
                        <option v-for="audio in audios" :value="audio.FileName">{{ audio.Name }}</option>
                    </select>
                </div>
            </div>
        </td>
        <td style="cursor:pointer;">
            <div class="qnaActionSection pointer">
                <div v-if="!showEditQna">
                    <pencil-icon :label="'edit'" @click="onEditQna" :class="'pointer'"/>
                    &nbsp;
                    <up-right-from-square :label="'Preview'" @click="onPreviewQuestion"/>
                </div>
                <div class="qnaEditSubsection" :class="{'editingQnA': showEditIcons}">
                    <div style="width:100%;" @click="onSaveQnA">
                        <floppy-disk-icon :label="'save'" />
                    </div>
                    <div style="width:100%;" @click="onCancelQnAEdit" >
                        <x-mark-icon :label="'cancel'" />
                    </div>
                    <div style="width:100%;" @click="onDeleteQnA" v-if="!isFinalJeopardy && !$props.questionAnswerPair.isNew()">
                        <trash-can-icon :label="'delete'" />
                    </div>
                </div>
                <div v-if="isDeleting">
                    <p>Are you sure?</p>
                    <button @click="onYesDeleteQnA">YES, DELETE</button>
                    &nbsp;
                    <button @click="onCancelDeleteQnA">CANCEL</button>
                </div>
            </div>
        </td>
        <td v-if="isCustomOrder">
            <div style="text-align:center;">
                <arrow-up-icon class="orderIcon upIcon pointer" @click="onMoveQuestionUp"/> 
                <arrow-down-icon class="orderIcon downIcon pointer" @click="onMoveQuestionDown" />
            </div>
        </td>
    </tr>
    <!-- Jeopardy Preview Form -->
    <tr v-if="showPreview" >
        <JeopardyCell v-if="!isFinalJeopardy"
            :pair="qnaPair"
            :category-name="props.category?.Name"
            :is-preview="true"
            @next="onHidePreview"
            />
        <FinalJeopardyCell v-if="isFinalJeopardy"
            :pair="qnaPair"
            :category-name="props.category?.Name"
            :is-preview="true"
            @next="onHidePreview"
            />
    </tr>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useGamesStore } from '@/stores/games'
    import QuestionAnswerPair from '@/models/QuestionAnswerPair'
    import type Category from '@/models/Category'
    import type Media from '@/models/Media'
    import JeopardyCell from '@/components/views/jeopardy/JeopardyCell.vue'
    import FinalJeopardyCell from '@/components/views/jeopardy/FinalJeopardyCell.vue'
    import FloppyDiskIcon from '@/components/icons/FontAwesome/FloppyDiskIcon.vue'
    import PencilIcon from '@/components/icons/FontAwesome/PencilIcon.vue'
    import XMarkIcon from '@/components/icons/FontAwesome/XMarkIcon.vue'
    import TrashCanIcon from '@/components/icons/FontAwesome/TrashCanIcon.vue'
    import ImageIcon from '@/components/icons/FontAwesome/ImageIcon.vue'
    import VolumeIcon from '@/components/icons/FontAwesome/VolumeIcon.vue'
    import UpRightFromSquare from '@/components/icons/FontAwesome/UpRightFromSquareIcon.vue'
    import ArrowDownIcon from '@/components/icons/FontAwesome/ArrowDownIcon.vue'
    import ArrowUpIcon from '@/components/icons/FontAwesome/ArrowUpIcon.vue'
    import appConfig from '@/assets/config/app.json'
    import { useMediaStore } from '@/stores/media'

    const props = defineProps<{
        category:Category,
        questionAnswerPair:QuestionAnswerPair,
        index?:number,
        count?:number
    }>()
    const mediaStore = useMediaStore();
    const gamesStore = useGamesStore()
    const { media } = storeToRefs(mediaStore)
    const images = computed( () => media.value.filter( (x:Media) => x.Type == "Image" ) )
    const audios = computed( () => media.value.filter( (x:Media) => x.Type == "Audio" ) )

    const qnaValue = ref(props.questionAnswerPair.Value)
    const qnaPair = ref(props.questionAnswerPair)
    const isFinalJeopardy = props.category.isFinalJeopardy()

    const justModified = ref(false)

    // Keep track of category values (before edited)
    const qnaCopy = ref(new QuestionAnswerPair({}, 0))
    const showPreview = ref(false)
    const showEditQna = ref(props.questionAnswerPair.isNew() ?? false)
    const isDeleting = ref(false)

    // Confirm if the question or answer has media
    const questionHasImage = computed( () => props.questionAnswerPair.Question.ImageRef != "")
    const questionHasAudio = computed( () => props.questionAnswerPair.Question.AudioRef != "")
    const answerHasImage = computed( () => props.questionAnswerPair.Answer.ImageRef != "")
    const answerHasAudio = computed( () => props.questionAnswerPair.Answer.AudioRef != "")

    const showEditIcons = computed( () => showEditQna.value && !isDeleting.value )
    const isCustomOrder  = computed( () => props.category?.SortBy == "Custom Order")
    const isFirstRow = computed( () => props.index == 0)
    const isLastRow = computed( () => props.index == props.count)

    function onToggleDailyDouble(event:any){
        let target = event.target;
        if(target.checked){
            props.questionAnswerPair.addTag(appConfig.Tags.DailyDouble)
        } else { 
            props.questionAnswerPair.removeTag(appConfig.Tags.DailyDouble)
        }
    }

    function onEditQna(){
        showEditQna.value = true
        qnaCopy.value = new QuestionAnswerPair(props.questionAnswerPair, props.questionAnswerPair.Order)
    }

    function onSaveQnA(){
        showEditQna.value = false
        props.questionAnswerPair.Value = qnaValue.value
        props.questionAnswerPair.removeTag(appConfig.Tags.NewQuestion)
        gamesStore.setGameSaveNeeded()
    }

    function onCancelQnAEdit(){
        if(props.questionAnswerPair.isNew()){
            onYesDeleteQnA()         
        } else { 
            props.questionAnswerPair.Question.Text = qnaCopy.value.Question.Text
            props.questionAnswerPair.Answer.Text = qnaCopy.value.Answer.Text
            props.questionAnswerPair.Value = qnaCopy.value.Value
            showEditQna.value = false
        }
    }

    function onDeleteQnA(){
        isDeleting.value = true
    }

    function onYesDeleteQnA(){
        props.category.removePair(props.questionAnswerPair.Value)
        showEditQna.value = false
    }

    function onCancelDeleteQnA(){
        isDeleting.value = false
    }

    // Clear a row that was just modified
    function _clearJustModified(){
        setTimeout( () => {
            justModified.value = false
        }, 1000)
    }

    // Swap this question's order in the list
    function onMoveQuestionUp(){
        if(isFirstRow.value){ return }
        onSwapQuestionOrder("up")
    }

    function onMoveQuestionDown(){
        if(isLastRow.value){ return }
        onSwapQuestionOrder("down")
    }

    function onSwapQuestionOrder(direction:string){
        let currOrder = props.questionAnswerPair.Order
        let newOrder = direction == "up" ? currOrder-1 : currOrder+1
        props.category.updateQuestionOrder(currOrder, newOrder) // moves this question
        justModified.value = true
        _clearJustModified()

    }

    function onPreviewQuestion(){
        showPreview.value = true
    }

    function onHidePreview(){
        showPreview.value = false
    }
</script>

<style scoped>

    .questionRow td { vertical-align: top; }

    span.orderIcon { margin-right:7%; color:white;}
   .isFirstRow span.upIcon { color:gray; }
   .isLastRow span.downIcon { color:gray; }

   .questionRow td { padding: 0.5% 0%; }
   .previwLink { color:lightblue; }

    textarea.qnaFormField { resize: none; }
    .qnaFormField { font-size: inherit; width:90%; }
    .qnaFormField[disabled] { color:inherit; background-color: transparent; border:none;}


    .qnaEditSubsection { width:0px; opacity:0; overflow:hidden; height:0px; }
    .qnaEditSubsection.editingQnA { transition: width,opacity ease 1s; width:55%; opacity:100; height:inherit;  display:flex; align-items: center; gap:20px; }

   .questionRow:hover .nohover { background-color: var(--color-background) !important; }

   .justModified td { border-top: 1px dashed white; border-bottom: 1px dashed white; }

   .qnaContentManagement { display:flex; justify-content: left; align-items: start; width:100%; gap:5px; }

   /* .mediaSection { display:flex; flex-wrap: wrap; justify-content: left; align-items: center; gap: 20px; } */

</style>