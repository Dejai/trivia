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