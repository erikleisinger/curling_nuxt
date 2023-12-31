<template>
        <div
            style="z-index: 1; transform: translateX(0); position: relative"
            class="full-height"
        >
            <div class="nav--container row justify-between full-width " style="z-index: 200">
                <q-btn
                    icon="arrow_back"
                    flat
                    round
                    @click="goBack"
                    v-if="currentStep"
                />
                <q-btn
                    flat
                    color="green"
                    class="row items-center"
                    @click="save"
                    v-if="view === views.DETAILS && !saved"
                >
                    <q-icon size="xs" name="check" class="q-mr-xs q-pb-xs" />
                    <div>Save game</div>
                </q-btn>
            </div>
            <div class="full-height linescore__container" style="z-index: 100">
                <div
                    v-if="view === views.NO_TEAM"
                    class="full-height full-width row justify-center q-pa-md"
                    style="box-sizing: border-box"
                >
                    <div class="column">
                        <h1>You aren't on a team!</h1>
                        <div>
                            You may only enter linescores for teams on which you
                            are a member.
                        </div>
                        <div class="full-width column items-center q-mt-md">
                            <q-btn
                                rounded
                                color="primary"
                                @click="dialogStore.toggleTeamCreator({open: true})"
                                >Create new team</q-btn
                            >
                        </div>
                        <div class="full-width q-mt-md">
                            <strong>If your team already exists</strong
                            ><span
                                >, ask a member of your team to invite you. Once
                                you're on the team, you can enter linescores to
                                your heart's content!</span
                            >
                        </div>
                    </div>
                  
                </div>
                <LinescoreEndCountSelect
                    v-if="view === views.END_COUNT_SELECT"
                    v-model="endCount"
                    @update:modelValue="view = views.HOME_SELECT"
                />
                <LinescoreTeamSelect
                    v-if="view === views.HOME_SELECT"
                    homeTeam
                    v-model="gameParams.home"
                    @select="view = views.AWAY_SELECT"
                >
                    <h2 class="text-xl text-bold title text-center">
                        Select your team
                    </h2>
                </LinescoreTeamSelect>
                <LinescoreTeamSelect
                    v-if="view === views.AWAY_SELECT"
                    v-model="gameParams.away"
                    @select="view = views.GAME_PARAMS"
                    :filterIds="[gameParams.home?.id]"
                >
                    <h2 class="text-xl text-bold title text-center">
                        Select opposition
                    </h2>
                </LinescoreTeamSelect>
                <LinescoreColorHammerSelect
                    v-if="view === views.GAME_PARAMS"
                    v-model="gameParams"
                    @select="view = views.PRE_GAME"
                />
                <LinescorePreGameSplash
                    v-if="view === views.PRE_GAME"
                    v-model="gameParams"
                    @next="goLinescore"
                />

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
                    @ready="showLinescore = true"
                    :compact="showLinescore && view !== views.DETAILS"
                    v-if="view === views.LINESCORE || view === views.DETAILS"
                    @endcount="view = views.END_COUNT_SELECT"
                    style="padding-top: 58px; height: 100%"
                    :inverted="inverted"
                >
                <template v-slot:scorePrepend>
                    <q-btn flat round icon="change_circle" dense @click="inverted = !inverted"/>
                </template>
                    <div class="scoreboard--wrap full-height">
                        <div
                            class="scoreboard__container full-height"
                            ref="linescoreContainer"
                        >
                            <div
                                class="scoreboard__score-container row no-wrap full-height"
                                id="scoreboard-linescore"
                                ref="scroller"
                                :class="{
                                    'hide-scroll': $q.platform.is.mobile,
                                }"
                                v-if="!$q.platform.is.desktop"
                            >
                                <div
                                    class="start__padding col-grow"
                                    id="scrollstart"
                                />

                                <LinescoreScrollerSection
                                    @visible="setVisible(end)"
                                    v-for="end in endNumbers"
                                    :key="`end-input-${end}`"
                                    :endno="end"
                                >
                                    <div
                                        :id="`scoreboard-end-${end}`"
                                        class="scoreboard__end-container full-height"
                                        :style="{
                                            maxWidth: $q.platform.is.desktop
                                                ? `${colWidth()}`
                                                : 'unset',
                                            minWidth: $q.platform.is.desktop
                                                ? `${colWidth()}`
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
                                            :inverted="inverted"
                                        />
                                    </div>
                                </LinescoreScrollerSection>
                                <div
                                    class="start__padding col-grow"
                                    id="scrollend"
                                />
                                <transition
                                    appear
                                    enter-active-class=" animated fadeIn"
                                    leave-active-class="animated fadeOut"
                                >
                                    <div
                                        class="next-options__container column"
                                        v-if="
                                            visible ===
                                                Object.keys(score).length &&
                                            visible < endCount + 3
                                        "
                                        style="min-width: 10vw"
                                        :style="{
                                            height: `${scrollerHeight}px`,
                                        }"
                                    >
                                        <q-btn
                                            icon="add"
                                            stretch
                                            class="col-grow q-pa-none"
                                            @click="goExtra"
                                            no-wrap
                                            v-if="showExtraEnd()"
                                            ><span class="q-pl-xs"
                                                >Extra</span
                                            ></q-btn
                                        >
                                        <q-btn
                                            stretch
                                            color="primary"
                                            icon="check"
                                            no-wrap
                                            class="col-grow q-pa-none"
                                            @click="goSummary"
                                            ><span class="q-pl-xs"
                                                >Done</span
                                            ></q-btn
                                        >
                                    </div>
                                </transition>
                            </div>
                            <div
                                class="scoreboard__score-container row no-wrap full-height"
                                id="scoreboard-linescore"
                                ref="scroller"
                                v-else
                            >
                                <div
                                    :id="`scoreboard-end-${end}`"
                                    class="scoreboard__end-container"
                                    v-for="end in endNumbers"
                                    :key="`end-input-${end}`"
                                    :style="{
                                        maxWidth: $q.platform.is.desktop
                                            ? `${colWidth()}`
                                            : 'unset',
                                        minWidth: $q.platform.is.desktop
                                            ? `${colWidth()}`
                                            : '26vh',
                                    }"
                                >
                                    <LinescoreColumn
                                        v-model="score[end]"
                                        :visible="true"
                                        :endno="end"
                                        :extra="end > endCount"
                                        :canExtra="
                                            end >= endCount &&
                                            score[end].home !== 'X'
                                        "
                                        @remove="removeEnd(end)"
                                        :shakeable="
                                            end < endCount &&
                                            score[end].home !== 'X'
                                        "
                                        @shake="concede(end)"
                                        @click="onDesktopScoreClick(end)"
                                    />
                                </div>
                                <div style="min-width: 12vw" id="scrollend" />
                                <transition
                                    appear
                                    enter-active-class=" animated fadeIn"
                                    leave-active-class="animated fadeOut"
                                >
                                    <div
                                        class="next-options__container column"
                                        v-if="arrivedRight"
                                        style="min-width: 10vw"
                                        :style="{
                                            height: `${scrollerHeight}px`,
                                        }"
                                    >
                                        <q-btn
                                            icon="add"
                                            stretch
                                            class="col-grow q-pa-none"
                                            @click="goExtra"
                                            no-wrap
                                            v-if="showExtraEnd()"
                                            ><span class="q-pl-xs"
                                                >Extra</span
                                            ></q-btn
                                        >
                                        <q-btn
                                            stretch
                                            color="primary"
                                            icon="check"
                                            no-wrap
                                            class="col-grow q-pa-none"
                                            @click="goSummary"
                                            ><span class="q-pl-xs"
                                                >Done</span
                                            ></q-btn
                                        >
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </div>
                </LinescoreEditor>
            </div>

            <DialogConfirmation
                v-if="!!confirmUnsaved"
                confirmButtonText="Discard"
                cancelButtonText="Cancel"
                @confirm="toggleLineScore({ open: false })"
                @close="confirmUnsaved = false"
                cancelColor=""
                confirmColor="negative"
            >
                Are you sure you want to close? All unsaved changes will be
                lost.
            </DialogConfirmation>
            <div
                class="blobs--container full-width full-height"
                style="z-index: 0"
            >
                <DialogLinescoreBlobs :step="currentStep" />
            </div>
        </div>
