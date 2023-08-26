<template>
    <DialogFloating
        @close="toggleLineScore({ open: false })"
        :backable="false"
        :loading="loading"
    >
        <template v-slot:footer>
            <div class="row">
                <q-btn
                    class="col-6"
                    size="lg"
                    square
                    :disable="view === views.GAME_PARAMS"
                    @click="changeView(-1)"
                    >Back</q-btn
                >
                <q-btn
                    class="col-6"
                    size="lg"
                    color="positive"
                    square
                    :disable="nextDisabled"
                    @click="changeView(+1)"
                    >{{
                        view === views.CONFIRM ? "Confirm & save" : "next"
                    }}</q-btn
                >
            </div>
        </template>
        <template v-slot:title> Linescore wizard </template>
        <template v-slot:buttonRight>
            <q-btn flat round icon="close" @click="confirmUnsaved = true" />
        </template>

        <!-- STEP 1: Game params -->
        <LinescoreGameParams
            v-if="view === views.GAME_PARAMS"
            @select="view = views.COLOR_SELECT"
            v-model="gameParams"
        />
        <!-- STEP 2: End count select -->

        <LinescoreEndCountSelect
            v-if="view === views.END_COUNT_SELECT"
            @select="view = views.LINESCORE"
            v-model="endCount"
        />

        <!-- STEP 4: Line score input -->

        <div
            v-else-if="view === views.LINESCORE"
            class="full-height scoreboard__container"
        >
            <LinescoreGridView
                ref="nav"
                :game="{
                    home: gameParams.home,
                    away: gameParams.away,
                    homeColor: gameParams.homeColor,
                    awayColor: gameParams.awayColor,
                    hammerFirstEnd:
                        gameParams.hammerFirstEndTeam === 'away'
                            ? gameParams.away?.id
                            : gameParams?.home?.id,
                }"
                :endCount="endNumbers.length"
                :score="score"
                :selected="visible"
                @select="scrollTo"
            />

            <div
                class="scoreboard__score-container row no-wrap"
                id="scoreboard-linescore"
                ref="scroller"
                :style="{ height: contentHeight }"
            >
                <div class="start__padding col-grow" />

                <ScrollerSection
                    @visible="setVisible(end)"
                    v-for="end in endNumbers"
                    :key="`end-input-${end}`"
                >
                    <div
                        :id="`scoreboard-end-${end}`"
                        class="scoreboard__end-container"
                    >
                        <LinescoreColumn
                            v-model="score[end]"
                            :visible="visible === end"
                            :endno="end"
                            :extra="end > endCount"
                            @remove="removeEnd(end)"
                            :shakeable="
                                end < endCount && score[end + 1].home !== 'X'
                            "
                            @shake="concede"
                        />
                    </div>
                </ScrollerSection>
                <div class="start__padding col-grow" />
                <transition
                    appear
                    enter-active-class=" animated fadeIn"
                    leave-active-class="animated fadeOut"
                >
                    <div
                        class="next-options__container column"
                        v-if="visible === endCount"
                        style="min-width: 10vw"
                    >
                        <q-btn
                            icon="add"
                            stretch
                            class="col-grow q-pa-none"
                            @click="goExtra"
                            no-wrap
                            v-if="showExtraEnd()"
                            ><span class="q-pl-xs">Extra</span></q-btn
                        >
                        <q-btn
                            stretch
                            color="primary"
                            icon="check"
                            no-wrap
                            class="col-grow q-pa-none"
                            @click="onNextClick"
                            ><span class="q-pl-xs">Done</span></q-btn
                        >
                    </div>
                </transition>
            </div>
        </div>

        <LinescoreTimeSelect
            v-if="view === views.DETAILS"
            v-model="start_time"
        />
        <LinescoreRinkAndSheet
            v-if="view === views.DETAILS"
            :rink="rink"
            @update:rink="rink = $event"
            :sheet="sheet"
            @update:sheet="sheet = $event"
        />
        <LinescoreConfirmation
            :score="{ home: homeTotal, away: awayTotal }"
            :gameParams="gameParams"
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
        Are you sure you want to close? All unsaved changes will be lost.
    </DialogConfirmation>
</template>
<style lang="scss" scoped>
$column-width: 26vh;
$gutter-width: 20vw;
$scroll-margin: -100px;
$team-nav-margin: 6vh;

