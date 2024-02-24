<template>
    <tr class="questionRow rowSection pointer" :class="{'isFirstRow': isFirstRow, 'isLastRow':isLastRow, 'justModified':justModified }">
        <td class="questionValue clickToEdit">
            <span class="color-green" v-if="props.questionAnswerPair.isDailyDouble() && !showEditQna">*</span>
            <input class="qnaFormField" type="number" v-model="qnaValue" :disabled="!showEditQna"/>
            <input type="checkbox" name="dailyDouble" v-if="showEditQna" @change="onToggleDailyDouble($event)" :checked="props.questionAnswerPair.isDailyDouble()">
        </td>
        <td class="questionText clickToEdit">
            <div class="qnaContentManagement">
                <image-icon v-if="questionHasImage && !showEditQna" class="color-gold" title="This question has an image" @click="onPreviewQuestion"/>
                <volume-icon v-if="questionHasAudio && !showEditQna" class="color-gold" title="This question has audio" @click="onPreviewQuestion"/>
                <textarea class="qnaFormField" type="text" v-model="props.questionAnswerPair.Question.Text" :disabled="!showEditQna"></textarea>
            </div>
            <div>
                <input class="qnaFormField italic" type="text" placeholder="Subtext (shown below text in italics)" v-model="props.questionAnswerPair.Question.SubText" v-if="showQuestionSubText" :disabled="!showEditQna" />
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
                <image-icon v-if="answerHasImage && !showEditQna" class="color-gold" title="This answer has an image" @click="onPreviewQuestion"/>
                <volume-icon v-if="answerHasAudio && !showEditQna" class="color-gold" title="This answer has audio" @click="onPreviewQuestion"/>
                <textarea class="qnaFormField" type="text" v-model="props.questionAnswerPair.Answer.Text" :disabled="!showEditQna"></textarea>
            </div>
            <div>
                <input class="qnaFormField italic" type="text" placeholder="Subtext (shown below text in italics)" v-model="props.questionAnswerPair.Answer.SubText" v-if="showAnswerSubText" :disabled="!showEditQna" />
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
        <td class="pointer">
            <div class="qnaActionSection pointer flex-row flex-justify-space-between flex-gap-30">
                <div class="flex-row flex-gap-30" v-if="!showEditQna">
                    <IconButton class="color-blue editQnAIcon" @click="onEditQna">
                        <template #icon>
                            <pencil-icon/>
                        </template>
                        <template #content>
                            edit
                        </template>
                    </IconButton>
                    <IconButton class="color-white" @click="onPreviewQuestion">
                        <template #icon>
                            <up-right-from-square/>
                        </template>
                        <template #content>
                            preview
                        </template>
                    </IconButton>
                </div>
                <div v-if="isDeleting">
                    <p>Are you sure?</p>
                    <button class="button-round bg-color-red color-white" @click="onYesDeleteQnA">YES, DELETE</button>
                    &nbsp;
                    <button class="button-round bg-color-white color-black" @click="onCancelDeleteQnA">CANCEL</button>
                </div>
                <div class="qnaEditSubsection flex-row flex-justify-left flex-align-center flex-gap-20" :class="{'editingQnA': showEditIcons}">
                    
                    <div>
                        <IconButton class="color-green saveQnAIcon" @click="onSaveQnA">
                            <template #icon>
                                <floppy-disk-icon />
                            </template>
                            <template #content>
                                save
                            </template>
                        </IconButton>
                    </div>
                    <div>
                        <IconButton class="color-orange" @click="onCancelQnAEdit">
                            <template #icon>
                                <x-mark-icon/>
                            </template>
                            <template #content>
                                cancel
                            </template>
                        </IconButton>
                    </div>
                    <div v-if="!isFinalJeopardy && !$props.questionAnswerPair.isNew()">
                        <IconButton class="color-red" @click="onDeleteQnA">
                            <template #icon>
                                <trash-can-icon />
                            </template>
                            <template #content>
                                delete
                            </template>
                        </IconButton>
                    </div>
                </div>
                
            </div>
        </td>
        <td v-if="isCustomOrder" class="qnaOrderIcons">
            <div class="flex-row flex-justify-center flex-align-center flex-gap-10 width-100">
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
    import { useMediaStore } from '@/stores/media'
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
    import IconButton from '@/components/views/IconButton.vue'


    const props = defineProps<{
        category:Category,
        questionAnswerPair:QuestionAnswerPair,
        index:number,
        count:number
    }>()
    const emits = defineEmits(["editing", "saved"])

    // STORES
    const mediaStore = useMediaStore();
    const gamesStore = useGamesStore()
    const { media } = storeToRefs(mediaStore)

    // REFS
    const qnaValue = ref(props.questionAnswerPair.Value)
    const qnaPair = ref(props.questionAnswerPair)
    const isFinalJeopardy = props.category.isFinalJeopardy()
    const justModified = ref(false)
    const qnaCopy = ref(new QuestionAnswerPair({}, 0))
    const showPreview = ref(false)
    const showEditQna = ref(props.questionAnswerPair.isNew() ?? false)
    const isDeleting = ref(false)

    // COMPUTED
    const images = computed( () => media.value.filter( (x:Media) => x.Type == "Image" ) )
    const audios = computed( () => media.value.filter( (x:Media) => x.Type == "Audio" ) )
    const questionHasImage = computed( () => props.questionAnswerPair.Question.ImageRef != "")
    const questionHasAudio = computed( () => props.questionAnswerPair.Question.AudioRef != "")
    const answerHasImage = computed( () => props.questionAnswerPair.Answer.ImageRef != "")
    const answerHasAudio = computed( () => props.questionAnswerPair.Answer.AudioRef != "")
    const showEditIcons = computed( () => showEditQna.value && !isDeleting.value )
    const isCustomOrder  = computed( () => props.category?.SortBy == "Custom Order")
    const isFirstRow = computed( () => props.index == 0)
    const isLastRow = computed( () => props.index == (props.count-1) )
    const showQuestionSubText = computed( () => props.questionAnswerPair.Question.SubText != "" || showEditQna.value )
    const showAnswerSubText = computed( () => props.questionAnswerPair.Answer.SubText != "" || showEditQna.value )

    // FUNCTIONS
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
        emits("editing")
    }

    function onSaveQnA(){
        showEditQna.value = false
        props.questionAnswerPair.Value = qnaValue.value
        props.questionAnswerPair.removeTag(appConfig.Tags.NewQuestion)
        gamesStore.setGameSaveNeeded()
        emits("saved")
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
    
    .qnaOrderIcons .orderIcon { margin-right:7%; color:white;}
   .isFirstRow .qnaOrderIcons .upIcon { color:gray; }
   .isLastRow .qnaOrderIcons .downIcon { color:gray; }

   .questionRow td { padding: 0.5% 0%; }
   .previwLink { color:lightblue; }

    textarea.qnaFormField { resize: none; }
    .qnaFormField { font-size: inherit; width:90%; }
    .qnaFormField[disabled] { color:inherit; background-color: transparent; border:none;}


    .qnaEditSubsection { width:0px; opacity:0; overflow:hidden; height:0px; }
    .qnaEditSubsection.editingQnA { transition: width,opacity ease 1s; width:65%; opacity:100; height:inherit; }

   .questionRow:hover .nohover { background-color: var(--color-background) !important; }

   .justModified td { border-top: 1px dashed white; border-bottom: 1px dashed white; }

   .qnaContentManagement { display:flex; justify-content: left; align-items: start; width:100%; gap:5px; }

</style>