<template>
    <main class="headerButton">
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

<style scoped>
    .headerButton{ display: flex; gap: 8px; align-items: center; justify-content: left; cursor:pointer; }
    /* .headerButton { display:flex; flex-wrap: wrap; justify-content: left; align-items: center; gap:10px; cursor:pointer; } */
</style>