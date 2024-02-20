<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faVolumeHigh" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons/faVolumeHigh'

    const props = defineProps<{
        label?:string
    }>()
</script>