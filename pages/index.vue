<template>
<NuxtLayout name="main">
    <GameController/>
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

const store = useGameStore();


const editedShot = ref({});
provide('editedShot', editedShot);


onMounted(() => {
  store.getShot();
})

const shot = computed(() => store.currentShot)

watch(shot, (val) => {
  editedShot.value = {...val}
}, {deep: true, immediate: true})
</script>
