<template>
    <DialogFloating @close="toggleLineScore({ open: false })" :backable="false" :loading="loading">

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
                <div class="text-center">{{ headerText }}</div>
                <div
                    class="row items-center justify-center"
                    v-if="showForwardArrow"
                >
                    <q-btn
                        flat
                        round
                        icon="arrow_forward"
                        @click="onForwardArrowClick"
                        :disable="forwardArrowDisabled"
                    />
                </div>
            </div>
        </template>

        <!-- STEP 1: Team Select -->
        <LinescoreTeamSelect
            v-if="view === views.TEAM_SELECT"
            @select="view = views.COLOR_SELECT"
            v-model="teamSelection"
        />
        <!-- STEP 2: Rock color select -->

        <LinescoreColorSelect
            v-else-if="view === views.COLOR_SELECT"
            v-model="teamSelection"
        />

        <!-- STEP 3: Hammer select -->

        <LinescoreHammerSelect
            v-else-if="view === views.HAMMER_SELECT"
            :teamSelection="teamSelection"
            v-model="hammerFirstEndTeam"
        />

        <!-- STEP 4: Line score input -->

        <div
            v-else-if="view === views.LINESCORE"
            class="full-height scoreboard__container"
        >
           <LinescoreGridView ref="nav"
           :game="{
            home: {
                id: teamSelection.home?.id,
                avatar: teamSelection.home?.team_avatar,
                color: teamSelection?.homeColor
            },
            away: {
                id: teamSelection?.away?.id,
                avatar: teamSelection?.away?.team_avatar,
                color: teamSelection?.awayColor
            },
            hammerFirstEnd: hammerFirstEndTeam
            }"
            :endCount="10"
            :score="score"
            :selected="visible"
            @select="scrollTo"

            />

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
import {TABLE_NAMES} from '@/constants/tables'

const teamSelection = ref({
    home: null,
    away: null,
    homeColor: null,
    awayColor: null,
});

const headerText = computed(() => {
    if (view.value === views.TEAM_SELECT) {
        if (!teamSelection.value.home) {
            return "Select your team";
        } else {
            return "Select an opposition";
        }
    } else if (view.value === views.COLOR_SELECT) {
        return "Select rock colors (optional)";
    } else if (view.value === views.HAMMER_SELECT) {
        return "Who won hammer for end 1?";
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
    if (
        [views.COLOR_SELECT, views.LINESCORE, views.HAMMER_SELECT].includes(
            view.value
        )
    )
        return true;
});
const onForwardArrowClick = useThrottleFn(() => {
    if (view.value === views.TEAM_SELECT) {
        if (teamSelection?.value?.away && teamSelection.value?.home) {
            view.value = views.COLOR_SELECT;
        }
    } else if (view.value === views.COLOR_SELECT) {
        view.value = views.HAMMER_SELECT;
    } else if (view.value === views.HAMMER_SELECT) {
        view.value = views.LINESCORE;
    } else if (view.value === views.LINESCORE) {
        view.value = views.CONFIRM;
    }
}, 100);

const forwardArrowDisabled = computed(
    () => view.value === views.HAMMER_SELECT && !hammerFirstEndTeam.value
);

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
    if (
        [
            views.COLOR_SELECT,
            views.HAMMER_SELECT,
            views.LINESCORE,
            views.CONFIRM,
        ].includes(view.value)
    )
        return true;
});

const onBackArrowClick = useThrottleFn(() => {
    if (view.value === views.TEAM_SELECT) {
        if (teamSelection?.value?.away) {
            teamSelection.value.away = null;
        } else if (teamSelection?.value?.home) {
            teamSelection.value.home = null;
        }
    } else if (view.value === views.COLOR_SELECT) {
        view.value = views.TEAM_SELECT;
    } else if (view.value === views.HAMMER_SELECT) {
        view.value = views.COLOR_SELECT;
    } else if (view.value === views.LINESCORE) {
        view.value = views.HAMMER_SELECT;
    }else if (view.value === views.CONFIRM) {

        view.value = views.LINESCORE;
    }
}, 100);

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

const editedId = ref(null)

const save = async () => {
    const teamsAndColors = { ...teamSelection.value };
    const scoreCopy = { ...score.value };
    const hammerFirstEndCopy = hammerFirstEndTeam.value;

    toggleLineScore({ open: false });

    const gameToCreate = {
            home: teamsAndColors?.home?.id,
            away: teamsAndColors?.away?.id,
            home_color: teamsAndColors?.homeColor,
            away_color: teamsAndColors?.awayColor,
            hammer_first_end: hammerFirstEndCopy,
        }

        if (editedId.value) {
            gameToCreate.id = editedId.value;
        }

    createGame({
        game: gameToCreate,
        score: scoreCopy,
    });
};

const homeTeam = ref(null);
const awayTeam = ref(null);

const homeId = computed(() => homeTeam?.value?.id);
const awayId = computed(() => awayTeam?.value?.id);

const hammerFirstEndTeam = ref(0);

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
    if (editedId.value) {
        await gameStore.bulkUpdateGameEnds(ends)
    } else {
   await gameStore.createGameEnds(ends);
    }
 
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
    COLOR_SELECT: "colorselect",
    HAMMER_SELECT: "hammerSelect",
    LINESCORE: "linescore",
    CONFIRM: "confirm",
};

const view = ref(null);

const fetchGame = async (game) => {
    const {id} = game;
    if (!id) {
        console.error('no game to initialize');
        return;
    }

    const gameStore = useGameStore();

    const gameFromStore = await gameStore.getGame(id, true)
    const {away, home, home_color: homeColor, away_color: awayColor, hammer_first_end} = gameFromStore

    teamSelection.value = {
        homeColor, 
        awayColor, 
        home,
        away,
    }
    hammerFirstEndTeam.value = hammer_first_end
    await fetchEndsForGame({
        gameId: id,
        homeId: home?.id,
        awayId: away?.id
    })
}

const fetchEndsForGame = async ({gameId, homeId, awayId}) => {
     const {client, fetchHandler} = useSupabaseFetch();;
            const { data:ends, error } = await fetchHandler(() =>client
                .from(TABLE_NAMES.ENDS)
                .select('*')
                .eq('game_id', gameId))

      ends.forEach((end) => {
        const {end_number: endNo, points_scored: points = 0, scoring_team_id: whoScored} = end;
        if (whoScored === homeId) {
            score.value[endNo].home = points;
        } else if (whoScored === awayId) {
                score.value[endNo].away = points;
        }
      })
}

const loading = ref(    )

onMounted(async () => {
    loading.value = true;
    const { editedGame } = editorStore.linescore;
    // if edited game, go directly to view 2: linescore input
    if (editedGame) {
        view.value = views.LINESCORE;
        editedId.value = editedGame.id;
        await fetchGame(editedGame);
    } else {
        // Go to team select
        view.value = views.TEAM_SELECT;
    }
    loading.value = false;
});

const nav = ref(null);
const { height: navHeight } = useElementSize(nav);

const contentHeight = computed(() => `calc(100% - ${navHeight.value}px)`);
</script>
