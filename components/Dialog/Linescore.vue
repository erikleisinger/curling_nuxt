<template>
    <DialogFloating @close="toggleLineScore({ open: false })" :backable="false">
        <!-- STEP 1: Team Select -->
        <LinescoreTeamSelect
            v-if="view === views.TEAM_SELECT"
            @close="confirmUnsaved = true"
            v-model="teamSelection"
        />

        <template v-slot:buttonLeft>
            <div />
        </template>
        <template v-slot:buttonRight>
            <q-btn flat round icon="close" @click="confirmUnsaved = true" />
        </template>

        <template v-slot:header>
            <div class="header__current-step">
                <div
                    class="row items-center justify-center"
                    v-if="showBackArrow"
                >
                    <q-btn
                        flat
                        round
                        icon="arrow_back"
                        @click="onBackArrowClick"
                    />
                </div>
                <div v-else />
                {{ headerText }}
                <div
                    class="row items-center justify-center"
                    v-if="showForwardArrow"
                >
                    <q-btn
                        flat
                        round
                        icon="arrow_forward"
                        @click="onForwardArrowClick"
                    />
                </div>
            </div>
        </template>

        <!-- STEP 2: Line score input -->

        <div
            v-if="view === views.LINESCORE"
            class="full-height scoreboard__container"
        >
            <div class="nav__container" ref="nav">
                <div
                    class="row justify-center items-center text-xl nav__container--item"
                >
                    <div class="nav-container--item__column">
                        <div></div>
                        <div class="row items-center team-avatar__container">
                            <Avataaar
                                style="height: 100%; width: 100%"
                                v-bind="
                                    parseAvatar(teamSelection.home?.team_avatar)
                                "
                            >
                            </Avataaar>
                            <q-badge
                                :color="teamSelection?.homeColor"
                                rounded
                            ></q-badge>
                        </div>
                        <div
                            class="row items-center team-avatar__container"
                            style="width: 1em"
                        >
                            <Avataaar
                                style="height: 100%; width: 100%"
                                v-bind="
                                    parseAvatar(teamSelection.away?.team_avatar)
                                "
                            />
                            <q-badge
                                :color="teamSelection?.awayColor"
                                rounded
                            ></q-badge>
                        </div>
                    </div>
                </div>
                <div
                    v-for="end in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                    :key="`${end}-label`"
                    class="row justify-center items-center text-xl nav__container--item"
                    :class="{ selected: visible === end }"
                    @click="scrollTo(end)"
                >
                    <div class="nav-container--item__column">
                        <div>{{ end }}</div>
                        <div>{{ score[end].home }}</div>
                        <div>{{ score[end].away }}</div>
                    </div>
                </div>
                <div
                    class="row justify-center items-center text-xl nav__container--item"
                >
                    <div class="nav-container--item__column full-width total">
                        <div class="row justify-center items-center">T</div>
                        <!-- :class="{ selected: awayTotal < homeTotal }" -->
                        <div class="row justify-center items-center">
                            {{ homeTotal }}
                        </div>
                        <!-- :class="{ selected: homeTotal < awayTotal }" -->
                        <div class="row justify-center items-center">
                            {{ awayTotal }}
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="scoreboard__score-container row no-wrap hide-scroll"
                id="scoreboard-linescore"
                ref="scroller"
                :style="{ height: contentHeight }"
            >
                <div class="start__padding col-grow" />

                <!-- <ScrollerSection>
                 
                            <LinescoreRockSelect />
                
                    </ScrollerSection> -->

                <ScrollerSection
                    @visible="setVisible(end)"
                    v-for="end in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                    :key="`end-input-${end}`"
                >
                    <!-- v-slot="{distance}" -->
                    <div
                        :id="`scoreboard-end-${end}`"
                        class="scoreboard__end-container"
                    >
                        <!-- <span style="position:absolute;">{{distance}}</span> -->
                        <LinescoreColumn
                            v-model="score[end]"
                            :visible="visible === end"
                            :endno="end"
                        />
                    </div>
                </ScrollerSection>
                <div class="start__padding col-grow" />
            </div>
        </div>

        <LinescoreConfirmation
            :score="{ home: homeTotal, away: awayTotal }"
            :teamSelection="teamSelection"
            v-if="view === views.CONFIRM"
            @save="save"
        />
    </DialogFloating>
    <DialogConfirmation
        v-if="!!confirmUnsaved"
        confirmButtonText="Discard"
        cancelButtonText="Cancel"
        @confirm="toggleLineScore({ open: false })"
        @close="confirmUnsaved = false"
        cancelColor=""
        confirmColor="negative"
    >
        <!--  -->
        <!-- -->
        Are you sure you want to close? All unsaved changes will be lost.
    </DialogConfirmation>
