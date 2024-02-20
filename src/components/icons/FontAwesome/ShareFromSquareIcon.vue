<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faShareFromSquare" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faShareFromSquare } from '@fortawesome/free-solid-svg-icons/faShareFromSquare'

    const props = defineProps<{
        label?:string
    }>()
</script>