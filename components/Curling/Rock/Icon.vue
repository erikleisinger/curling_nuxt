<template>
<div>
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  color: String,
});
</script>
