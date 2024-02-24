<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faCircleChevronRight" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons/faCircleChevronRight'

    const props = defineProps<{
        label?:string
    }>()
</script>