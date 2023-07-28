<template>
    <NuxtLayout v-if="!editing">
        <div ref="header" style="z-index:10">
            <ProfileExpandable v-model="expanded" />
            <q-toolbar
                class="bg-deep-purple text-white q-px-none"
                v-if="$q.screen.lt.md"
                role="navigation"
            >
                <q-tabs
                    v-model="tab"
                    inline-label
                    outside-arrows
                    mobile-arrows
                    class="col-grow"
                >
                    <q-tab
                        v-for="tab in TABS"
                        :key="tab.value"
                        :name="tab.value"
                        tabindex="0"
                        :aria-controls="tab.value"
                        :label="tab.label"
                    />
                </q-tabs>
            </q-toolbar>
        </div>

        <transition-group
            appear
            :enter-active-class="`animated ${enterAnimation}`"
            :leave-active-class="`animated ${leaveAnimation}`"
        >
            <section
                class="column"
                v-if="tab === TAB_VALUES.GAMES"
                key="games"
                name="games"
                :style="{ height: sectionHeight }"
            >
                <TableGame />
            </section>

            <section
                class="column"
                v-else-if="tab === TAB_VALUES.TEAMS"
                key="teams"
                name="teams"
                :style="{ height: sectionHeight }"
            >
                <TableTeams />
            </section>

            <section
                class="column"
                v-else-if="tab === TAB_VALUES.PLAYERS"
                key="players"
                :style="{ height: sectionHeight }"
            >
                <TablePlayers />
            </section>
        </transition-group>
    </NuxtLayout>
    <GameEditor v-else />
</template>
<script setup>
import { useRefHistory } from "@vueuse/core";
import { useRouteQuery } from "@vueuse/router";

const TABS = [
    {
        label: "Games",
        value: 0,
    },
    {
        label: "Teams",
        value: 1,
    },
    {
        label: "Players",
        value: 2,
    },
];

const TAB_VALUES = {
    GAMES: 0,
    TEAMS: 1,
    PLAYERS: 2,
    //   SHOT_TYPES: 3,
    RINKS: 4,
    SHEETS: 5,
};

const tab = ref(0);
const { history: tabHistory, undo } = useRefHistory(tab);

const enterAnimation = ref("slideInLeft");
const leaveAnimation = ref("slideOutRight");

watch(
    tab,
    (newTab) => {
        const { snapshot: lastTab } = tabHistory.value[1] || {};
        const goingRight = lastTab - newTab < 1;
        if (goingRight) {
            enterAnimation.value = "slideInRight";
            leaveAnimation.value = "slideOutLeft";
        } else {
            enterAnimation.value = "slideInLeft";
            leaveAnimation.value = "slideOutRight";
        }
    },
    { immediate: true }
);

const editQuery = useRouteQuery("edit");
const editing = ref(false);
onMounted(() => {
    if (editQuery.value) editing.value = true;
});

const expanded = ref(false);

onBeforeRouteLeave((to, from, next) => {
    if (window.event.type === "popstate") {
        if (expanded.value) {
            expanded.value = false;
        } else if (tabHistory.value.length > 1) {
            next(false);
            undo();
        }
    } else {
        next();
    }
});
const header = ref(null);
const { height } = useElementSize(header);
const sectionHeight = computed(() => `calc(100% - ${height.value}px)`);
</script>
