<template>
    <main>
        <div class="timerBlock" style="color:gold;">
            <div v-if="isCounting">
                <stopwatch-icon  :class="{'warningColor': isWarning, 'alertColor': isAlert }" /> &nbsp;
                <span v-if="!isTimeUp" :class="{'warningColor': isWarning, 'alertColor': isAlert }">{{ secondsRemaining }}</span>
                <span :class="{'alertColor': isAlert}" v-if="isTimeUp">TIME UP</span>
                &nbsp;
            </div>
            <span v-if="!isCounting" @click="startTimer" style="cursor:pointer;">
                <play-icon />&nbsp;
                <span>Start Timer</span>
            </span>
        </div>
    </main>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import PlayIcon from '../icons/FontAwesome/PlayIcon.vue';
    import StopwatchIcon from '../icons/FontAwesome/StopwatchIcon.vue';

    const props = defineProps<{
        seconds:number
    }>()
    const emit = defineEmits(["started", "timeup"])

    const isCounting = ref(false)
    const secondsRemaining = ref(props.seconds)
    let timerCounter:any = undefined;
    const isWarning = computed( () => secondsRemaining.value <= 5 && secondsRemaining.value > 3)
    const isAlert = computed( () => secondsRemaining.value <= 3 )
    const isTimeUp = computed( () => secondsRemaining.value <= 0)

    // Start counting down
    function startTimer(){
        console.log("Starting timer")
        emit("started")
        isCounting.value = true
        timerCounter = setInterval( () => {
            secondsRemaining.value = secondsRemaining.value-1
            if(secondsRemaining.value <= 0){
                stopTimer(false);
                emit("timeup")
            }
        }, 1000)
    }

    // Stop the timer
    function stopTimer(withReset:boolean=true){
        clearInterval(timerCounter)
        if(withReset){
            resetTimer();
        }
    }

    // Reset timer
    function resetTimer(){
        secondsRemaining.value = props.seconds
    }
</script>

<style scoped>
    .warningColor { color:orange !important; }
    .alertColor { color: red !important; }
</style>