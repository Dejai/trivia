<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faImage" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faImage } from '@fortawesome/free-solid-svg-icons/faImage'

    const props = defineProps<{
        label?:string
    }>()
</script>