.scoreboard__container {
    width: 100%;
    .scoreboard__score-container {
        scroll-snap-type: x mandatory;
        scroll-snap-stop: always;
        width: 100%;
        border-radius: 8px;
        overflow-y: hidden;
        overflow-x: auto;
        overscroll-behavior: contain;
        .next-options__container {
            position: absolute;
            right: 0;
            height: inherit;
            width: $column-width / 2;
        }
        .start__padding {
            width: calc(100vw / 2 - $column-width / 2);
            height: 100%;
        }
        :deep(.scroller__team--container) {
            position: sticky;
            height: 100%;
            left: 0;
            top: 0;
            padding-left: var(--space-xxxs);

            z-index: 2;
            display: grid;
            grid-template-rows: 1fr 3em 1fr;
            height: 100%;

            .scroller__team {
                display: flex;
                justify-content: center;
                align-items: center;
                .scroller-team__avatar {
                    width: 3em;
                    position: relative;
                    .q-badge {
                        position: absolute;
                        right: 0;

                        &.hammer {
                            top: 0;
                            padding: 2px;
                        }

                        &:not(.hammer) {
                            bottom: 0;
                        }
                    }
                }
            }
        }

        :deep(.scoreboard__end-container) {
            scroll-snap-align: center;
            scroll-snap-stop: always;
            overflow: visible;
            display: grid;
            min-width: $column-width;
            max-width: $column-width;
            grid-template-columns: 100%;
            grid-template-rows: repeat(2, 50%);
            row-gap: 1px;
            height: 100%;
            width: 100%;
            position: relative;
        }
    }
}
</style>
<script setup lang="ts">
import { useDialogStore } from "@/store/dialog";
import { useGameStore } from "@/store/games";
import {
    useElementSize,
    useScroll,
    useSwipe,
    useThrottleFn,
    useWindowSize,
    toRefs,
} from "@vueuse/core";
import { generateEnds } from "@/utils/create-game";
import { parseAvatar } from "@/utils/avatar";
import { TABLE_NAMES } from "@/constants/tables";

const dayjs = useDayjs();
const dialogStore = useDialogStore();
const { toggleLineScore } = dialogStore;

/**
 * Game variables
 */

const gameParams = ref({
    home: {},
    away: {},
    homeColor: "yellow",
    awayColor: "red",
    hammerFirstEndTeam: null,
});

const start_time = ref(dayjs().format("YYYY MM DD hh mm a"));
const rink = ref(null);
const sheet = ref(null);

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
    [...endNumbers.value].reduce((acc, current) => {
        if (score.value[current].home === "X") return acc;
        return (acc += score.value[current].home);
    }, 0)
);
const awayTotal = computed(() =>
    [...endNumbers.value].reduce((acc, current) => {
        if (score.value[current].away === "X") return acc;
        return (acc += score.value[current].away);
    }, 0)
);

const endCount = ref(10);

const endNumbers = computed(() =>
    Object.keys(score.value).map((e) => Number.parseInt(e))
);

/**
 * Update default score when end count changes;
 */

watch(
    endCount,
    (scoreLength) => {
        score.value = {};
        if (!scoreLength) return;
        Array.from({ length: scoreLength }, (_, i) => i + 1).forEach((i) => {
            score.value[i] = {
                home: 0,
                away: 0,
            };
        });
    },
    { immediate: true }
);

/**
 *
 * NAV
 */

const view = ref(null);

const views = {
    GAME_PARAMS: "params",
    END_COUNT_SELECT: "endcount",
    LINESCORE: "linescore",
    DETAILS: "details",
    CONFIRM: "confirm",
};

const viewOrder = [
    views.GAME_PARAMS,
    views.END_COUNT_SELECT,
    views.LINESCORE,
    views.DETAILS,
    views.CONFIRM,
];

const changeView = useThrottleFn((inc) => {
    const index = viewOrder.indexOf(view.value);
    if (index + inc < 0 || index + inc > viewOrder.length) return;
    view.value = viewOrder[index + inc];
});

const nextDisabled = computed(() => {
    if (view.value === views.GAME_PARAMS) {
        const { home, away, hammerFirstEndTeam, homeColor, awayColor } =
            gameParams.value;
        return !(
            (!!home?.name || !!home?.id) &&
            (!!away?.name || !!away?.id) &&
            !!hammerFirstEndTeam &&
            !!homeColor &&
            !!awayColor
        );
    }
    return false;
});

const confirmUnsaved = ref(false);

/**
 * Scroller
 */

const visible = ref(1);

const setVisible = (index) => {
    visible.value = index;
};

const scroller = ref(null);
const { x, isScrolling, arrivedState } = useScroll(scroller, {
    behavior: "smooth",
});
const { right: arrivedRight } = toRefs(arrivedState);

const { width: windowWidth } = useWindowSize();
//Temp disable
const scrollTo = (end) => {
    const e = document.getElementById(`scoreboard-end-${end}`);
    const { parentElement: ele } = e;
    x.value = ele?.offsetLeft - windowWidth.value / 4;
};

