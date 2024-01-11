<template>
    <q-layout view="hhh lpr fff" class="app-layout">

            <q-header class="layout-header" elevated reveal v-show="!isLoggedOutRoute">
                <LayoutHeader>
                    <template v-slot:menu>
                        <q-btn
                            icon="menu"
                            flat
                            round
                            color="white"
                            @click="leftDrawerOpen = true"
                            class="nav-drawer-toggle"
                        />
                    </template>
                </LayoutHeader>
            </q-header>
            <LayoutDrawer v-model="leftDrawerOpen" v-show="!isLoggedOutRoute"/>

            <q-page-container
                class="page__container--global relative-position"
                id="global-container"
            >
                <DialogPopup
                    :open="notificationsOpen"
                    bottom
                    maxHeight="600px"
                    :maxWidth="$q.screen.xs ? null : '400px'"
                    right
                    :hideOverlay="!$q.screen.xs"
                    @hide="toggleNotifications({ open: false })"
                >
                    <template v-slot:header>
                        <div class="row justify-between items-center">
                            <h1
                                class="text-md text-bold row justify-between items-center"
                            >
                                Notifications
                            </h1>
                            <q-btn
                                flat
                                round
                                icon="close"
                                @click="toggleNotifications({ open: false })"
                            />
                        </div>
                    </template>
                    <AchievementHistory
                        :open="notificationsOpen"
                        v-model="unreadNotificationCount"
                    />
                </DialogPopup>
         <div>
                <slot />
         </div>
                
                     <LayoutAside v-if="!isLoggedOutRoute && $q.screen.gt.sm"/>
           
           
            </q-page-container>

            <FeedbackPopup
                v-model="feedbackOpen"
                @close="feedbackOpen = false"
            />
   
    </q-layout>
</template>
<style lang="scss" scoped>
$footer-height-xs: 4em;
$footer-height-sm: 4em;

.profile-avatar--container {
    cursor: pointer;
    width: 25px;
    margin-right: auto;
    margin-left: auto;
    transition: transform 0.2s;
    @include sm {
        width: 40px;
    }
    &:hover {
        transform: scale(1.1);
    }
}
.app-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    width: $app-width;

    :deep(.q-drawer) {
        position: absolute !important;
        height: 100vh;
        left: 0;
    }
    :deep(.q-drawer__backdrop) {
        display: none;
    }

    // @include bg-pebble;
    background-color: white;
    .q-header {
        background-color: white;
        margin: auto;
    }
    .q-page-container,
    .q-header {
        width: $app-width;
        max-width:  $app-width;
    }
}
.page__container--global {
    height: calc((100 * var(--vh, 1vh)));
    overflow: auto;
    overflow-x:hidden;
    scroll-behavior: smooth;
    // padding: unset !important;
    -ms-overflow-style: none!important; /* IE and Edge */
    scrollbar-width: none!important;; /* Firefox */
    &::-webkit-scrollbar {
        display: none!important;;
    }
    margin: unset !important;
    @include sm {
        height: calc((100 * var(--vh, 1vh)));
        padding-left: 80px;

    }
     @include md {

        display: grid;
        grid-template-columns: calc(100% - 300px) 300px;
    }
    .page-container__content {
        overflow: hidden;
        width: 100%;
        max-width: 100%;
        height: 100%;
        
    }
}
</style>
<script setup>
import { onClickOutside } from "@vueuse/core";
import { useDialogStore } from "@/store/dialog";
import Player from "@/store/models/player";

const { globalLoading } = useLoading();
const $q = useQuasar();

const leftDrawerOpen = ref(false);

const route = useRoute();
const isLoggedOutRoute = computed(() =>
    ["/login", "/gateway"].includes(route.path)
);

// POPUP STATE

const dialogStore = useDialogStore();
const { toggleLineScore, toggleGlobalSearch, toggleNotifications } =
    dialogStore;

// --> feedback

const feedbackOpen = ref(false);

// --> big fab button

const actionOpen = ref(false);
const fab = ref(null);
onClickOutside(fab, () => {
    actionOpen.value = false;
});

// --> notifications
const unreadNotificationCount = ref(0);
const notificationsOpen = computed(() => dialogStore.notifications.open);

// PLAYER AVATAR
const { user: userId } = useUser();

const avatar = computed(
    () => useRepo(Player).where("id", userId.value).first()?.avatar ?? {}
);

// navigation

const goTo = (view) => {
    const wasNotificationsOpen = dialogStore.notifications.open;
    toggleGlobalSearch({ open: false });
    toggleNotifications({ open: false });
    setTimeout(
        () => {
            return navigateTo(`${view}`);
        },
        wasNotificationsOpen ? 100 : 0
    );
};
</script>
