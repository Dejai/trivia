<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faPencil" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'

    const props = defineProps<{
        label?:string
    }>()
</script>