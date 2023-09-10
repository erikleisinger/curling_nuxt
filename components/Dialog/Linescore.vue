<template>
    <DialogFloating
        @close="toggleLineScore({ open: false })"
        :backable="false"
        :loading="loading"
        :maxWidth="
            view === views.LINESCORE && $q.platform.is.desktop
                ? 'unset'
                : '700px'
        "
    >
        <template v-slot:footer v-if="view == views.DETAILS">
            <div class="row">
                <q-btn
                    class="col-6"
                    size="lg"
                    square
                    :disable="view === views.HOME_SELECT"
                    @click="changeView(-1)"
                    >Back</q-btn
                >
                <q-btn
                    class="col-6"
                    size="lg"
                    color="positive"
                    square
                    :disable="nextDisabled"
                    @click="handleNext"
                >
                    {{ "Confirm & save" }}
                </q-btn>
            </div>
        </template>
        <template v-slot:title> Linescore wizard </template>
        <template v-slot:buttonRight>
            <q-btn flat round icon="close" @click="confirmUnsaved = true" />
        </template>

        <div
            v-if="view === views.NO_TEAM"
            class="full-height full-width row justify-center q-pa-md"
            style="box-sizing: border-box"
        >
            <div class="column">
                <h1>You aren't on a team!</h1>
                <div>
                    You may only enter linescores for teams on which you are a
                    member.
                </div>
                <div class="full-width column items-center q-mt-md">
                    <q-btn rounded color="primary" @click="createTeam"
                        >Create new team</q-btn
                    >
                    <q-btn
                        class="q-mt-md"
                        rounded
                        color="primary"
                        @click="searchForTeam"
                        >Search existing teams</q-btn
                    >
                </div>
            </div>
        </div>
        <LinescoreEditor
            v-model="gameParams"
            :score="score"
            @linescore="goBackToLinescore"
            @edit="showLinescore = false"
            :canEdit="true"
            :selected="visible"
            ref="editorContainer"
            @scroll="scrollTo"
            :summary="view === views.DETAILS"
            :canEditDetails="!showLinescore && view === views.DETAILS"
            :compact="showLinescore"
        >
            <div class="scoreboard--wrap" >
                <div class="scoreboard__container" ref="linescoreContainer">
                    <div
                        class="scoreboard__score-container row no-wrap"
                        id="scoreboard-linescore"
                        ref="scroller"
                        :style="{ height: contentHeight }"
                        :class="{ 'hide-scroll': $q.platform.is.mobile }"
                        v-if="!$q.platform.is.desktop"
                    >
                        <div class="start__padding col-grow" id="scrollstart" />

                        <LinescoreScrollerSection
                            @visible="setVisible(end)"
                            v-for="end in endNumbers"
                            :key="`end-input-${end}`"
                            :endno="end"
                        >
                            <div
                                :id="`scoreboard-end-${end}`"
                                class="scoreboard__end-container"
                                :style="{
                                    maxWidth: $q.platform.is.desktop
                                        ? `${colWidth()}vw`
                                        : 'unset',
                                    minWidth: $q.platform.is.desktop
                                        ? `${colWidth()}vw`
                                        : '26vh',
                                }"
                            >
                                <LinescoreColumn
                                    v-model="score[end]"
                                    :visible="visible === end"
                                    :endno="end"
                                    :extra="end > endCount"
                                    @remove="removeEnd(end)"
                                    :shakeable="
                                        end < endCount &&
                                        score[end + 1].home !== 'X'
                                    "
                                    @shake="concede(end)"
                                />
                            </div>
                        </LinescoreScrollerSection>
                        <div class="start__padding col-grow" id="scrollend" />
                        <transition
                            appear
                            enter-active-class=" animated fadeIn"
                            leave-active-class="animated fadeOut"
                        >
                            <div
                                class="next-options__container column"
                                v-if="
                                    visible === Object.keys(score).length &&
                                    visible < endCount + 3
                                "
                                style="min-width: 10vw"
                                :style="{height: `${scrollerHeight}px`}"
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
                                    @click="goSummary"
                                    ><span class="q-pl-xs">Done</span></q-btn
                                >
                            </div>
                        </transition>
                    </div>
                    <div
                        class="scoreboard__score-container row no-wrap"
                        id="scoreboard-linescore"
                        ref="scroller"
                        :style="{ height: contentHeight }"
                        v-else
                    >
                        <div
                            :id="`scoreboard-end-${end}`"
                            class="scoreboard__end-container"
                            v-for="end in endNumbers"
                            :key="`end-input-${end}`"
                            :style="{
                                maxWidth: $q.platform.is.desktop
                                    ? `${colWidth()}vw`
                                    : 'unset',
                                minWidth: $q.platform.is.desktop
                                    ? `${colWidth()}vw`
                                    : '26vh',
                            }"
                        >
                            <LinescoreColumn
                                v-model="score[end]"
                                :visible="true"
                                :endno="end"
                                :extra="end > endCount"
                                :canExtra="
                                    end >= endCount && score[end].home !== 'X'
                                "
                                @remove="removeEnd(end)"
                                :shakeable="
                                    end < endCount && score[end].home !== 'X'
                                "
                                @shake="concede(end)"
                            />
                        </div>
                    </div>
                </div>
                <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                <div class="full-width row justify-center q-mb-sm" v-if="visible !== endCount">
                    <q-btn flat round icon="east" color="primary" @click="scrollTo(endCount)"/>
                </div>
                </transition>
            </div>
        </LinescoreEditor>
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
.scoreboard--wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
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
}
</style>
<script setup lang="ts">
import { useDialogStore } from "@/store/dialog";
import { useGameStore } from "@/store/games";
import { useGameRequestStore } from "@/store/game-requests";
import { useUserTeamStore } from "@/store/user-teams";
import { useUserStore } from "@/store/user";
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
import { views } from "@/constants/linescore";
import team from "tests/__mock__/team";

