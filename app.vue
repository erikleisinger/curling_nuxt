<template>
    <NuxtPage v-if="!globalLoading" />
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

const {globalLoading} = useLoading();
const initialized = ref(false);

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
