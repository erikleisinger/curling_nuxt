<template>
  <NuxtLayout>
  <NuxtPage/>
  </NuxtLayout>
</template>
<script setup>
import {useDataStore} from '@/store/data'
 screen.orientation.lock('portrait-primary')
onMounted(() => {
  const user = useSupabaseUser();
  if (user) {
 
    const {initData} = useDataStore();
    initData();
  }
})
</script>