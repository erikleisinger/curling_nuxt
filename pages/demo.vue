<template>
    <GlobalLoading/>
</template>
<script setup>
import {useAuthStore} from '@/store/auth'

const authStore = useAuthStore();

const login = async () => {
    const {DEMO_PASSWORD, DEMO_EMAIL} = useRuntimeConfig().public;
    const client = useSupabaseClient();
    const { error } = await client.auth.signInWithPassword({
            email: DEMO_EMAIL,
            password: DEMO_PASSWORD,
        });
        if (!error) {
            authStore.setLoggedIn(true);
            return navigateTo("/gateway");
        } 
}

const logout = async () => {
    const client = useSupabaseClient();
        await client.auth.signOut();
}

onMounted(async () => {
await logout();
await login();
})
</script>