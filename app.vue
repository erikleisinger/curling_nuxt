<template>
    <NuxtPage/>
</template>
<style lang="scss">
    #__nuxt {
height:inherit;
  }
</style>
<script setup lang="ts">
import {useSessionStore} from "@/store/session";
import {useAuthStore} from "@/store/auth";

const sessionStore = useSessionStore();
const authStore = useAuthStore();
const loading = ref(true);
onBeforeMount(async () => {
  const user = useSupabaseUser();
  authStore.setLoggedIn(!!user?.value);
});
const isLoggedIn = computed<boolean>(() => authStore.isLoggedIn);
const {initData, resetData, progress} = useData();

const handleLoggedInState = async (isLoggedIn: boolean) => {
  loading.value = true;
  if (isLoggedIn) {
     await initData();
    //  navigateTo("/");
  } else {
    // await navigateTo("/login");
    await resetData();
  
  }
    loading.value = false;
};

watch(isLoggedIn, async (val) => {
  handleLoggedInState(val);
}, {immediate: true});
</script>
