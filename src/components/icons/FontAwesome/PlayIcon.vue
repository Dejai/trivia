<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faPlay" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay'

    const props = defineProps<{
        label?:string
    }>()
</script>