</template>
<style lang="scss" scoped>
$column-width: 26vh;
$gutter-width: 20vw;
$scroll-margin: -100px;

.header__current-step {
    height: 4em;
    display: grid;
    grid-template-columns: 15% auto 15%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: var(--text-md);
    font-weight: bold;
    font-family: $font-family-main;
    flex-wrap: nowrap;
}

.nav__container {
    // height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 2fr repeat(10, 1fr) 2fr;
    column-gap: 1px;
    background-color: $grey-4;
    .nav__container--item {
        border-bottom: 1px solid $grey-4;
        background-color: white;
        height: 100%;
        position: relative;
        &.selected {
            background-color: #00cd93;
            color: white;
            font-weight: bold;
        }

        .nav-container--item__column {
            display: grid;
            grid-template-rows: repeat(3, 33%);
            overflow: hidden;
            height: 100%;
            &.total {
                // background-color: rgba(0, 0, 0, 0.1);
            }
            > div {
                text-align: center;
            }
            .team-avatar__container {
                position: relative;
                .q-badge {
                    position: absolute;
                    bottom: 0.4em;
                    right: 0;
                }
            }
        }
    }
}
.scoreboard__end-row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: v-bind(opacity);
}
.scoreboard__container {
    width: 100%;
    .scoreboard__score-container {
        scroll-snap-type: x mandatory;
        scroll-snap-stop: always;

        width: 100%;
        border-radius: 8px;
        overflow-y: hidden;
        overflow-x: auto;
        position: relative;
        .start__padding {
            width: calc(100vw / 2 - $column-width / 2);
            height: 100%;
        }
        :deep(.scoreboard__end-container) {
            scroll-snap-align: center;
            scroll-snap-stop: always;
            overflow: hidden;
            display: grid;
            min-width: $column-width;
            max-width: $column-width;
            grid-template-columns: 100%;
            grid-template-rows: repeat(2, 50%);
            row-gap: 1px;
            height: 100%;
            width: 100%;
        }
    }
}
</style>
<script setup lang="ts">
import { useEditorStore } from "@/store/editor";
import { useGameStore } from "@/store/games";

import { usePlayerStore } from "@/store/players";
import {
    useElementSize,
    useScreenOrientation,
    useScroll,
    useSwipe,
    useThrottleFn,
    useWindowSize,
} from "@vueuse/core";
import { generateEnds } from "@/utils/create-game";
import { parseAvatar } from "@/utils/avatar";

const teamSelection = ref({
    home: null,
    away: null,
    homeColor: null,
    awayColor: null,
});

const headerText = computed(() => {
    if (view.value === views.TEAM_SELECT) {
        if (!teamSelection.value.home) {
            return "Select a team";
        } else if (!teamSelection.value.away) {
            return "Select an opposition";
        } else {
            return "Select rock colors";
        }
    } else if (view.value === views.LINESCORE) {
        return "Enter linescore";
    } else if (view.value === views.CONFIRM) {
        return "Review game";
    }
});

/**
 *
 * BEGIN forward arrow logic
 */

const showForwardArrow = computed(() => {
    if (view.value === views.TEAM_SELECT) {
        return teamSelection?.value?.home && teamSelection?.value?.away;
    }
    if (view.value === views.LINESCORE) return true;
});
const onForwardArrowClick = () => {
    if (view.value === views.TEAM_SELECT) {
        if (teamSelection?.value?.away && teamSelection.value?.home) {
            view.value = views.LINESCORE;
        }
    } else if (view.value === views.LINESCORE) {
        view.value = views.CONFIRM;
    }
};

/**
 * END forward arrow logic
 */

/**
 *
 * BEGIN back arrow logic
 */

const showBackArrow = computed(() => {
    if (view.value === views.TEAM_SELECT) {
        return !!teamSelection?.value?.home;
    }
    if ([views.LINESCORE, views.CONFIRM].includes(view.value)) return true;
});

