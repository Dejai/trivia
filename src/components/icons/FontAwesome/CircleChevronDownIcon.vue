<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faCircleChevronDown" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faCircleChevronDown } from '@fortawesome/free-solid-svg-icons/faCircleChevronDown'

    const props = defineProps<{
        label?:string
    }>()
</script>