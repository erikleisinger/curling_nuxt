<template>
<!-- <VitePwaManifest/> -->
    <NuxtPage />
    <NotificationHandler/>
</template>
<style lang="scss">
#__nuxt {
    height: inherit;
}
</style>
<script setup lang="ts">
import { PUBLIC_ROUTES } from "@/constants/routes";
import {useEventListener, useScreenOrientation} from '@vueuse/core'

const setVh = () => {
const vh = window.innerHeight * 0.01;
 document.documentElement.style.setProperty('--vh', `${vh}px`);
}

onMounted(async () => {
 setVh();
 useEventListener(window, 'resize', setVh)
})

onBeforeMount(async () => {

    const route = useRoute();
        console.log('before mount: ', route)
    const user = useSupabaseUser();
    if (!PUBLIC_ROUTES.includes(route.fullPath) && user.value && route.name !== 'gateway')   
     navigateTo(`/gateway?redirect=${route.fullPath}`)
});

const client = useSupabaseAuthClient();
client.auth.onAuthStateChange((_, _session) => {
    if (_session?.access_token) {
        const accessToken = useCookie("sb-access-token");
        const refreshToken = useCookie("sb-refresh-token");
        accessToken.value = _session?.access_token ?? null;
        refreshToken.value = _session?.refresh_token ?? null;
    }
});
</script>
