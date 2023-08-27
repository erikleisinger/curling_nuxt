<template>
    <AreaSearch
        v-if="showSearch"
        :resourceTypes="['team']"
        inputLabel="Search for a team"
        @select="selectTeam"
        style="position: fixed; top: 0; z-index: 1000; background-color: white"
    >
        <template v-slot:before>
            <q-btn flat round icon="close" @click="showSearch = false" />
        </template>
    </AreaSearch>
    <div class="season__wrap" ref="seasonContainer">
    <header ref="header">
        <div class="q-pa-lg bg-primary">
            <h1 class="text-xl text-bold full-width text-center text-white">
                2023-2024 Season
            </h1>
            <h2 class="text-md full-width text-center">
                <ProfileChip :id="user.id" :username="user.username" />
            </h2>
        </div>
        
    </header>
    <nav class="season__tabs">
        <q-tabs
            dense
            stretch
            active-bg-color="primary"
            active-color="white"
            indicator-color="white"
            v-model="tab"
      
        >
            <q-route-tab name="overview" label="Overview" style="width: 33.34%" to="#overview" />
            <q-route-tab
                name="games"
                label="Games"
                style="width: 33.34%"
                :disable="!teams?.length"
                to="#games"
            />
            <q-route-tab
                name="stats"
                label="Stats"
                style="width: 33.34%"
                :disable="!teams?.length"
                to="#stats"
            />
        </q-tabs>
    </nav>
    <main class="season-content__container" >
        <div
            class="column teams__container"
            ref="teamContainer"
            v-if="tab == 'stats'"
        >
            <div
                class="teams-title column"
                :class="{ mini: isMini }"
                v-if="teams?.length"
            >
                <div class="row">
                    <span class="text-md text-bold" v-if="tab === 'overview'"
                        >My Teams</span
                    >
                    <!-- <span class="text-sm" v-if="tab === 'games'"
                        >Click a team to show only their games.</span
                    > -->

                    <!-- <q-btn
                        flat
                        round
                        :icon="editingTeams ? 'close' : 'edit'"
                        size="sm"
                        color="grey-7"
                        @click="setView('manage')"
                    /> -->
                </div>
            </div>
            <div class="row no-wrap teams__scroller" :class="{ mini: isMini }">
                <!-- NO TEAMS -->
                <div
                    v-if="!teams?.length"
                    class="column full-width items-center"
                >
                    <div>Looks like you don't have any teams.</div>
                    <div style="width: fit-content">
                        <q-btn
                            rounded
                            color="deep-purple"
                            icon="add"
                            @click="showSearch = true"
                            >Add team</q-btn
                        >
                    </div>
                </div>

                <!-- TEAM LIST -->

                <div
                    v-for="team in teams"
                    :key="team.id"
                    class="column items-center no-wrap team__container"
                    @click="handleTeamClick(team)"
                    :class="{ selected: visibleTeams.includes(team.id) }"
                >
                    <div class="avatar-container">
                        <TeamAvatar :team="team" />
                    </div>
                    <div class="team-name truncate-text">{{ team.name }}</div>
                </div>
            </div>
        </div>
        <div v-if="tab === 'overview'" :style="{ height: scrollerHeight }">
           
            <ChartTeamWinLoss
                :wins="filteredRecord?.wins ?? 0"
                :losses="filteredRecord?.lossess ?? 0"
                :ties="filteredRecord?.ties ?? 0"
                v-if="!loading"
                
            />
           
            <AreaManage/>
        </div>
        <div :style="{ height: scrollerHeight }" class="game-result__container" v-if="tab === 'games'">
            <q-infinite-scroll
            :disable="visibleGames.length < 4"
                @load="scrollLoad"
                :offset="20"
                :scroll-target="seasonContainer"
                
            >
                <template v-slot:loading>
                    <div class="row justify-center q-my-md">
                        <q-spinner-dots
                            color="primary"
                            size="40px"
                        ></q-spinner-dots>
                    </div>
                </template>
                <q-pull-to-refresh @refresh="refreshGames" :scroll-target="seasonContainer">
                    <TeamGameResult
                        v-for="game in visibleGames"
                        :key="game.id"
                        :result="game"
                        @expand="expandItem(game.id)"
                        :expanded="expanded === game.id"
                        @update="updateResult($event, game.id)"
                        @remove="removeResult(game.id)"
                    >
                        <!-- <div
                            style="
                                position: absolute;
                                height: 100%;
                                width: 100%;
                             
                                z-index: 1;
                            "
                            @click="viewTeam"
                        /> -->
                    </TeamGameResult>
                </q-pull-to-refresh>
            </q-infinite-scroll>

            <!-- <q-btn v-else @click="refreshGames">Refresh</q-btn> -->
        </div>
    </main>
    </div>
