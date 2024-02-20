<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faSpinner" class="dtk-spinning dtk-spinning-1500" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'

    const props = defineProps<{
        label?:string
    }>()
</script>