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
          {value: 0, slot:'in'},
          { value: 1, slot:'out'},
        ]"
      >
       <template v-slot:in>
        <div class="row no-wrap">
          <q-icon name="rotate_right"/>IN
        </div>
        </template>
         <template v-slot:out>
             <div class="row no-wrap">
                <q-icon name="rotate_left"/>OUT
                      </div>
        </template>
        </q-btn-toggle>
</template>
<style lang="scss">
    .line__select {
        border:1px solid $blue-7;
    }
</style>
<script setup>
    const model = ref(0);
</script>