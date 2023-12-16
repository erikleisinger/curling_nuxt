<template>
    <NuxtPage />
    <NotificationHandler />
    <DialogTeamViewer v-if="isTeamViewerOpen" />
    <DialogGlobalSearch v-if="isGlobalSearchOpen" />
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
</style>
<script setup lang="ts">
import { PUBLIC_ROUTES } from "@/constants/routes";
import { useEventListener, useScreenOrientation } from "@vueuse/core";
import { useDialogStore } from "@/store/dialog";

useHead({
    title: `Pebble`
})
const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
};

onMounted(async () => {
    setVh();
    useEventListener(window, "resize", setVh);
});

onBeforeMount(async () => {
    const route = useRoute();
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
const isTeamViewerOpen = computed(() => dialogStore.teamViewer.open);
const isGlobalSearchOpen = computed(() => dialogStore.globalSearch.open);
</script>