</template>
<style lang="scss" scoped>
.season__wrap {
height: 100%;
overflow: auto;
.season__tabs {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: $z-tools;
}
}
.game-result__container {
    padding: var(--space-sm) 0px;
    max-width: 600px;
    margin: auto;
}
.profile__wrap {
    padding: var(--space-sm);
    border-bottom: 1px solid $grey-4;
}
.season-content__container {
    min-height: v-bind(mainHeight);
    overflow: auto;
    position: relative;
    max-width: 100%;
    // background-color: rgba(31, 0, 24, 0.2);
    .teams__container {
        position: sticky;
        top: 0;
        z-index: 1;
        background-color: white;
        width: 100%;

        .teams-title {
            margin: var(--space-xxs) var(--space-sm) 0px var(--space-sm);
            transition: all 0.2s;
            overflow: hidden;
            &.mini {
                max-height: 0px;
                margin: unset;
            }
        }
        .teams__scroller {
            overflow-x: auto;
            width: inherit;

            padding: var(--space-xs);

            .team__container {
                max-width: 100px;
                transition: all 0.2s;
                padding: var(--space-xs);
                margin: 0px var(--space-xxxxs);
                position: relative;
                .team-delete__overlay {
                    position: absolute;
                    height: 100%;
                    width: 100%;
                    z-index: 1;
                    background-color: rgba(0, 0, 0, 0.3);
                    border-radius: 8px;
                    margin-top: -8px;
                    pointer-events: all;
                }
                .team-name {
                    width: 100%;
                    max-height: auto;
                    transition: all 0.2s;
                    font-size: var(--text-sm);
                }
                .avatar-container {
                    width: 40px;
                    transition: all 0.2s;
                }
                &.selected {
                    background-color: rgba(255, 86, 252, 0.2);
                    border-radius: 8px;
                }
            }

            &.mini {
                padding: var(--space-xxxxs);
                padding-bottom: 0px;
                .team_container {
                    max-width: 4ch;
                }
                .team-name {
                    max-height: 0px;
                    width: 0px;
                }
                .avatar-container {
                    width: 40px;
                }
            }
        }
    }
}
.team-viewer__container {
    position: absolute;
    height: 100px;
    width: 100px;
    z-index: $z-dialog;
}
</style>
<script setup>
import { useUserStore } from "@/store/user";
import { useDialogStore } from "@/store/dialog";
import { useUserTeamStore } from "@/store/user-teams";
import { useNotificationStore } from "@/store/notification";
import { useNavigationStore } from "@/store/navigation";
import { useElementBounding, useScroll, useThrottleFn } from "@vueuse/core";
import { parseAvatar } from "@/utils/avatar";

const userTeamStore = useUserTeamStore();

const tab = ref("overview");

const loading = ref(false);

const visibleTeams = ref([]);

const setVisibleTeam = (teamId) => {
    const index = visibleTeams.value.findIndex((id) => id === teamId);
    if (index !== -1) {
        visibleTeams.value.splice(index, 1);
    } else {
        visibleTeams.value.push(teamId);
    }
};

const visibleGames = computed(() => {
    if (!visibleTeams?.value?.length) return games.value ?? [];
    return [...games.value].filter((game) => {
        return (
            visibleTeams.value.includes(game.home_id) ||
            visibleTeams.value.includes(game.away_id)
        );
    });
});

/**
 * team record
 */

const wins = ref(0);
const losses = ref(0);
const ties = ref(0);

const winLossRecord = ref([]);

const filteredRecord = computed(() => {

    const defaultRecord = {
            wins: 0,
            losses: 0,
            ties: 0,
        }
    if (!winLossRecord?.value?.length || !teams.value.length) return defaultRecord;
    return winLossRecord?.value.reduce(
        (all, current) => {
            if (
                !visibleTeams?.value?.length ||
                visibleTeams.value?.includes(current.team_id)
            )
                return {
                    wins: (all.wins += current.wins),
                    losses: (all.losses += current.losses),
                    ties: (all.ties += current.ties),
                };
            return all;
        },
        defaultRecord
        
    );
});

const getWinsLossess = async () => {
    const { client, fetchHandler } = useSupabaseFetch();
    const { data } = await fetchHandler(
        () =>
            client.rpc("get_team_wins", {
                team_ids_param: teams.value.map(({ id }) => id),
            }),
        { onError: "Error fetching data" }
    );
    // data.forEach((team) => {
    //     wins.value += team.wins;
    //     losses.value += team.losses;
    //     ties.value += team.ties;
    // })

    winLossRecord.value = data;
};

/**
 * BEGIN games
 */

const games = ref([]);

const teams = computed(() => userTeamStore.userTeams)

