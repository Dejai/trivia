<template>
    <p class="iconContainer">
        <font-awesome-icon :icon="faFloppyDisk" />
        <label class="iconLabel">{{ props.label ?? "" }}</label>
    </p>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons/faFloppyDisk'

    const props = defineProps<{
        label?:string
    }>()

</script>