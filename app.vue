<template>
 <div>
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <GlobalLoading v-show="globalLoading" infinite />
    </transition>
   <NuxtLayout>
        <NuxtPage />
           </NuxtLayout>
        <NotificationHandler />
        <DialogGlobalSearch v-if="isGlobalSearchOpen" />
        <!-- <DialogLeagueEditor v-if="isLeagueEditorOpen" /> -->
                <TeamPlayerChangeListener v-if="!isPublicRoute && !!userId"/>

            <TutorialGlobal v-if="!isPublicRoute && !hasCompletedTutorial"/>
       
 </div>
</template>
<style lang="scss">
@include styleInput($app-mint, 'white');
#__nuxt {
    height: inherit;
    @include bg-blue-side;
    // background-color: #150578
    
}

.page-load__wrap {
    position: fixed;
    height: calc(100 * var(--vh, 1vh));
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    z-index: 3000;
}
.teamcreator__card {
    width: min(90vw, 600px);
}
</style>
<script setup lang="ts">
import { PUBLIC_ROUTES } from "@/constants/routes";
import { useEventListener, useScreenOrientation } from "@vueuse/core";
import { useDialogStore } from "@/store/dialog";
import { useSessionStore } from "@/store/session";
import {useUserStore} from '@/store/user'
import {useNotificationStore} from '@/store/notification'

const { globalLoading } = useLoading();
const sessionStore = useSessionStore();

const pageLoading = computed(() => sessionStore.pageLoading);

const nuxtApp = useNuxtApp();

const { setLoading } = useLoading();

const route = useRoute();

const {user:userId} = useUser();
const {userTeamIds} = useTeam();

const scrubUrl = () => {
    const {query} = route;
    if (!query?.force) return;
    const queryClone = {...query};
    if (queryClone.force) delete queryClone.force;
    return navigateTo({...route, query: {
        ...queryClone,

    }}, {replace: true})
}

const MANUAL_LOAD_ROUTES = [
    "teams-id",
    "player-id",
    "games-view-id",
    "rinks-id",
];
nuxtApp.hook("page:finish", () => {
    scrubUrl();
    if (MANUAL_LOAD_ROUTES.includes(route.name)) return;
    setLoading(false);
});

useHead({
    title: `Pebble`,
});

const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
};

onBeforeMount(async () => {
    setVh();
    useEventListener(window, "resize", setVh);
});

const isPublicRoute = computed(() => PUBLIC_ROUTES.includes(route.fullPath))

onBeforeMount(async () => {
    const user = useSupabaseUser();
    if (
        !PUBLIC_ROUTES.includes(route.fullPath) &&
        user.value &&
        route.name !== "gateway"
    ) return navigateTo(`/gateway?redirect=${route.fullPath}`, {replace: true,});
    
        
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
const isLeagueEditorOpen = computed(() => dialogStore.leagueEditor.open);
const isTeamCreatorOpen = computed(() => dialogStore.teamCreator.open);

const hasCompletedTutorial = computed(() => useUserStore()?.has_completed_tutorial)
</script>