const dayjs = useDayjs();
const $q = useQuasar();
const dialogStore = useDialogStore();
const { toggleLineScore, toggleTeamViewer, toggleGlobalSearch } = dialogStore;

/**
 * Game variables
 */

const gameParams = ref({
    home: {},
    away: {},
    homeColor: "yellow",
    awayColor: "red",
    hammerFirstEndTeam: null,
    start_time: dayjs().format("YYYY-MM-DD hh:mm a"),
    rink: {},
    sheet: {},
});

const score = ref({});

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

const endCount = ref(8);

const endNumbers = computed(() =>
    Object.keys(score.value).map((e) => Number.parseInt(e))
);

const getFinalEndCount = () => {
    return Object.keys(score.value).reduce((all, current) => {
        if (
            score.value[current]?.home === "X" &&
            score.value[current]?.away === "X"
        )
            return all;
        return all + 1;
    }, 0);
};

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

const viewOrder = [
    views.HOME_SELECT,
    views.AWAY_SELECT,
    views.COLOR_SELECT,
    views.HAMMER_SELECT,
    views.END_COUNT_SELECT,
    views.LINESCORE,
    views.DETAILS,
    views.CONFIRM,
];

const goToView = useThrottleFn((v) => {
    view.value = v;
});

const changeView = useThrottleFn((inc) => {
    transitioning.value = false;
    const index = viewOrder.indexOf(view.value);
    if (index + inc < 0 || index + inc > viewOrder.length) return;
    view.value = viewOrder[index + inc];
});

const nextDisabled = computed(() => {
    if (view.value === views.NO_TEAM) return true;
    if (view.value === views.HOME_SELECT) {
        return !gameParams.value.home?.id;
    } else if (view.value === views.AWAY_SELECT) {
        return !gameParams.value.away?.id && !gameParams.value.away?.name;
    }
    return false;
});

const handleNext = () => {
    if (view.value === views.CONFIRM) {
        save();
        return;
    }

    changeView(+1);
    if (
        view.value === views.HAMMER_SELECT &&
        !gameParams.value.hammerFirstEndTeam
    ) {
        gameParams.value.hammerFirstEndTeam =
            gameParams.value.home?.id || gameParams.value.away?.id;
    }
};

const transitioning = ref(false);

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

const {height: scrollerHeight} = useElementSize(scroller)
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
        .eq("rink_id", gameParams.value.rink?.id)
        .eq("number", gameParams.value.sheet);
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
const saving = ref(false);
const save = async () => {
    const params = { ...gameParams.value };
    const scoreCopy = { ...score.value };
    const rinkCopy = gameParams.value.rink;
    const sheetCopy = gameParams.value.sheet;
    const editedIdCopy = editedId.value;

    let shouldSendInvitation = false;

    if (
        !params.away?.id ||
        !userTeams.value.some(({ id }) => id === params?.away?.id)
    )
        shouldSendInvitation = true;

    toggleLineScore({ open: false });
    const sheetId = await createSheet(rinkCopy?.id, sheetCopy);

    const conceded = score.value[Object.keys(score.value).length].home === "X";

    const gameToCreate = {
        home: params?.home?.id,
        home_color: params?.homeColor,
        away_color: params?.awayColor,
        hammer_first_end:
            params?.hammerFirstEndTeam === "away"
                ? params.away?.id
                : params?.home?.id,
        end_count: endCount.value,
        completed: false,
        conceded,
        start_time: dayjs(
            gameParams.value.start_time,
            "YYYY MM DD hh mm a"
        ).toISOString(),
        rink_id: rinkCopy?.id,
        sheet_id: sheetId,
    };

    if (!!params?.away?.id) {
        gameToCreate.away = params.away.id;
    } else {
        gameToCreate.placeholder_away =
            params?.away?.name ?? "Unnamed Opposition";
    }

    if (editedIdCopy) {
        gameToCreate.id = editedIdCopy.value;
    }

    const gameId = await createGame(gameToCreate);
    if (!gameId) return;

    const ends = generateEnds(
        scoreCopy,
        gameToCreate?.hammer_first_end,
        gameToCreate?.home,
        shouldSendInvitation ? null : gameToCreate?.away,
        gameId
    );
    await createEnds(ends, !!editedIdCopy);

    await createTeamGameJunction(
        { ...gameToCreate, id: gameId },
        shouldSendInvitation
    );

    createGameStats(gameToCreate?.home, gameId);
    createGameStats(shouldSendInvitation ? null : gameToCreate?.away, gameId);

    return navigateTo(`/games/${gameId}`);
};

