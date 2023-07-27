<template>
    <NuxtPage v-if="!loading" />
    <GlobalLoading infinite v-else />
</template>
<style lang="scss">
#__nuxt {
    height: inherit;
}
</style>
<script setup lang="ts">
import {useRouteQuery} from '@vueuse/router'
import { useDebounceFn } from "@vueuse/core";
import { BannerColors } from "@/types/color";
enum AuthState {
    INITIAL_SESSION = "INITIAL_SESSION",
    SIGNED_IN = "SIGNED_IN",
    SIGNED_OUT = "SIGNED_OUT",
    TOKEN_REFRESHED = "TOKEN_REFRESHED",
    USER_UPDATED = "USER_UPDATED",
    PASSWORD_RECOVERY = "PASSWORD_RECOVERY",
}
const loading = ref(true);
const initialized = ref(false);

const { initData, resetData } = useData();
onBeforeMount(async () => {
    const isNewUser = useRouteQuery('newuser')
    if(isNewUser.value) {
        await resetData();
        reloadNuxtApp({path: '/login?authenticated=true'})
        return;
    } else {
   client.auth.onAuthStateChange((s) => {
        handleLoggedInState(s as AuthState);
    });
    }
 
});

onMounted(() => {
    const newlyAuthed = useRouteQuery('authenticated')
    if (newlyAuthed.value) {
const {setBanner} = useBanner()
        setBanner('Email authenticated. You may now log in.', BannerColors.Primary)
        // loading.value = false;
    }
})

const handleInitData = useDebounceFn(async () => initData(), 2000);
const client = useSupabaseAuthClient();
const destroySession = async (query?:string) => {
    await resetData();
    await navigateTo(`/login${query || ''}`);
};
const lastState = ref();

const handleLoggedInState = async (state: AuthState) => {
    if (state === lastState.value) return;
    console.log('state: ', state)
    lastState.value = state;
    loading.value = true;

    if (state === AuthState.INITIAL_SESSION) {
       await client.auth.getSession();
        // if (error) {
        //     await client.auth.signOut();
         
        // } 
        // else {
        //     const {session} =data;
        //     if (!session) return;
        //     const {access_token, refresh_token} = session;
        //     client.auth.setSession(session)
        //     document.cookie=`sb-access-token=${access_token}`
        //     document.cookie=`sb-refresh-token=${refresh_token}`
        // }
        loading.value = false;
           return;
    } else if (state === AuthState.TOKEN_REFRESHED) {
          loading.value = false;
        return;
    } else if (state === AuthState.SIGNED_OUT) {
        await destroySession();
    } else if (state === AuthState.SIGNED_IN) {
        await handleInitData();
        const route = useRoute();
        console.log(route)
        if (route.fullPath === "/login") {
            await navigateTo("/");
        }
    }
    loading.value = false;
};
</script>
