<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faRotate" class="dtk-spinning" :class="{'dtk-spinning-1000': props.spinning}" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faRotate } from '@fortawesome/free-solid-svg-icons/faRotate'

    const props = defineProps<{
        label?:string,
        spinning?:boolean
    }>()
</script>