<template>
    <GlobalLoading v-if="globalLoading" infinite />
    <q-layout view="hhh lpr fff" v-else class="app-layout">
        <q-header bordered class="bg-white text-black" >
            <q-toolbar class="global-header row justify-between">
                <div style="width: 50%">
                </div>
                <div
                    class="row full-height items-center col-grow clickable"
                    @click="goTo('#season')"
                >
                    <div
                        style="height: 50%; aspect-ratio: 1/1; margin-top: -10%"
                    >
                        <Logo :color="getColor('deepPurple')" />
                    </div>
                </div>

                <div
                    v-if="$q.screen.xs"
                    style="width: 50%"
                    class="row justify-end"
                >
                    <q-btn
                        flat
                        round
                        icon="menu"
                        color="grey-8"
                        @click="rightDrawerOpen = !rightDrawerOpen"
                    />
                </div>

                <div v-else class="row justify-end" style="width: 50%">
                    <q-btn flat round icon="search" />
                    <q-btn flat round icon="notifications" />
                </div>
            </q-toolbar>
        </q-header>
        <q-drawer v-model="rightDrawerOpen" side="right" behavior="mobile">
            <q-list>
                  <q-item
                    clickable
                    v-ripple
                    color="primary"
                    to="/"
                >
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
                    <q-item-section class=" justify-center">Search</q-item-section>
                </q-item>
                 <q-item clickable v-ripple color="primary" @click="toggleLineScore({open: true})">
                   <q-item-section
                        avatar
                        class="row justify-center items-center"
                    >
                            <q-icon name="add" size="1.5em" class="q-mb-xs" />
                     
                    </q-item-section>
                    <q-item-section>Enter linescore</q-item-section>
                </q-item>
                <q-item clickable v-ripple color="primary" to="/profile">
                    <q-item-section avatar>
                        <!-- <div style="height: 2.5em; width: 2.5em">
                            <Avataaar
                                v-bind="avatar ? parseAvatar(avatar) : {}"
                            />
                        </div> -->
                    </q-item-section>
                    <q-item-section>My profile</q-item-section>
                </q-item>
            </q-list>
        </q-drawer>
        <q-page-container class="page__container--global">
            <slot />
        </q-page-container>

        <Banner />
    </q-layout>
</template>
<style lang="scss" scoped>
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
    }
    .q-footer,
    .q-header {
        left: 0;
        right: 0;
        // margin: auto;
        z-index: $z-tools;
        position: sticky;
        top: 0;
    }

    .q-page-container {
        box-shadow: $pretty-shadow;
        padding-top: unset!important;
    }

    .global-header {
        height: 4em;

        @include sm {
            height: 6em;
        }
    }
    :deep(.q-drawer) {
        .q-drawer__content {
            padding-top: 4em !important;
        }
    }
}
.page__container--global {
      height: calc((100 * var(--vh, 1vh)) - 65px);
    overflow: auto;
    @include sm {
        height: auto;
        overflow: unset;
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
import { VIEWS } from "@/constants/navigation";
import { TABLE_NAMES } from "@/constants/tables";
import { useUserStore } from "@/store/user";
import { onClickOutside } from "@vueuse/core";
import { useDialogStore } from "@/store/dialog";
const { globalLoading } = useLoading();
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

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
    navigateTo("/");
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
    rightDrawerOpen.value = false;
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
