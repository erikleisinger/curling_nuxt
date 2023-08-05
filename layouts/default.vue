<template>
    <!-- <GlobalLoading v-if="globalLoading" infinite/>
        <template v-else>
    <slot />
        </template>
    <Banner/> -->

    <GlobalLoading v-if="globalLoading" infinite />

    <q-layout view="hhh LpR fFf" v-else>
        <q-header reveal elevated class="bg-primary text-white">
            <slot name="header" />
        </q-header>

        <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered>
            <!-- drawer content -->
        </q-drawer>

        <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered>
            <!-- drawer content -->
        </q-drawer>

        <q-page-container>
            <q-page>
                <slot />
            </q-page>
        </q-page-container>

        <q-footer bordered class="bg-white text-black">
            <q-toolbar class="bottom__nav">
                <div class="bottom__nav--item">
                    <ButtonNav
                        label="Season"
                        :selected="view === VIEWS.SEASON"
                        :onClick="() => setView(VIEWS.SEASON)"
                        icon="home"
                        size="3em"
                        class="col-grow"
                    />
                </div>
                <div class="bottom__nav--item">
                    <ButtonNav
                        label="Stats"
                        :selected="view === VIEWS.STATS"
                        :onClick="() => setView(VIEWS.STATS)"
                        icon="leaderboard"
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
                    >
                        <q-fab
                            color="deep-purple"
                            icon="add"
                            size="2em"
                            direction="up"
                            class="action__button"
                            v-model="actionOpen"
                        >
                            <q-fab-action
                                color="deep-purple-10"
                                icon="scoreboard"
                                label="Line score"
                            ></q-fab-action>
                            <q-fab-action
                                color="deep-purple-10"
                                icon="radio_button_checked"
                                label="Shot by shot"
                            />
                            <q-fab-action
                                color="deep-purple-10"
                                icon="group_add"
                                label="New team"
                                @click="createNewTeam"
                            />
                        </q-fab>
                    </div>
                </div>
                <div class="bottom__nav--item">
                    <ButtonNav
                        label="Manage"
                        :selected="view === VIEWS.MANAGE"
                        :onClick="() => setView(VIEWS.MANAGE)"
                        icon="groups_2"
                        size="3em"
                        class="col-grow"
                    />
                </div>
                <div class="bottom__nav--item">
                    <ButtonNav
                        label="Settings"
                        :selected="view === VIEWS.SETTINGS"
                        :onClick="() => setView(VIEWS.SETTINGS)"
                        icon="settings"
                        size="3em"
                        class="col-grow"
                    />
                </div>
            </q-toolbar>
        </q-footer>
        <Banner />
    </q-layout>
</template>
<style lang="scss">
.bottom__nav {
    display: grid;
    grid-template-rows: 3em;
    grid-template-columns: repeat(5, 20%);
    .bottom__nav--item {
        display: flex;
        justify-content: center;
    }
}
</style>
<script setup>
import { useNavigationStore } from "@/store/navigation";
import { VIEWS } from "@/constants/navigation";
import { useEditorStore } from "@/store/editor";
import { TABLE_NAMES } from "@/constants/tables";
import { useTeamStore } from "@/store/teams";
const { globalLoading } = useLoading();
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
    leftDrawerOpen = !leftDrawerOpen;
};
const toggleRightDrawer = () => {
    rightDrawerOpen = !rightDrawerOpen;
};

const navStore = useNavigationStore();
const { setView } = navStore;
const view = computed(() => navStore.view);

const actionOpen = ref(false);
const createNewTeam = async () => {
    const teamStore = useTeamStore();
    actionOpen.value = false;
    const id = await teamStore.createBlankTeam();
    navStore.setTeamFocus(id);
    nextTick(() => {
        setView(VIEWS.MANAGE);
    });
};
</script>
