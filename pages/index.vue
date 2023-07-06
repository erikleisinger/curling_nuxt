<template>
<NuxtLayout name="main">
    <GameController/>
    <q-inner-loading :showing="loading"/>
    <template v-slot:footer>
      <GameNavigation/>
    </template>
</NuxtLayout>
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
import {computed, onMounted, provide, ref, watch} from "vue";
import {useGameStore} from '@/store/game'
definePageMeta({
  middleware: "game",
});

// Global loading
const store = useGameStore();
const loading = computed(() => store.loading)


/* Edited Shot */

//  Edited shot provided to all children
//  GameNavigation, InputScore, RockController

const editedShot = ref({});
provide('editedShot', editedShot);

onMounted(() => {
  store.getShot();
})
const shot = computed(() => store.currentShot)
watch(shot, (val) => {
  editedShot.value = {...val}
}, {deep: true, immediate: true})

/* End edited shot */


</script>
