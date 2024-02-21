<template>
    <div class="flex-wrap flex-gap-10" :class="{'flex-column': props.stacked, 'flex-row': !props.stacked}">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        stacked?:boolean
    }>()
</script>

<style scoped>
    .formContainerRow { display:flex; flex-wrap: wrap; gap:10px; justify-content: left; align-items: center;  }
    .formContainerRow label { min-width:15%; }
</style>