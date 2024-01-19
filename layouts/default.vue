<template>
    <q-layout view="hhh lpr fff" class="app-layout">

            <q-header class="layout-header" elevated reveal v-show="!isLoggedOutRoute">
                <LayoutHeader  @openFeedback="feedbackOpen = true">
                    <template v-slot:menu>
                        <q-btn
                            icon="menu"
                            flat
                            round
                            color="white"
                            @click="leftDrawerOpen = true"
                            class="nav-drawer-toggle"
                            id="global-menu-toggle"
                           
                        />
                    </template>
                </LayoutHeader>
            </q-header>
            <LayoutDrawer v-model="leftDrawerOpen" v-show="!isLoggedOutRoute"/>

            <q-page-container
                class="page__container--global relative-position"
                id="global-container"
                :class="{'prevent-scroll': $q.screen.xs && notificationsOpen}"
            >
                <GlobalNotifications/>
        
                <slot />
     
                

           
           
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
    @include hide-scroll;
    @include sm {
 @include pretty-scrollbar;
    }
   

    height: calc((100 * var(--vh, 1vh)));
    overflow: auto;
    &.prevent-scroll {
        overflow: hidden;
    }
    overflow-x:hidden;
    scroll-behavior: smooth;
    
    margin: unset !important;
    @include sm {
        height: calc((100 * var(--vh, 1vh)));
        padding-left: 80px;

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


// notifications
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