</template>
<style lang="scss" scoped>
$column-width: 26vh;
$gutter-width: 20vw;
$scroll-margin: -100px;
$team-nav-margin: 6vh;
$blob-blur: 32px;
.team-details__viewer {
    width: min(100vw, 500px);
    height: min(100vh, 600px);
}
.blobs--container {
    position: absolute;
    z-index: -1;
    top: 0;
    filter: blur($blob-blur);
    -webkit-filter: blur($blob-blur);
    -moz-filter: blur($blob-blur);
    -o-filter: blur($blob-blur);
    -ms-filter: blur($blob-blur);
}
.linescore__container {
    position: relative;
    overflow-x: hidden;


}
    .nav--container {
        position: fixed;
        top: 0;
        padding: var(--space-xs);
    }
.scoreboard--wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
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

            .scoreboard__end-container {
                scroll-snap-align: center;
                scroll-snap-stop: always;
                overflow: visible;
                display: grid;
                min-width: $column-width;
                max-width: $column-width;
                grid-template-columns: 100%;
                grid-template-rows: repeat(2, 50%);
                row-gap: 1px;
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
import { generateEnds, createSheet } from "@/utils/create-game";
import { parseAvatar } from "@/utils/avatar";
import { TABLE_NAMES } from "@/constants/tables";
import { views } from "@/constants/linescore";

const dayjs = useDayjs();
const $q = useQuasar();
const dialogStore = useDialogStore();
const { toggleLineScore, toggleGlobalSearch } = dialogStore;

const inverted = ref(false)

const viewOrder = {
    [views.END_COUNT_SELECT]: 0,
    [views.HOME_SELECT]: 1,
    [views.AWAY_SELECT]: 2,
    [views.GAME_PARAMS]: 3,
    [views.PRE_GAME]: 4,
    [views.LINESCORE]: 5,
    [views.DETAILS]: 6,
};

const currentStep = computed(() => viewOrder[view.value] ?? 0);

const goBack = () => {
    if (currentStep.value === 0) return;
    const currentIndex = Object.keys(viewOrder).indexOf(view.value);
    view.value = Object.keys(viewOrder)[currentIndex - 1];
};

/**
 * Game variables
 */

const gameParams = ref({
    home: {},
    away: {},
    homeColor: "yellow",
    awayColor: "red",
    hammerFirstEndTeam: null,
    start_time: dayjs().format("YYYY-MM-DD hh:mm"),
    rink: {},
    sheet: {},
    league: {},
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

const setEndCount = (num) => {
    endCount.value = num;
    view.value = null;
};

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

const confirmUnsaved = ref(false);

/**
 * Scroller
 */

const visible = ref(1);

const setVisible = (index) => {
    visible.value = index;
};

const onDesktopScoreClick = (e) => {
    visible.value = e;
};

const scroller = ref(null);
const { x, isScrolling, arrivedState } = useScroll(scroller, {
    behavior: "smooth",
});

useEventListener(scroller, "wheel", ({ wheelDeltaY }) => {
    scroller.value.scrollLeft -= wheelDeltaY;
});

const { height: scrollerHeight } = useElementSize(scroller);
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

const saving = ref(false);
const saved = ref(false);
const save = async () => {
    saved.value = true;
    const params = { ...gameParams.value };
    const scoreCopy = { ...score.value };
    const rinkCopy = gameParams.value.rink;
    const sheetCopy = gameParams.value.sheet;
    const leagueCopy = gameParams.value.league;
    const editedIdCopy = editedId.value;

    let shouldSendInvitation = false;

    if (
        !params.away?.id ||
        !userTeams.value.some(({ id }) => id === params?.away?.id)
    )
        shouldSendInvitation = true;

    // toggleLineScore({ open: false });
    const sheetId = await createSheet(rinkCopy?.id, sheetCopy);

    const conceded = score.value[Object.keys(score.value).length].home === "X";
    const { toUTC } = useTime();
    const gameToCreate = {
        home: params?.home?.id,
        home_color: params?.homeColor,
        away_color: params?.awayColor,
        hammer_first_end: params?.hammerFirstEndTeam,
        end_count: endCount.value,
        completed: false,
        conceded,
        start_time: toUTC(
            gameParams.value.start_time,
            "YYYY MM DD hh:mm",
            true
        ),
        rink_id: rinkCopy?.id,
        sheet_id: sheetId,
        league_id: leagueCopy?.id
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

    if (shouldSendInvitation && params.away?.id)
        useGameRequestStore().sendGameRequest(params.away, gameId);

    return navigateTo(`/games/view/${gameId}`);
};

// const createGameStats = async (team_id_param, game_id_param) => {
//     const client = useSupabaseClient();
//     const { data } = await client.rpc("get_team_game_statistics", {
//         team_id_param,
//         game_id_param,
//     });
//     const [stats] = data;
//     if (!stats) return;
//     const { errors } = await client.from("team_stats").insert({
//         ...stats,
//         team_id: team_id_param,
//         game_id: game_id_param,
//     });
//     if (errors) console.error(errors);
// };

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
            view.value = views.END_COUNT_SELECT;
        }

        // view.value = views.CONFIRM
    }
    loading.value = false;
    useEventListener(
        window,
        "popstate",
        useThrottleFn(() => {
            history.go(1);
            if (view.value === views.DETAILS) {
                goBackToLinescore();
            } else if (showLinescore.value) {
                showLinescore.value = false;
            } else {
                view.value = views.END_COUNT_SELECT;
            }
        }, 500)
    );
});

/**
 * Calc height of main content
 */

const nav = ref(null);
const { height: navHeight } = useElementSize(nav);
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


/**
 * Desktop linescore input sizing
 */

const colWidth = () => {
    return "200px";
    // const numEnds = Object.keys(score.value)?.length;
    // return 100 / numEnds;
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
const goLinescore = () => {
    showLinescore.value = true;
    view.value = views.LINESCORE;
};

</script>
