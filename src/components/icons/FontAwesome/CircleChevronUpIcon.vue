<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faCircleChevronUp" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faCircleChevronUp } from '@fortawesome/free-solid-svg-icons/faCircleChevronUp'

    const props = defineProps<{
        label?:string
    }>()
</script>