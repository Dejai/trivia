<template>
    <div class="formContainerRow">
        <slot></slot>
    </div>
</template>

<style scoped>
    .formContainerRow { display:flex; flex-wrap: wrap; gap:10px; justify-content: left; align-items: center;  }
    .formContainerRow label { width:15%; }
</style>