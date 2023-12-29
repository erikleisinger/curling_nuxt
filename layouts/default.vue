<template>
    <q-layout view="hhh lpr fff" class="app-layout">
        <q-page-container class="page__container--global relative-position">
            <DialogPopup :open="notificationsOpen" bottom maxHeight="600px" :maxWidth="$q.screen.xs ? null : '400px'" right :hideOverlay="!$q.screen.xs" v-if="ready">
                <template v-slot:header>
                    <h1
                        class="text-md text-bold row justify-between items-center"
                    >
                        Notifications
                    </h1>
                </template>
                <AchievementHistory
                    :open="notificationsOpen"
                    v-model="unreadNotificationCount"
                />
            </DialogPopup>

            <slot />
        </q-page-container>
        <q-footer bordered class="bg-white text-black row justify-between">
            <q-toolbar class="global-footer row justify-between">
                <q-btn
                    flat
                    icon="home"
                    @click="goTo('/')"
                    :size="$q.screen.xs ? 'md' : 'lg'"
             
                />
                <q-btn
                    flat
                    icon="search"
                  
                    :size="$q.screen.xs ? 'md' : 'lg'"
                    @click="toggleSearch"
                >
                </q-btn>
                <div class="action-button__container">
                    <q-fab
                        color="primary"
                        icon="add"
                        direction="up"
                        class="action-button"
                    >
                      <q-fab-action
                            color="primary"
                            icon="videogame_asset"
                            @click="goTo('/games/create')"
                        >
                            <span class="action-button__label">New game</span>
                        </q-fab-action>
                     
                       
                        <q-fab-action
                            color="blue"
                            icon="group_add"
                           @click="dialogStore.toggleTeamCreator({open: true})"
                        >
                            <span class="action-button__label">New team</span>
                        </q-fab-action>
                        <q-fab-action color="blue" icon="comment"  @click="feedbackOpen = true" >
                            <span class="action-button__label">Submit feedback</span>
                        </q-fab-action>
                      
                    </q-fab>
                </div>
                <q-btn
                    flat
                    icon="notifications"
                    :color="notificationsOpen ? 'blue' : ''"
                    :size="$q.screen.xs ? 'md' : 'lg'"
                    @click="toggleNotifications"
                >
                <transition appear enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
                    <q-badge
                        color="red"
                        floating
                        rounded
                        v-if="!!unreadNotificationCount"
                        >
                        {{unreadNotificationCount}}
                        </q-badge>
                </transition>
                </q-btn>

                <div
                    class="profile-avatar--container"
                    @click="goTo(`/player/${userId}`)"
                >
                    <Avataaar v-bind="avatar" />
                </div>
            </q-toolbar>
        </q-footer>
    </q-layout>

    <FeedbackPopup v-model="feedbackOpen" @close="feedbackOpen = false"/>
