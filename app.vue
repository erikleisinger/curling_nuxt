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
import { useDebounceFn } from "@vueuse/core";
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
const route = useRoute();
const { initData, resetData } = useData();
onBeforeMount(async () => {
    client.auth.onAuthStateChange((s) => {
        handleLoggedInState(s as AuthState);
    });
});

const handleInitData = useDebounceFn(async () => initData(), 2000);
const client = useSupabaseAuthClient();
const destroySession = async () => {
    await resetData();
    await navigateTo("/login");
};
const lastState = ref();

const handleLoggedInState = async (state: AuthState) => {
    if (state === lastState.value) return;
    lastState.value = state;
    loading.value = true;

    if (state === AuthState.INITIAL_SESSION) {
        const { data, error } = await client.auth.refreshSession();
        if (error) {
            await client.auth.signOut();
         
        } else {
            const {session} =data;
            if (!session) return;
            const {access_token, refresh_token} = session;
            client.auth.setSession(session)
            document.cookie=`sb-access-token=${access_token}`
            document.cookie=`sb-refresh-token=${refresh_token}`
        }
        
           return;
    } else if (state === AuthState.TOKEN_REFRESHED) {
        return;
    } else if (state === AuthState.SIGNED_OUT) {
        await destroySession();
    } else if (state === AuthState.SIGNED_IN) {
        await handleInitData();
        if (route.fullPath === "/login") {
            await navigateTo("/");
        }
    }
    loading.value = false;
};
</script>
