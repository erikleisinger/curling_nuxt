<template>
    <GlobalLoading v-if="globalLoading" infinite />
    <q-layout view="hhh lpr fFf" v-else class="app-layout">
        <q-page-container class="page__container--global">
                <slot />
        </q-page-container>
        <q-footer bordered class="bg-white text-black">
            <q-toolbar class="bottom__nav" >
                <div class="bottom__nav--item">
                    <ButtonNav
                        label="Season"
                        :selected="view === VIEWS.SEASON"
                        :onClick="goTo('season')"
                        icon="home"
                        size="3em"
                        class="col-grow"
                    />
                </div>
             
                 <div class="bottom__nav--item">
                    <ButtonNav
                        label="Explore"
                        :selected="view === VIEWS.EXPLORE"
                        :onClick="() => setView(VIEWS.EXPLORE)"
                        icon="explore"
                        size="3em"
                        class="col-grow"
                    />
                </div>

                <!-- New game -->
                <div
                    style="
                        position: relative;
                        min-height: inherit;
                        min-width: 75px;
                    "
                    class="col-auto"
                >
                    <div
                        style="
                            position: absolute;
                            left: 0;
                            right: 0;
                            top: -1em;
                            margin: auto;
                        "
                        class="row justify-center"
                        ref="fab"
                    >
                        <q-fab
                            color="deep-purple"
                            icon="arrow_circle_up"
                            size="2em"
                            direction="up"
                            class="action__button"
                            v-model="actionOpen"
                        >
                             <q-fab-action
                                     color="white"
                                text-color="deep-purple"
                                icon="radio_button_checked"
                                label="Shot by shot"
                                to="/game?id=53"
                            />
                            <q-fab-action
                                color="deep-purple"
                                text-color="white"
                                icon="scoreboard"
                                label="Line score"
                                @click="toggleLineScore({open: true})"
                            ></q-fab-action>
                       
                            <!-- <q-fab-action
                                     color="white"
                                text-color="deep-purple"
                                icon="groups_2"
                                label="New team"
                                @click="createNewTeam"
                            />
                               <q-fab-action
                                   color="white"
                                text-color="deep-purple"
                                icon="person"
                                label="New Player"
                                @click="createNewPlayer"
                            /> -->
                        </q-fab>
                    </div>
                </div>
                             <div class="bottom__nav--item">
                    <ButtonNav
                        label="Notifications"
                        :selected="view === VIEWS.NOTIFICATIONS"
                        :onClick="() => setView(VIEWS.NOTIFICATIONS)"
                        icon="notifications"
                        size="3em"
                        class="col-grow"
                    >
                    </ButtonNav>
                </div>     
                <div class="bottom__nav--item">
                    <ButtonNav
                        label="Settings"
                        :selected="view === VIEWS.SETTINGS"
                        :onClick="() => setView(VIEWS.SETTINGS)"
                        icon="settings"
                        size="3em"
                        class="col-grow"
                    >
                <q-badge color="red" floating v-if="requests" rounded/>
                    </ButtonNav>
                </div>
            </q-toolbar>
        </q-footer>
        <Banner />
    </q-layout>
</template>
<style lang="scss" >
.app-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color:$deep-purple;
    .q-page-container, .q-footer {
        width: min(960px, 100vw);
        background-color: white;
    }
    .q-footer {
            left: 0;
    right: 0;
    margin: auto;
    }
    .q-page-container {
        box-shadow: $pretty-shadow;
    }
}
.page__container--global {
    height: calc(100 * var(--vh, 1vh));
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
import { useDialogStore } from "@/store/dialog";
import { TABLE_NAMES } from "@/constants/tables";
import { useTeamStore } from "@/store/teams";
import {useTeamRequestStore} from '@/store/team-requests'
import {onClickOutside} from '@vueuse/core'
const { globalLoading } = useLoading();
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);


const navStore = useNavigationStore();
const { setView } = navStore;
const view = computed(() => navStore.view);

const actionOpen = ref(false);
const createNewTeam = async () => {
    const teamStore = useTeamStore();
    actionOpen.value = false;
    const id = await teamStore.createBlankTeam();
    navStore.setTeamFocus(id);
    // nextTick(() => {
    //     setView(VIEWS.NOTIFICATIONS);
    // });
};
    const editorStore = useDialogStore();
    const {toggleLineScore} = editorStore;
const createNewPlayer = async () => {
    editorStore.togglePlayerEditor({open: true})
};
const teamRequestStore = useTeamRequestStore();
const requests = computed(() => teamRequestStore.requestsToRespond)

const fab = ref(null)
onClickOutside(fab, () => {
    actionOpen.value = false;
})

const goTo = (view) => {
    navigateTo('/')
    setView(view)
}

</script>
