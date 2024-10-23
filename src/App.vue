<template>
	<MenuView />
	<router-view></router-view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { storeToRefs } from "pinia";
	import MenuView from "@views/MenuView.vue";
</script>

<style scoped></style>
