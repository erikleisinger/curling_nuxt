<template>
  <NuxtLayout>
  <NuxtPage/>
  </NuxtLayout>
</template>
<script setup>
import {useDataStore} from '@/store/data'
import {useGameStore} from '@/store/game'
 screen.orientation.lock('portrait-primary')
onMounted(() => {
  const user = useSupabaseUser();
  if (user) {
 
    const {initData} = useDataStore();
    initData();
  }
})
const gameStore = useGameStore();
const currentGameId = computed(() => gameStore.game?.id);

watch(currentGameId, () => {
  gameStore.initGame();
})
</script>