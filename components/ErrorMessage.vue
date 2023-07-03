<template>
    <div class="rounded-borders error--wrapper" >{{props.error}}</div>
</template>
<style lang="scss">
.error--wrapper {
  border: 1px solid var(--q-negative);
  z-index: 1;
  position: relative;
  padding: 8px;
  color:var(--q-negative);
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.2;
    z-index: -1;
    background-color: var(--q-negative);
  }
}
</style>
<script setup>
    const props = defineProps({
        error: String,
    })
</script>