<template>
  <NuxtLayout>
  <NuxtPage/>
  </NuxtLayout>
</template>
<script setup lang="ts">
import {useDataStore} from '@/store/data'
import {useGameStore} from '@/store/game'
import {useAuthStore} from '@/store/auth'
 screen.orientation.lock('portrait-primary')

const gameStore = useGameStore();
const authStore = useAuthStore()
onBeforeMount(() => {
  const user = useSupabaseUser();
  authStore.setLoggedIn(!!user?.value)
})

const isLoggedIn = computed<boolean>(() => authStore.isLoggedIn)
watch(isLoggedIn, (val) => {
  if (val) {
  useDataStore().initData();
  } else {
gameStore.resetStore();
  }

}, {immediate: true})

const currentGameId = computed<number | null>(() => gameStore.game?.id);
watch(currentGameId, () => {
  gameStore.initGame();
})
</script>