<template>
    <div
        style="
            z-index: 1;
            transform: translateX(0);
            position: relative;
            overflow: hidden;
        "
        class="full-height"
        v-if="!editedGameId || !isLoadingEditedGame"
       
    >
        <div
            class="nav--container row justify-between full-width"
            style="z-index: 200"
        >
            <q-btn
                icon="arrow_back"
                flat
                round
                @click="goBack"
                v-if="currentStep"
            />
        </div>
        <div class="linescore__container" style="z-index: 100">
            <div
                v-if="view === views.NO_TEAM"
                class="full-height full-width row justify-center q-pa-md"
                style="box-sizing: border-box"
            >
                <div class="column">
                    <h1>You aren't on a team!</h1>
                    <div>
                        You may only enter linescores for teams on which you are
                        a member.
                    </div>
                    <div class="full-width column items-center q-mt-md">
                        <Button
                            rounded
                            color="mint"
                            @click="
                                dialogStore.toggleTeamCreator({ open: true })
                            "
                            >Create new team</Button
                        >
                    </div>
                    <div class="full-width q-mt-md">
                        <strong>If your team already exists</strong
                        ><span
                            >, ask a member of your team to invite you. Once
                            you're on the team, you can enter linescores to your
                            heart's content!</span
                        >
                    </div>
                </div>
            </div>
            <LinescoreEndCountSelect
                v-if="view === views.END_COUNT_SELECT"
                v-model="endCount"
                @select="view = views.HOME_SELECT"
            />
            <LinescoreTeamSelect
                v-if="view === views.HOME_SELECT"
                homeTeam
                v-model="gameParams.home"
                @select="view = views.AWAY_SELECT"
            >
                Select your team
            </LinescoreTeamSelect>
            <LinescoreTeamSelect
                v-if="view === views.AWAY_SELECT"
                v-model="gameParams.away"
                @select="view = views.GAME_PARAMS"
                :filterIds="[gameParams.home?.id]"
            >
                Select opposition
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
                :score="score"
                :canEdit="true"
                :selected="visible"
                :selections="gameParams"
                @scroll="scrollTo"
                v-if="view === views.LINESCORE"
                style="padding-top: 58px; height: 100%"
                :inverted="inverted"
            >
                <template v-slot:scorePrepend>
                    <q-btn
                        flat
                        round
                        icon="change_circle"
                        dense
                        @click="inverted = !inverted"
                    />
                </template>
                <div class="scoreboard--wrap full-height">
                    <div
                        class="scoreboard__container full-height"
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
                                        @endGame="setOver(end)"
                                        :inverted="inverted"
                                         @click="onDesktopScoreClick(end)"
                                       
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
                                        visible === Object.keys(score).length &&
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
                                    <Button
                                        stretch
                                        color="mint"
                                        icon="check"
                                        no-wrap
                                        class="col-grow q-pa-none"
                                        @click="goSummary"
                                        ><span class="q-pl-xs"
                                            >Done</span
                                        ></Button
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
                                    <Button
                                        icon="add"
                                        stretch
                                        class="col-grow q-pa-none"
                                        @click="goExtra"
                                        no-wrap
                                        color="white"
                                        text-color="mint"
                                        v-if="showExtraEnd()"
                                        ><span class="q-pl-xs"
                                            >Extra</span
                                        ></Button
                                    >
                                    <Button
                                        stretch
                                        color="mint"
                                        icon="check"
                                        no-wrap
                                        class="col-grow q-pa-none"
                                        @click="goSummary"
                                        ><span class="q-pl-xs"
                                            >Done</span
                                        ></Button
                                    >
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </LinescoreEditor>
            <LinescoreSummary
                v-model="gameParams"
                v-if="view === views.DETAILS"
                :endCount="endCount"
                :score="score"
                :saving="saving"
            >
                <template v-slot:save>
                    <q-btn
                        icon="check_circle"
                        :style="{ color: getColor('mint') }"
                        size="50px"
                        flat
                        round
                        dense
                        :disable="saving"
                        @click="save"
                    />
                </template>
            </LinescoreSummary>
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
            Are you sure you want to close? All unsaved changes will be lost.
        </DialogConfirmation>
        <div class="blobs--container full-width full-height" style="z-index: 0">
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
    height: calc(100 * var(--vh, 1vh) - $app-header-height-xs);
    @include sm {
        height: calc(100 * var(--vh, 1vh) - $app-header-height-sm);
    }
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
import { useGameRequestStore } from "@/store/game-requests";
import { useUserTeamStore } from "@/store/user-teams";
import { useUserStore } from "@/store/user";
import {useDialogStore} from '@/store/dialog'
import {
    useElementSize,
    useScroll,
    useWindowSize,
    toRefs,
} from "@vueuse/core";
import { views } from "@/presentation/constants/linescore";
import Team from '@/store/models/team';
import Player from '@/store/models/player'
import Game from '@/store/models/game'
import {getFullGame} from '@/business/api/query/game'
import generateLineScore from '@/business/utils/game/generateLineScore'
import cache from '@/service/cache'
import {createOrUpdateGame} from '@/business/api/mutate/game'


const dayjs = useDayjs();
const { getColor } = useColor();
const $q = useQuasar();

const dialogStore = useDialogStore();
const { toggleLineScore, toggleGlobalSearch } = dialogStore;

const inverted = ref(false);

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
    start_time: dayjs().format("YYYY-MM-DD HH:mm"),
    rink: {},
    sheet: null,
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

const validateScore = (endNo) => {
if (score.value[endNo - 1] && score.value[endNo-1].home === 'X') {
        Object.keys(score.value).forEach((key) => {
            if (key < endNo && score.value[key].home === 'X') {
                score.value[key] = {
                    home: 0,
                    away: 0,
                }
            } 
        })
    }
}