const createGameStats = async (team_id_param, game_id_param) => {
    const client = useSupabaseClient();
    const { data } = await client.rpc("get_team_game_statistics", {
        team_id_param,
        game_id_param,
    });
    const [stats] = data;
    if (!stats) return;
    const { errors } = await client.from("team_stats").insert({
        ...stats,
        team_id: team_id_param,
        game_id: game_id_param,
    });
    if (errors) console.error(errors);
};

const createTeamGameJunction = async (game, isPending) => {
    const {
        id: game_id,
        home_color,
        away_color,
        home,
        away,
        placeholder_away,
    } = game;
    const { errors } = await useSupabaseClient()
        .from("game_team_junction")
        .insert([
            {
                game_id,
                team_id: home,
                color: home_color,
                pending: false,
            },
            {
                game_id,
                team_id: away,
                color: away_color,
                pending: isPending,
                placeholder: placeholder_away,
            },
        ]);
};

const createGame = async (game) => {
    const gameId = await gameStore.insertGame(game);
    return gameId;
};

const createEnds = async (ends, isEdited) => {
    if (isEdited) {
        await gameStore.bulkUpdateGameEnds(ends);
    } else {
        await gameStore.createGameEnds(ends);
    }
};

/**
 * INIT
 */

const gameStore = useGameStore();

const fetchGame = async (game) => {
    const { id } = game;
    if (!id) {
        console.error("no game to initialize");
        return;
    }

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
    const { editedGame, options } = dialogStore.linescore;

    if (editedGame) {
        view.value = views.LINESCORE;
        editedId.value = editedGame.id;
        await fetchGame(editedGame);
    } else {
        if (options?.homeTeam) {
            gameParams.value.home = options.homeTeam;
            view.value = views.HOME_SELECT;
        } else if (!userTeams.value.length) {
            view.value = views.NO_TEAM;
        } else {
            view.value = views.HOME_SELECT;
        }

        // view.value = views.CONFIRM
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

const concede = (endNo: number) => {
    for (
        let x = Number.parseInt(endNo) + 1;
        x < endNumbers.value.length + 1;
        x++
    ) {
        score.value[x].home = "X";
        score.value[x].away = "X";
    }
    scrollTo(endCount.value);
};

const goExtra = () => {
    const lastEnd = Object.keys(score.value)?.length;
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

/**
 * Team selection
 */

const userTeamStore = useUserTeamStore();
const userTeams = computed(() => userTeamStore.userTeams);

const userStore = useUserStore();

const createTeam = () => {
    toggleLineScore({ open: false });
    nextTick(() => {
        toggleTeamViewer({ open: true });
    });
};
const searchForTeam = () => {
    toggleLineScore({ open: false });
    nextTick(() => {
        toggleGlobalSearch({
            open: true,
            options: {
                resourceTypes: ["team"],
                inputLabel: "Search for a team to join",
                callback: (team) => {
                    toggleTeamViewer({ open: true, team });
                },
            },
        });
    });
};

/**
 * Desktop linescore input sizing
 */

const colWidth = () => {
    const numEnds = Object.keys(score.value)?.length;
    return 100 / numEnds;
};

const updateEndCount = (inc) => {
    if (endCount.value + inc < 6 || endCount.value + inc > 10) return;
    endCount.value += inc;
};
const showLinescore = ref(false);
const linescoreContainer = ref(null);
const editorContainer = ref(null);
const { height: editorHeight } = useElementSize(editorContainer);

const linescoreHeight = computed(
    () => `calc(100% - ${editorHeight.value}px - 20x)`
);

const goSummary = () => {
    showLinescore.value = false;
    view.value = views.DETAILS;
};

const goBackToLinescore = () => {
    showLinescore.value = true;
    view.value = null;
};
</script>