const onBackArrowClick = () => {
    if (view.value === views.TEAM_SELECT) {
        if (teamSelection?.value?.away) {
            teamSelection.value.away = null;
        } else if (teamSelection?.value?.home) {
            teamSelection.value.home = null;
        }
    }
    if (view.value === views.LINESCORE) {
        view.value = views.TEAM_SELECT;
    }
    if (view.value === views.CONFIRM) {
        view.value = views.LINESCORE;
    }
};

/**
 * END back arrow logic
 */

const confirmUnsaved = ref(false);

const root = ref(null);

const editorStore = useEditorStore();
const { toggleLineScore } = editorStore;

const visible = ref(1);

const setVisible = (index) => {
    // if (!isScrolling.value) return;
    visible.value = index;
};

const emit = defineEmits(["close"]);

const scroller = ref(null);
const { x, isScrolling } = useScroll(scroller, { behavior: "smooth" });

const { width: windowWidth } = useWindowSize();
//Temp disable
const scrollTo = (end) => {
    const e = document.getElementById(`scoreboard-end-${end}`);
    const { parentElement: ele } = e;
    x.value = ele?.offsetLeft - windowWidth.value / 4;
};

const score = ref({
    1: {
        home: 0,
        away: 0,
    },
    2: {
        home: 0,
        away: 0,
    },
    3: {
        home: 0,
        away: 0,
    },
    4: {
        home: 0,
        away: 0,
    },
    5: {
        home: 0,
        away: 0,
    },
    6: {
        home: 0,
        away: 0,
    },
    7: {
        home: 0,
        away: 0,
    },
    8: {
        home: 0,
        away: 0,
    },
    9: {
        home: 0,
        away: 0,
    },
    10: {
        home: 0,
        away: 0,
    },
});

const homeColor = ref("blue");
const awayColor = ref("red");

const homeTotal = computed(() =>
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((acc, current) => {
        return (acc += score.value[current].home);
    }, 0)
);
const awayTotal = computed(() =>
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((acc, current) => {
        return (acc += score.value[current].away);
    }, 0)
);

const save = async () => {
    const teamsAndColors = { ...teamSelection.value };
    const scoreCopy = { ...score.value };

    toggleLineScore({ open: false });

    createGame({
        game: {
            home: teamsAndColors?.home?.id,
            away: teamsAndColors?.away?.id,
            home_color: teamsAndColors?.homeColor,
            away_color: teamsAndColors?.awayColor,
            hammer_first_end: teamsAndColors?.home?.id,
        },
        score: scoreCopy,
    });
};

const homeTeam = ref(null);
const awayTeam = ref(null);

const homeId = computed(() => homeTeam?.value?.id);
const awayId = computed(() => awayTeam?.value?.id);

const hammerFirstEndTeam = ref(20);

const createGame = async ({ game, score }) => {
    const gameStore = useGameStore();
    const gameId = await gameStore.insertGame(game);
    if (!gameId) return;
    const ends = generateEnds(
        score,
        game?.hammer_first_end,
        game?.home,
        game?.away,
        gameId
    );

    await gameStore.createGameEnds(ends);
};

const { orientation } = useScreenOrientation();

const currentOrientation = computed(() => {
    return {
        "portrait-primary": "portrait",
        "portrait-secondary": "portrait",
        portrait: "portrait",
        "landscape-primary": "landscape",
        "landscape-secondary": "landscape",
        landscape: "landscape",
    }[orientation.value];
});

const rows = computed(() => {
    return {
        portrait: "10vh 1fr",
        landscape: "100%",
    }[currentOrientation.value];
});

const views = {
    TEAM_SELECT: "teamselect",
    LINESCORE: "linescore",
    CONFIRM: "confirm",
};

const view = ref(null);

onMounted(() => {
    const { editedGame } = editorStore.linescore;
    // if edited game, go directly to view 2: linescore input
    if (editedGame) {
        view.value = views.LINESCORE;
    } else {
        // Go to team select
        view.value = views.TEAM_SELECT;
    }
});

const nav = ref(null);
const { height: navHeight } = useElementSize(nav);

const contentHeight = computed(() => `calc(100% - ${navHeight.value}px)`);
</script>
