<script>
export async function configureApp(app) {
  //
}
</script>
<style lang="scss">
    @import "../styles/variables.scss";
     @import "../styles/global.scss";
</style>
<script setup>
const { component } = defineProps({
  component: Object,
});
</script>

<template>
  <component :is="component" />
</template>
