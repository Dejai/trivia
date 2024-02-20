<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faUpRightFromSquare" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons/faUpRightFromSquare'

    const props = defineProps<{
        label?:string
    }>()
</script>