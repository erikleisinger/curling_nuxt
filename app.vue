<template>
  <NuxtLayout>
    <global-loading v-if="loading" :value="progress"/>
  <NuxtPage v-else/>
  </NuxtLayout>
</template>
<script setup lang="ts">
import {useSessionStore} from '@/store/session'
import {useAuthStore} from '@/store/auth'
 screen.orientation.lock('portrait-primary')

const sessionStore = useSessionStore();
const authStore = useAuthStore()
const loading = ref(true)
onBeforeMount(() => {
  console.log('BEFORE MOUNT')
  const user = useSupabaseUser();
  authStore.setLoggedIn(!!user?.value)
})
const isLoggedIn = computed<boolean>(() => authStore.isLoggedIn)
    const {initData, resetData, progress} = useData();
onMounted(async () => {
 if (isLoggedIn.value) {
  await initData()
  if(sessionStore.game?.id) {
    await sessionStore.initGame()
  } else {
    navigateTo('/select')
  }

  } else {
    console.log('RESETTING DATA')
   await resetData();

  }
  console.log('AFTER MOUNT')
  loading.value = false;

})

</script>