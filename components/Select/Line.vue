<template>
<q-btn-toggle
        v-model="model"
        spread
        class="my-custom-toggle line__select"
        no-caps
        rounded
        unelevated
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="[
          {label: 'Inside', value: 0},
          {label: 'On broom', value: 1},
           {label: 'Outside', value: 2}
        ]"
      ></q-btn-toggle>
</template>
<style lang="scss">
    .line__select {
        border:1px solid $blue-7;
    }
</style>
<script setup>
    const model = ref(0);
</script>