/**
 * SAVE
 */

const editedId = ref(null);

const getSheet = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("sheets")
        .select("id")
        .eq("rink_id", rink.value?.id)
        .eq("number", sheet.value);
    const [sheetFromDb] = data || [];
    return sheetFromDb?.id;
};

const createSheet = async (rink_id, sheet_number) => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("sheets")
        .upsert(
            { rink_id, number: sheet_number },
            { onConflict: "rink_id, number" }
        )
        .select("id");
    const [sheetFromDb] = data || [];
    return sheetFromDb?.id;
};

const save = async () => {
    const params = { ...gameParams.value };
    const scoreCopy = { ...score.value };
    const rinkCopy = rink.value;
    const sheetCopy = sheet.value;

    toggleLineScore({ open: false });
    const sheetId = await createSheet(rinkCopy?.id, sheetCopy);

    const conceded = score.value[Object.keys(score.value).length].home === "X";

    const gameToCreate = {
        home: params?.home?.id,
        away: params?.away?.id,
        home_color: params?.homeColor,
        away_color: params?.awayColor,
        hammer_first_end: params?.hammerFirstEndTeam,
        end_count: endCount.value,
        completed: true,
        conceded,
        start_time: dayjs(start_time.value, "YYYY MM DD hh mm a").toISOString(),
        rink_id: rink.value?.id,
        sheet_id: sheetId,
    };

    if (editedId.value) {
        gameToCreate.id = editedId.value;
    }

    createGame({
        game: gameToCreate,
        score: scoreCopy,
    });
};

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
        await gameStore.bulkUpdateGameEnds(ends);
    } else {
        await gameStore.createGameEnds(ends);
    }
};

/**
 * INIT
 */

const fetchGame = async (game) => {
    const { id } = game;
    if (!id) {
        console.error("no game to initialize");
        return;
    }

    const gameStore = useGameStore();

    const gameFromStore = await gameStore.getGame(id, true);
    const {
        away,
        home,
        home_color: homeColor,
        away_color: awayColor,
        hammer_first_end: hammerFirstEndTeam,
    } = gameFromStore;

    gameParams.value = {
        homeColor,
        awayColor,
        home,
        away,
        hammerFirstEndTeam,
    };
    await fetchEndsForGame({
        gameId: id,
        homeId: home?.id,
        awayId: away?.id,
    });
};

const fetchEndsForGame = async ({ gameId, homeId, awayId }) => {
    const { client, fetchHandler } = useSupabaseFetch();
    const { data: ends, error } = await fetchHandler(() =>
        client.from(TABLE_NAMES.ENDS).select("*").eq("game_id", gameId)
    );

    ends.forEach((end) => {
        const {
            end_number: endNo,
            points_scored: points = 0,
            scoring_team_id: whoScored,
        } = end;
        if (whoScored === homeId) {
            score.value[endNo].home = points;
        } else if (whoScored === awayId) {
            score.value[endNo].away = points;
        }
    });
};

const loading = ref();

onMounted(async () => {
    loading.value = true;
    const { editedGame } = dialogStore.linescore;
    if (editedGame) {
        view.value = views.LINESCORE;
        editedId.value = editedGame.id;
        await fetchGame(editedGame);
    } else {
        view.value = views.GAME_PARAMS;
    }
    loading.value = false;
});

/**
 * Calc height of main content
 */

const nav = ref(null);
const { height: navHeight } = useElementSize(nav);
const teamContainer = ref(null);
const { width: teamContainerWidth } = useElementSize(teamContainer);
const contentHeight = computed(() => `calc(100% - ${navHeight.value}px)`);

/**
 * scoreboard management
 */

const concede = (team) => {
    for (
        let x = Number.parseInt(visible.value) + 1;
        x < endNumbers.value.length + 1;
        x++
    ) {
        score.value[x].home = "X";
        score.value[x].away = "X";
    }
    scrollTo(endCount.value);
};

const goExtra = () => {
    const lastEnd = endCount.value;
    if (lastEnd + 1 > 12) return;
    score.value[lastEnd + 1] = {
        home: 0,
        away: 0,
    };
    nextTick(() => {
        scrollTo(lastEnd + 1);
    });
};

const removeEnd = (end) => {
    scrollTo(end - 1);
    setTimeout(() => {
        delete score.value[end];
    }, 100);
};

const showExtraEnd = () => {
    const shouldShow =
        score.value[endCount.value].home !== "X" &&
        homeTotal.value === awayTotal.value;
    return shouldShow;
};
</script>
