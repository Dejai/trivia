<template>
    <div class="formMain">
        <h3>{{ title }}</h3>
        <div class="formContainer">
            <slot></slot>
        </div>
    </div>
    
</template>

<script setup lang="ts">
    const props = defineProps<{
        title?:string
    }>()
</script>

<style scoped>
    .formMain { width:100%; }
    .formContainer { display:flex; flex-direction: column; gap:10px; padding-left:2%; margin-bottom:3%; }
</style>