<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faCircleUser" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faCircleUser } from '@fortawesome/free-solid-svg-icons/faCircleUser'

    const props = defineProps<{
        label?:string
    }>()
</script>