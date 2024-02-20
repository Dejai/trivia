<template>
    <main :class="{'imagePreview': props.isPreview }">
        <h3 v-if="props.label" style="padding:5% 0% 1% 0%;"> {{ props.label }}</h3>
        <img :src="props.url" alt="img" :class="{'isPreview': props.isPreview, 'isJeopardy': props.isJeopardy }"/>
    </main>
</template>

<script setup lang="ts">
    import { computed } from 'vue';

    const props = defineProps<{
        url:string,
        label?:string
        isPreview?:boolean
        isJeopardy?:boolean
        scale?:string
    }>()

    const imageWidth = computed( () => props.scale ?? "initial" )

</script>

<style scoped>
    .imagePreview { max-width: 22%; }
    .isJeopardy { max-width:95%; max-height:500px;  transition: all ease 1.2s;  }
    .isJeopardy:hover{ transform: scale(1.5); cursor:pointer;}
    .isPreview { width: 100%;  border: 1px solid white; }
    

</style>