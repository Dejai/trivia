<template>
    <div class="whoGotItRight" :class="{'isRightAnswerBlock': isRightAnswer}" @click="toggleRightAnswer">
        <p style="font-style:italic; font-size:smaller;">{{ props.team.Name }}</p>
        <div>
            {{ props.team.Answer }}
        </div>
    </div>
</template>
<script setup lang="ts">
    import { ref, computed } from 'vue'
    import Team from '@/models/Team'

    const props = defineProps<{
        type?:string,
        team:Team,
        scoreValue:number,
        isFinalQuestion?:boolean
    }>()
    const emit = defineEmits(["add", "subtract"])

    const isRightAnswer = ref(false)
    const isFinalQ = ref(props.isFinalQuestion ?? false)

    function toggleRightAnswer(){
        isRightAnswer.value = !isRightAnswer.value
        if(isRightAnswer.value){
            props.team.updateScore(props.scoreValue)
            if(isFinalQ){ props.team.setFinalAnswerPass(true) }
            emit("add")
        } else {
            props.team.updateScore(-(props.scoreValue))
            if(isFinalQ){ props.team.setFinalAnswerPass(false) }
            emit("subtract")
        }
    }
</script>

<style>
    .whoGotItRight { display:flex; justify-content:left; align-items: center; flex-direction: column; border:2px solid gray; border-radius: 55px; width:90%; transition: transform ease 0.6s; padding:3% 0%; margin:auto; margin-bottom:3%; }
    .whoGotItRight:hover{ cursor:pointer; transform: scale(1.05); }
    .answerIdentifier { color:gray;}
    .answerIdentifier.isRightAnswer { color:limegreen !important; }
    .isRightAnswerBlock { background-color: limegreen !important; color:black; }
</style>