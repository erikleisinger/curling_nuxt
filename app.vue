<template>
    <NuxtPage />
    <NotificationHandler />
    <DialogGlobalSearch v-if="isGlobalSearchOpen" />
    <!-- <div v-if="!globalLoading && pageLoading" class="page-load__wrap">
    Loading
</div> -->
</template>
<style lang="scss">
#__nuxt {
    height: inherit;
    @include sm {
        overflow: auto;
        scroll-behavior: smooth;
        &::-webkit-scrollbar {
            width: 5px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
    }
}

.page-load__wrap {
    position: fixed;
    height: calc(100 * var(--vh, 1vh));
    width: 100vw;
    background-color: rgba(0,0,0,0.5);
    top: 0;
    z-index: 3000;
}
</style>
<script setup lang="ts">
import { PUBLIC_ROUTES } from "@/constants/routes";
import { useEventListener, useScreenOrientation } from "@vueuse/core";
import { useDialogStore } from "@/store/dialog";
import {useSessionStore} from '@/store/session'

const sessionStore = useSessionStore();

const pageLoading = computed(() => sessionStore.pageLoading);
const globalLoading = computed(() => sessionStore.loading)

const nuxtApp = useNuxtApp();

const {setLoading} = useLoading();

    const route = useRoute();

    const MANUAL_LOAD_ROUTES = ['teams-id', 'player-id']
nuxtApp.hook('page:finish', () => {
    if (MANUAL_LOAD_ROUTES.includes(route.name)) return;
    setLoading(false)
})

useHead({
    title: `Pebble`
})

const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
};

onBeforeMount(async () => {
    setVh();
    useEventListener(window, "resize", setVh);
});

onBeforeMount(async () => {

    const user = useSupabaseUser();
    if (
        !PUBLIC_ROUTES.includes(route.fullPath) &&
        user.value &&
        route.name !== "gateway"
    )
        navigateTo(`/gateway?redirect=${route.fullPath}`);
});

const client = useSupabaseClient();
client.auth.onAuthStateChange((_, _session) => {
    if (_session?.access_token) {
        const accessToken = useCookie("sb-access-token");
        const refreshToken = useCookie("sb-refresh-token");
        accessToken.value = _session?.access_token ?? null;
        refreshToken.value = _session?.refresh_token ?? null;
    }
});
const dialogStore = useDialogStore();
const isGlobalSearchOpen = computed(() => dialogStore.globalSearch.open);
</script>
