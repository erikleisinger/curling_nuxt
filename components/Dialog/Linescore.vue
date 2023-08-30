<template>
    <DialogFloating
        @close="toggleLineScore({ open: false })"
        :backable="false"
        :loading="loading"
        :maxWidth="view === views.LINESCORE  && $q.platform.is.desktop ? 'unset' : '700px'"
    >

        <template v-slot:footer v-if="view !== views.NO_TEAM">
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

        <div v-if="view === views.NO_TEAM" class="full-height full-width row justify-center q-pa-md" style="box-sizing: border-box">
           <div class="column">
            <h1>You aren't on a team!</h1>
            <div>You may only enter linescores for teams on which you are a member.</div>
                   <div class="full-width column items-center q-mt-md">
                    <q-btn rounded color="primary" @click="createTeam">Create new team</q-btn>
                    <q-btn class="q-mt-md" rounded color="primary" @click="searchForTeam">Search existing teams</q-btn>
                   </div>
           </div>
        </div>  

        <!-- STEP 1: Game params -->
        <LinescoreTeamSelect
            v-if="view === views.HOME_SELECT"
            v-model="gameParams.home"
            :restrictIds="userTeams.map(({id}) => id)"
        >
        Select your team
        <template v-slot:subtitle>
            You may only select teams on which you are a member.
        </template>
        </LinescoreTeamSelect>
         <LinescoreTeamSelect
            v-if="view === views.AWAY_SELECT"
            v-model="gameParams.away"
            allowCustom
            :filterIds="[userStore.id]"
        >
    Select an opposition
    <!-- <template v-slot:subtitle>
        If you select a team you are not on, an invitation will be sent to that team.
    </template> -->
         </LinescoreTeamSelect>

        <LinescoreColorSelect v-if="view === views.COLOR_SELECT" v-model="gameParams"/>
        <LinescoreHammerSelect v-if="view === views.HAMMER_SELECT" v-model="gameParams"/>
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
                :colorCode="false"
            />

            <div
                class="scoreboard__score-container row no-wrap"
                id="scoreboard-linescore"
                ref="scroller"
                :style="{ height: contentHeight }"
                v-if="!$q.platform.is.desktop"
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
                        :style="{maxWidth: $q.platform.is.desktop ? `${colWidth()}vw` : 'unset', minWidth: $q.platform.is.desktop ? `${colWidth()}vw` : '26vh'}"
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
                            @shake="concede(end)"
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
                            @click="changeView(+1)"
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
                        :style="{maxWidth: $q.platform.is.desktop ? `${colWidth()}vw` : 'unset', minWidth: $q.platform.is.desktop ? `${colWidth()}vw` : '26vh'}"
                    >
                        <LinescoreColumn
                            v-model="score[end]"
                            :visible="true"
                            :endno="end"
                            :extra="end > endCount"
                            :canExtra="(end >= endCount) && score[end].home !== 'X'"
                            @remove="removeEnd(end)"
                            :shakeable="
                                end < endCount && score[end].home !== 'X'
                            "
                            @shake="concede(end)"
                                       />
                    </div>
       

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
                            @click="changeView(+1)"
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
            :score="{ home: homeTotal, away: awayTotal, finalEndCount: getFinalEndCount(), totalEndCount: endCount }"
            :gameParams="gameParams"
            :startTime="start_time"
            :rink="rink"
            :sheet="sheet"
            v-if="view === views.CONFIRM"
            @save="save"
            @nav="goToView"
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
        <DialogConfirmation
        v-if="!!showInvitation"
        confirmButtonText="Discard"
        cancelButtonText="Cancel"
        @confirm="showInvitation = false"
        @close="showInvitation = false"
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
import {useGameRequestStore} from '@/store/game-requests'
import {useUserTeamStore} from '@/store/user-teams'
import {useUserStore} from '@/store/user'
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
import {views} from '@/constants/linescore'

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

const getFinalEndCount = () => {
    return Object.keys(score.value).reduce((all, current) => {
        if (score.value[current]?.home === 'X' && score.value[current]?.away === 'X') return all;
        return all + 1;
    }, 0)
}

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
})

const changeView = useThrottleFn((inc) => {
    const index = viewOrder.indexOf(view.value);
    if (index + inc < 0 || index + inc > viewOrder.length) return;
    view.value = viewOrder[index + inc];
});

const nextDisabled = computed(() => {
    if (view.value === views.NO_TEAM) return true;
    if (view.value === views.HOME_SELECT) {
        return !gameParams.value.home?.id
    } else if (view.value === views.AWAY_SELECT) {
return !gameParams.value.away?.id && !gameParams.value.away?.name
    }
    return false;
});

const handleNext = () => {
    if (view.value !== views.CONFIRM) {
        changeView(+1);
        return;
    } else if (view.value === views.CONFIRM) {
        save();
    }
}

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

const showInvitation = ref(false)
const saving = ref(false)
const save = async () => {
    const params = { ...gameParams.value };
    const scoreCopy = { ...score.value };
    const rinkCopy = rink.value;
    const sheetCopy = sheet.value;

    let shouldSendInvitation = false

    if (params.away?.id && !userTeams.value.some(({id}) => id === params?.away?.id)) shouldSendInvitation = true;




    toggleLineScore({ open: false });
    const sheetId = await createSheet(rinkCopy?.id, sheetCopy);

    const conceded = score.value[Object.keys(score.value).length].home === "X";

    const gameToCreate = {
        home: params?.home?.id,
        home_color: params?.homeColor,
        away_color: params?.awayColor,
        hammer_first_end: params?.hammerFirstEndTeam === 'away' ? params.away?.id : params?.home?.id,
        end_count: endCount.value,
        completed: false,
        conceded,
        start_time: dayjs(start_time.value, "YYYY MM DD hh mm a").toISOString(),
        rink_id: rink.value?.id,
        sheet_id: sheetId,
    };

    if (!!params?.away?.id) {
        gameToCreate.pending_away = params.away.id;
    } else {
        gameToCreate.placeholder_away = params?.away?.name ?? 'Unnamed Opposition'
    }

    if (editedId.value) {
        gameToCreate.id = editedId.value;
    }

    const gameId = await createGame({
        game: gameToCreate,
        score: scoreCopy,
    });

    if (shouldSendInvitation) {
        useGameRequestStore().sendGameRequest(params.away, gameId)
    }
};

const createGame = async ({ game, score }) => {
    const gameStore = useGameStore();
    const gameId = await gameStore.insertGame(game);
    if (!gameId) return null;
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
    return gameId;
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
  
        if (!userTeams.value.length) {
            view.value = views.NO_TEAM
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

/**
 * Team selection
 */

const userTeamStore = useUserTeamStore();
const userTeams = computed(() => userTeamStore.userTeams)

const userStore = useUserStore();

const createTeam = () => {
    toggleLineScore({open:false});
    nextTick(() => {
        toggleTeamViewer({open: true})
    })
}
const searchForTeam = () => {
    toggleLineScore({open:false});
    nextTick(() => {
        toggleGlobalSearch({
            open: true,
            options: {
                resourceTypes: ['team'],
                inputLabel: 'Search for a team to join',
                callback: (team) => {
                    toggleTeamViewer({open: true, team})
                }
            }
        })
    })
}

/**
 * Desktop linescore input sizing
 */

const colWidth = () => {
    const numEnds = Object.keys(score.value)?.length;
    return 100 / numEnds;
}
</script>
