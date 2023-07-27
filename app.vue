<template>
    <NuxtPage />
</template>
<style lang="scss">
#__nuxt {
    height: inherit;
}
</style>
<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { PUBLIC_ROUTES } from "@/constants/routes";
onBeforeMount(async () => {
    const route = useRoute();
    const user = useSupabaseUser();
    if (!PUBLIC_ROUTES.includes(route.fullPath) && user.value)   
     navigateTo(`/gateway?redirect=${route.fullPath}`)
 
        
    // const { setLoading } = useLoading();
    // setLoading(true);
    // // give time for session to catch up:
    // await new Promise((res) => setTimeout(res, 200));
    // if (PUBLIC_ROUTES.includes(route.fullPath) || !user.value) {
    //     setLoading(false);
    //     return;
    // }
    // console.log('INIT DATA')
    // const { initData } = useData();
    // await initData();  
    // await new Promise((res) => setTimeout(res, 200));
    // setLoading(false);
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
