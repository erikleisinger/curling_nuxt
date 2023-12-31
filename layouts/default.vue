<template>
    <q-layout view="hhh lpr fff" class="app-layout">
      
        <q-page-container class="page__container--global relative-position" id="global-container">
              <DialogPopup :open="notificationsOpen" bottom maxHeight="600px" :maxWidth="$q.screen.xs ? null : '400px'" right :hideOverlay="!$q.screen.xs" @hide="toggleNotifications({open: false})">
                <template v-slot:header>
                    <div class="row justify-between items-center">
                    <h1
                        class="text-md text-bold row justify-between items-center"
                    >
                        Notifications
                    </h1>
                <q-btn flat round icon="close" @click="toggleNotifications({open: false})"/>
                    </div>
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
                    :color="route.path === '/' ? 'blue' : 'grey-9'"
             
                />
                <q-btn
                    flat
                    icon="search"
                  
                    :size="$q.screen.xs ? 'md' : 'lg'"
                    @click="toggleSearch"
                     :color="searchOpen ? 'blue' : 'grey-9'"
                >
                </q-btn>
                <div class="action-button__container z-max">
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
                    :color="notificationsOpen ? 'blue' : 'grey-9'"
                    :size="$q.screen.xs ? 'md' : 'lg'"
                    @click="toggleNotifications({open: !notificationsOpen})"
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
            <FeedbackPopup v-model="feedbackOpen" @close="feedbackOpen = false"/>
    </q-layout>


</template>
<style lang="scss" scoped>
$footer-height-xs: 3em;
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
</style>
<script setup>
import { onClickOutside } from "@vueuse/core";
import { useDialogStore } from "@/store/dialog";
import Player from "@/store/models/player";

const { globalLoading } = useLoading();
const $q = useQuasar();

const route = useRoute();

// POPUP STATE

const dialogStore = useDialogStore();
const { toggleLineScore, toggleGlobalSearch, toggleNotifications } = dialogStore;

// --> feedback

const feedbackOpen = ref(false)

// --> big fab button

const actionOpen = ref(false);
const fab = ref(null);
onClickOutside(fab, () => {
    actionOpen.value = false;
});

// --> notifications
const unreadNotificationCount = ref(0);
const notificationsOpen = computed(() => dialogStore.notifications.open)


// PLAYER AVATAR
const { user: userId } = useUser();

const avatar = computed(
    () => useRepo(Player).where("id", userId.value).first()?.avatar ?? {}
);


// SEARCH

const toggleSearch = () => {
    toggleGlobalSearch({
        open: true,

        options: {
            resourceTypes: ['team', 'profile', 'rink', 'league'],
            inputLabel: "Search for a team, player, rink, or event",
            callback: onSelect,
        },
    });
};

const searchOpen = computed(() => dialogStore.globalSearch.open)

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
// navigation

const goTo = (view) => {
    const wasNotificationsOpen = dialogStore.notifications.open;
    toggleGlobalSearch({open: false});
    toggleNotifications({open: false});
    setTimeout(() => {
    return navigateTo(`${view}`);
    }, wasNotificationsOpen ? 100 : 0)
    
};

</script>
