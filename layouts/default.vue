<template>
    <GlobalLoading v-if="globalLoading" infinite />
    <q-layout view="hhh lpr fff" v-else class="app-layout">
        <q-drawer v-model="leftDrawerOpen" side="left" behavior="mobile">
            <q-list>
                <q-item clickable v-ripple color="primary" to="/">
                    <q-item-section
                        avatar
                        class="row justify-center items-center"
                    >
                        <q-icon name="home" size="1.5em" class="q-mb-xs" />
                    </q-item-section>
                    <q-item-section>Home</q-item-section>
                </q-item>
                <q-item
                    clickable
                    v-ripple
                    color="primary"
                    @click="toggleSearch"
                >
                    <q-item-section
                        avatar
                        class="row justify-center items-center"
                    >
                        <q-icon name="search" size="1.5em" class="q-mb-xs" />
                    </q-item-section>
                    <q-item-section class="justify-center"
                        >Search</q-item-section
                    >
                </q-item>

                <q-item clickable v-ripple color="primary" to="/profile">
                    <q-item-section
                        avatar
                        class="row justify-center items-center"
                    >
                        <q-icon name="person" size="1.5em" class="q-mb-xs" />
                    </q-item-section>
                    <q-item-section>My profile</q-item-section>
                </q-item>
                <q-item clickable v-ripple color="primary" @click="logout">
                    <q-item-section
                        avatar
                        class="row justify-center items-center"
                    >
                        <q-icon name="logout" size="1.5em" class="q-mb-xs" />
                    </q-item-section>
                    <q-item-section>Logout</q-item-section>
                </q-item>
            </q-list>
        </q-drawer>
        <q-page-container class="page__container--global">
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
                    icon="groups_2"
                    @click="goTo('#season')"
                    :size="$q.screen.xs ? 'md' : 'lg'"
                />
                <div class="action-button__container">
                    <q-fab
                        color="primary"
                        icon="add"
                        direction="up"
                        class="action-button"
                    >
                        <q-fab-action color="primary" icon="group_add" @click="newTeamOpen = true">
                            <span class="action-button__label">New team</span>
                        </q-fab-action>
                        <q-fab-action color="secondary" icon="videogame_asset" >
                            <span class="action-button__label">New game</span>
                        </q-fab-action>
                    </q-fab>
                </div>
                <q-btn
                    flat
                    icon="token"
                    color="amber"
                    :size="$q.screen.xs ? 'md' : 'lg'"
                />
                <q-btn
                    flat
                    icon="settings"
                    @click="goTo('/profile')"
                    :size="$q.screen.xs ? 'md' : 'lg'"
                />
            </q-toolbar>
        </q-footer>
    </q-layout>
    <q-dialog v-model="newTeamOpen" persistent  >
        <q-card class="team-details__viewer">
          <TeamPageDetails
        @back="newTeamOpen = false"
   
       
    />
        </q-card>
    </q-dialog>
</template>
<style lang="scss" scoped>
$footer-height-xs: 3em;
$footer-height-sm: 4em;
.team-details__viewer {
     width: min(100vw, 500px); 
        height: min(100vh, 600px);
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
    // .q-footer,
    // .q-header {
    //     left: 0;
    //     right: 0;
    //     // margin: auto;
    //     z-index: $z-tools;
    //     position: sticky;
    //     bottom: 0;
    // }

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
import { onClickOutside } from "@vueuse/core";
import { useDialogStore } from "@/store/dialog";
const { globalLoading } = useLoading();
const leftDrawerOpen = ref(false);

const newTeamOpen = ref(false)

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

const { avatar } = useUserStore();

const toggleSearch = () => {
    toggleGlobalSearch({
        open: true,
        options: {
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

    // if (selection.resourcetype === 'team') {
    // resource.value = {
    //     ...selection,
    //     team_avatar: selection.avatar
    // }
    // } else {
    //     resource.value = selection;
    // }

    // if (selection.resourcetype === 'team') {
    //     return navigateTo(`/teams/${selection.id}`)
    // }

    // showSearch.value = false;
};
</script>