</template>
<style lang="scss" scoped>
$footer-height-xs: 3em;
$footer-height-sm: 4em;
.team-details__viewer {
    width: min(100vw, 500px);
    height: min(100vh, 600px);
}
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
    background-color: rgba(0, 0, 0, 0.05);
    .q-page-container,
    .q-footer,
    .q-header {
        width: min(960px, 100vw);
        background-color: white;
        margin: auto;
    }


    .q-page-container {
        box-shadow: $pretty-shadow;
        padding-top: unset !important;
    }

    .global-footer {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        height: 3em;
        padding: unset;

        @include sm {
            height: 4em;
        }
        > .q-btn {
            width: min-content;
            margin: auto;
        }
        .action-button__container {
            position: relative;
            height: 100%;
            .action-button {
                position: absolute;
                left: 0;
                right: 0;
                width: min-content;
                margin: auto;
                top: -10px;
                .q-btn {
                    position: absolute;
                    &:first-child {
                        top: -90px;
                    }
                    &:not(:first-child) {
                        top: -50px;
                    }
                    &:nth-child(2) {
                        left: -60px;
                    }
                    &:nth-child(3) {
                        right: -60px;
                    }
                }
                .action-button__label {
                    position: absolute;
                    bottom: -2em;
                    color: black;
                    text-transform: uppercase;
                    font-size: 0.8em;
                }
            }
        }
    }
    :deep(.q-drawer) {
        .q-drawer__content {
            padding-top: 4em !important;
        }
    }
}
.page__container--global {
    height: calc((100 * var(--vh, 1vh)) - $footer-height-xs);
    overflow: auto;
    scroll-behavior: smooth;
    padding: unset !important;
    margin: unset !important;
    @include sm {
        height: calc((100 * var(--vh, 1vh)) - $footer-height-sm);
    }
}
.bottom__nav {
    display: grid;
    grid-template-rows: 3em;
    grid-template-columns: repeat(5, 20%);

    .bottom__nav--item {
        display: flex;
        justify-content: center;
        .q-badge {
            // font-family: $font-family-secondary;
            padding: 0px 6px;
        }
    }
}
</style>
<script setup>
import { useNavigationStore } from "@/store/navigation";
import { TABLE_NAMES } from "@/constants/tables";
import { useUserStore } from "@/store/user";
import { onClickOutside, useEventListener, useThrottleFn } from "@vueuse/core";
import { useDialogStore } from "@/store/dialog";
import { useTeamRequestStore } from "@/store/team-requests";
import { useGameRequestStore } from "@/store/game-requests";
import Player from "@/store/models/player";

const { globalLoading } = useLoading();

const route = useRoute();

const feedbackOpen =  ref(false)
const leftDrawerOpen = ref(false);


const notificationsOpen = computed(() => {
    if (globalLoading.value) return false;
    if (route.name === '/gateway') return false;
    const {hash} = route;
    return hash === '#notifications'
})


const { logout } = useSession();
const { getColor } = useColor();

const $q = useQuasar();

const navStore = useNavigationStore();
const { setView } = navStore;
const view = computed(() => navStore.view);

const actionOpen = ref(false);
const dialogStore = useDialogStore();
const { toggleLineScore, toggleGlobalSearch } = dialogStore;

const fab = ref(null);
onClickOutside(fab, () => {
    actionOpen.value = false;
});

const goTo = (view) => {
    navigateTo(`${view}`);
};
const { user: userId } = useUser();

const avatar = computed(
    () => useRepo(Player).where("id", userId.value).first()?.avatar ?? {}
);

const toggleSearch = () => {
    toggleGlobalSearch({
        open: true,

        options: {
            resourceTypes: ['team', 'profile', 'rink', 'league'],
            inputLabel: "Search for a team, player, rink, or event",
            callback: onSelect,
        },
    });
    leftDrawerOpen.value = false;
};

const onSelect = (selection) => {
    toggleGlobalSearch({
        open: false,
    });
    if (selection.resourcetype === "team") {
        return navigateTo(`/teams/${selection.id}`);
    }
    if (selection.resourcetype === "profile") {
        return navigateTo(`/player/${selection.profile_id}`);
    }
    if (selection.resourcetype === 'rink') {
        return navigateTo(`/rinks/${selection.id}`);
    }
     if (selection.resourcetype === 'league') {
        return navigateTo(`/leagues/${selection.id}`);
    }
};

const unreadNotificationCount = ref(0);

const toggleNotifications = () => {
    if (!notificationsOpen.value) {
        navigateTo("#notifications");
    } else {
        navigateTo(route.path, { replace: true });
    }
};

// watch(
//     () => route.path,
//     (val, oldVal) => {
//         if (val !== oldVal && val !== '/gateway' && oldVal !== '/gateway' && route.hash === '#notifications') {
//             ready.value = false;
//             navigateTo(val, {replace: true})
//             setTimeout(() => {
//             ready.value = true;
//             }, 100)
            
//         }

//     },
//     { deep: true }
// );
const ready = ref(false)
onMounted(() => {
    setTimeout(() => {
        ready.value = true
    }, 1000)
   
})


</script>
