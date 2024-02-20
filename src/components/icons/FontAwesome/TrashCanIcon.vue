<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faTrashCan" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan'

    const props = defineProps<{
        label?:string
    }>()
</script>