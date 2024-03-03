<template>
<div style="position: relative">
    <slot />
    <span
        class="text-caption"
       
        v-if="isPercent"
        >%</span
    >
</div>
</template>
<script setup>
const props = defineProps({
    isPercent: Boolean,
});
</script>
