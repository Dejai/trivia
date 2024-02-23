<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faMagnifyingGlass" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass'

    const props = defineProps<{
        label?:string
    }>()
</script>