const setGames = (gamesToSet) => {
    games.value = gamesToSet.reduce((all, current) => {
        if (all.some(({ id }) => id === current.id)) return all;
        return [...all, current];
    }, []);
};

const setTab = () => {
    const route = useRoute();
    if (!route.hash) {
        navigateTo('#overview')
    }
    console.log(route.hash)

}

const init = async () => {
    loading.value = true;
    setTab();
    const teamIds = teams.value.map(({ id }) => id);
    if (!teamIds || !teamIds?.length) {
        games.value = [];
    } else {
    const gameResults = await getPaginatedGames();
    setGames(gameResults);
    await getWinsLossess();
    }

    loading.value = false;
};

const fetchingGames = ref(false);
const startIndex = ref(null);
const endIndex = ref(null);

const paginationEnd = ref(false);

const PAGINATION_SIZE = 5;

const getPaginatedGames = useThrottleFn(async () => {
    if (fetchingGames.value || paginationEnd.value) return []
    fetchingGames.value = true;

    if (startIndex.value === null) {
        startIndex.value = 0;
    } else {
        startIndex.value += PAGINATION_SIZE;
    }
    if (endIndex.value === null) {
        endIndex.value = 5;
    } else {
        endIndex.value += PAGINATION_SIZE;
    }

    const { getTeamGames } = useGame();

    const teamIds = teams.value.map(({ id }) => id);

    const gameResults = await getTeamGames(
        teamIds,
        startIndex.value,
        endIndex.value
    );
    if (!gameResults.length) paginationEnd.value = true;
    fetchingGames.value = false;
    return gameResults;
}, 100);

onMounted(async () => {
    init();
});

watch(teams, () => {
    getWinsLossess();
}, {deep: true})

/**
 * update games
 */

const refreshGames = async (done) => {
    startIndex.value = null;
    endIndex.value = null;
    const gameResults = await getPaginatedGames();
    console.log(gameResults)
    setGames(gameResults);
    done();
};


const updateResult = (updatedResult, gameId) => {
    const index = games.value.findIndex(({id}) => id === gameId);
    if (index === -1) return;
    games.value.splice(index, 1, updatedResult)
}

const removeResult = (gameId) => {
     const index = games.value.findIndex(({id}) => id === gameId);
     if (index === -1) return;
    games.value.splice(index, 1)
}


/**
 * BEGIN element height calculations
 */

const header = ref(null);
const { height: headerHeight } = useElementBounding(header);
const mainHeight = computed(() => `calc(100% - ${headerHeight.value}px)`);

const teamContainer = ref(null);
const { height: teamContainerHeight } = useElementBounding(teamContainer);
const scrollerHeight = computed(
    () => `calc(100% - ${teamContainerHeight.value}px)`
);

/**
 * END element height calculations
 */

/**
 * BEGIN profile information
 */

const userStore = useUserStore();
const user = computed(() => {
    const {
        id,
        timezone,
        friendId,
        username,
        player,
        firstName,
        lastName,
        avatar,
    } = userStore;
    return {
        id,
        timezone,
        friendId,
        username,
        player,
        firstName,
        lastName,
        avatar,
    };
});

/**
 * END profile information
 */

/**
 * BEGIN utility
 */

const { logout } = useSession();

/**
 * END utility
 */

/**
 * BEGIN scroll
 */

const isMini = ref(false);

const setMini = useThrottleFn((bool) => {
    isMini.value = bool;
    if (isMini.value) editingTeams.value = false;
}, 100);

const seasonContainer = ref(null);

const scrollLoad = async (index, done) => {
    console.log(seasonContainer.value.scrollTop)
    if (seasonContainer.value.scrollTop === 0) return;
 
    const gameResults = await getPaginatedGames();
    setGames([...games.value, ...gameResults]);
    done();
};

const { arrivedState, y } = useScroll(seasonContainer, {
    onScroll: async () => {
        const mini = y.value > 100;
        if (mini !== isMini.value) setMini(y.value > 100);
    },
});

/**
 * END scroll
 */

const expanded = ref(null);
const expandItem = (id) => {
    if (expanded.value === id) {
        expanded.value = null;
    } else {
        expanded.value = id;
    }
};

const editingTeams = ref(false);

const showSearch = ref(false);

const selectTeam = (team) => {
    showSearch.value = false;
    addTeam(team);
    editingTeams.value = false;
};

const { setView } = useNavigationStore();

const handleTeamClick = (team) => {
    // setVisibleTeam(team.id);
    //     if (tab.value === 'games') {
    //  setVisibleTeam(team.id)
    //     } else if (tab.value === 'overview') {
    //         useDialogStore().toggleTeamViewer({open: true, team})
    //     }
};
</script>