const onDesktopScoreClick = (e) => {
    visible.value = e;
    validateScore(e)

    
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


const saving = ref(false);
const saved = ref(false);
const save = async () => {
    saving.value = true;
    const params = { ...gameParams.value };
    const scoreCopy = { ...score.value };
    const rinkCopy = gameParams.value.rink;
    const sheetCopy = gameParams.value.sheet;

    let shouldSendInvitation = false;

    if (
        !params.away?.id ||
        !userTeams.value.some(({ id }) => id === params?.away?.id)
    )
        shouldSendInvitation = true;

        const { toUTC } = useTime();
    const gameToCreate = {
        hammer_first_end: params.hammerFirstEndTeam,
        end_count: endCount.value,
        conceded: conceded.value,
        start_time: toUTC(
            gameParams.value.start_time,
            "YYYY MM DD hh:mm",
            true
        ),
        rink_id: rinkCopy?.id,
    };

      if (editedGameId) {
        gameToCreate.id = editedGameId;
    }

    console.log(gameParams.value.sheet, sheetCopy)

    const {mutate} = useApi();

    const {error, result: gameId} = await mutate(createOrUpdateGame({
        game: gameToCreate,
        sheet_number: sheetCopy?.number,
        score: scoreCopy,
        teams: [
            {
                team_id: params?.home?.id,
                color: params.homeColor,
                pending: false,
            },
            {
                team_id: params?.away?.id ?? 0,
                color: params.awayColor,
                pending: shouldSendInvitation,
                placeholder: params?.away?.id ? null : (params?.away?.name ?? 'Unnamed opposition'),
            },
        ]
    }), {
        progressNotification: editedGameId ? 'Updating game...' : 'Creating game...',
        successNotification: editedGameId ? 'Game updated!' : 'Game created!'
    })


    if (error) {
        saving.value = false;
        console.log("error occured")
        return;
    }

    if (editedGameId) {
        cache.delete(`game-${editedGameId}-info`)
        cache.delete(`game-${editedGameId}-scoreDetails`)
        cache.delete(`game-${editedGameId}-teams`)
    }

    if (shouldSendInvitation && params.away?.id)
        await useGameRequestStore().sendGameRequest(params.away, gameId);

    return navigateTo(`/games/view/${gameId}`);
};

const route = useRoute();
const editedGameId = Number(route.query.gameId);

const loading = ref();

onMounted(async () => {
    loading.value = true;
    if (editedGameId) {
        view.value = views.DETAILS;   
    } else {
        view.value = views.END_COUNT_SELECT;    
    }
    
    
    loading.value = false;
});

/**
 * scoreboard management
 */

const conceded = ref(false);

const concede = (endNo: number) => {
    conceded.value = true;
    over.value = false;
    setEndsX(endNo)
    
};

const over = ref(false)

const setOver = (endNo: number) => {
 conceded.value = false;
    over.value = true;
    setEndsX(endNo)
}

const setEndsX = (num: number) => {
for (
        let x = Number.parseInt(num) + 1;
        x < endNumbers.value.length + 1;
        x++
    ) {
        score.value[x].home = "X";
        score.value[x].away = "X";
    }
    scrollTo(endCount.value);
}

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


const goSummary = () => {
    view.value = views.DETAILS;
};

const goLinescore = () => {
    view.value = views.LINESCORE;
};


const {user: userId} = useUser();



const getPlayerRink = () => {
    return useRepo(Player).with('rink').where('id', userId.value).first()?.rink;;
}

const getHomeRink = () => {
    const rink = useRepo(Team).with('rink').where('id', gameParams.value?.home?.id).first()?.rink;
    return rink;
}

const setRink = () => {
    let newRink;
    const teamRink = getHomeRink();
    if (teamRink?.id) {
        newRink = teamRink;
    } else {
        newRink = getPlayerRink();
    }
    gameParams.value.rink = newRink;
}

watch(() => gameParams.value.home, (val) => {
    if (editedGameId) return;
    setRink();
})

// Edited game

const initEditedGame = async (attempt = 0, data) => {
    if (attempt > 9) return;
    const {isOnTeam} = useTeam();
    const {ends, teams, game} = data;
    const home = teams.find(({team}) => isOnTeam(team.id))
    const away = teams.find(({team}) => team.id !== home?.team?.id)
  
    const {rink, sheet} = useRepo(Game).with('rink').with('sheet').where('id', editedGameId).first()
    if (!rink) setRink();

    const {end_count, hammer_first_end, start_time } = game;

    gameParams.value.home = {
        ...home?.team,
        name: home?.placeholder || home?.team?.name
    };
    gameParams.value.away = {
        ...away?.team,
        name: away?.placeholder || away?.team?.name
    };
    gameParams.value.homeColor = home.color;
    gameParams.value.awayColor = away.color;
    gameParams.value.rink = rink;
    gameParams.value.sheet = sheet;
    gameParams.value.hammerFirstEndTeam = hammer_first_end;

    gameParams.value.start_time = dayjs.unix(start_time).format('YYYY-MM-DD hh:mm')

    const editedScore = generateLineScore(ends, end_count, {...home, team_id: home.team?.id}, {...away, team_id: away?.team?.id});
    score.value = editedScore;
    
    
}

const {fetch} = useApi();

const fetchEnabled = computed(() => !!editedGameId);

const {loading: isLoadingEditedGame} = fetch(getFullGame(editedGameId), {
    enabled: fetchEnabled,
    onComplete: (val) => {
        initEditedGame(0, val)
    }
})




</script>
