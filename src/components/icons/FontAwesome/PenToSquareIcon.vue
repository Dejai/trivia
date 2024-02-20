<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faPenToSquare" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faPenToSquare } from '@fortawesome/free-solid-svg-icons/faPenToSquare'

    const props = defineProps<{
        label?:string
    }>()
</script>