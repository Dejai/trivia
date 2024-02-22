<template>
    <main class="flex-row flex-gap-5 flex-align-center flex-justify-left pointer">
        <slot name="icon">
            <plus-icon />
        </slot>
        <slot name="content">
            <span>ADD</span>
        </slot>
    </main>
</template>

<script setup lang="ts">
    import PlusIcon from '@/components/icons/FontAwesome/PlusIcon.vue'
</script>