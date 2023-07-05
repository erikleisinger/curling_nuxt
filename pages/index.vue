<template>
    <GameController/>
</template>
<style lang="scss">
body,
html {
  height: 100%;
  width: 100%;
  margin: 0;
}
#__nuxt {
  height: inherit;
}
</style>
<script setup>
definePageMeta({
  middleware: "game",
  layout: 'main',
});
</script>
