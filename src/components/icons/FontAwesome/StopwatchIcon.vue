<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faStopwatch" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faStopwatch } from '@fortawesome/free-solid-svg-icons/faStopwatch'

    const props = defineProps<{
        label?:string
    }>()
</script>