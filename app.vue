<template>
    <NuxtPage  />
</template>
<style lang="scss">
#__nuxt {
    height: inherit;
}
</style>
<script setup lang="ts">
import {useUserStore } from '@/store/user'
import {PUBLIC_ROUTES} from '@/constants/routes'
onBeforeMount(async () => {
    const route = useRoute();
    if (PUBLIC_ROUTES.includes(route.fullPath)) return;
    const store = useUserStore();
    await store.getCurrentUser();
})
const client = useSupabaseAuthClient();
client.auth.onAuthStateChange((_, _session) => {
      if(_session?.access_token) {
        const accessToken = useCookie('sb-access-token')
        const refreshToken = useCookie('sb-refresh-token')
        accessToken.value = _session?.access_token ?? null
        refreshToken.value = _session?.refresh_token ?? null
      }
    })
</script>
