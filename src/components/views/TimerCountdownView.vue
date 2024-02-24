<template>
    <main>
        <div class="timerBlock flex-row flex-nowrap flex-justify-center pointer color-gold width-100">
           
            <div v-if="isCounting" class="flex-row flex-nowrap flex-justify-center flex-align-center" >
                <stopwatch-icon  :class="{'color-orange': isWarning, 'color-red': isAlert }" /> &nbsp;
                <span v-if="!isTimeUp" :class="{'color-orange': isWarning, 'color-red': isAlert }">{{ secondsRemaining }}</span>
                <span :class="{'alertColor': isAlert}" v-if="isTimeUp">TIME UP</span>
                &nbsp;
            </div>
            <span class="pointer flex-row flex-nowrap flex-justify-center flex-align-center" v-if="!isCounting" @click="startTimer" style="cursor:pointer;">
                <play-icon />&nbsp;
                <span>Start Timer</span>
            </span>
            
        </div>
    </main>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import PlayIcon from '@/components/icons/FontAwesome/PlayIcon.vue';
    import StopwatchIcon from '@/components/icons/FontAwesome/StopwatchIcon.vue';
    import Audio from '@/components/views/media/Audio.vue'

    const props = defineProps<{
        seconds:number,
        silentTimeUp?:boolean
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
        emit("started")
        isCounting.value = true
        timerCounter = setInterval( () => {
            secondsRemaining.value = secondsRemaining.value-1
            if(secondsRemaining.value <= 0){
                playTimeUpSound()
                stopTimer(false);
                emit("timeup")
            }
        }, 1000)
    }

    // Play time up sound
    function playTimeUpSound(){
        if(props.silentTimeUp){
            return
        }
        let audioEle = document.querySelector("#timeUpAudio") as HTMLAudioElement
        if (audioEle != undefined){
            audioEle.play()
        }
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