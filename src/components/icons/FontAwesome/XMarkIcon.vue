<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faXmark" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'

    const props = defineProps<{
        label?:string
    }>()
</script>