<template>
    <div class="row no-wrap" style="overflow: hidden">
        <q-inner-loading :showing="loadingComparison" color="primary" />

        <div class="overview__container row" key="overview">
            <div v-if="pendingTeamRequest && !comparisonTeam" class="pending-request__container">
                <div>You have been invited to join team {{team.name}}!</div>
                <div class="row">
                    <q-btn class="col-6" square color="red" flat @click="respondToRequest(false)">Decline</q-btn>
                    <q-btn class="col-6" square color="green" flat @click="respondToRequest(true)">Accept</q-btn>
                </div>

            </div>
            <div class="back-button__container" v-if="comparisonTeam">
                <q-btn flat round icon="arrow_back" @click="endComparison" />
            </div>
            <header
                class="row justify-center col-12"
                
            >
            <div class="compare__container">
                 <q-btn flat round icon="compare_arrows" color="grey-8"
                           
                            v-if="!comparisonTeam"
                            :label="$q.screen.xs ? '' : 'Team comparison'"
                            @click="
                                toggleGlobalSearch({
                                    open: true,
                                    options: {
                                        inputLabel:
                                            'Search for a team to compare',
                                        resourceTypes: ['team'],
                                        callback: onSelect,
                                        filterIds: [team.id],
                                    },
                                })
                            "
                        >
                           
                 </q-btn>
            </div>
                <div
                    class="full-width row justify-center team-view-options__container"
                    v-if="!!comparisonTeam"
                >
                    <q-btn-toggle
                        v-model="teamViewMode"
                        class="my-custom-toggle"
                        no-caps
                        rounded
                        unelevated
                        toggle-color="primary"
                        color="white"
                        text-color="primary"
                        :options="[
                            { label: 'Head to head', value: 'h2h' },
                            { label: 'All time totals', value: 'total' },
                        ]"
                        :readonly="!h2hOpposition || !h2hTeam"
                    >
                        <q-tooltip v-if="!h2hOpposition || !h2hTeam">
                            {{ team.name }} and {{ comparisonTeam.name }} have
                            not played any games.
                        </q-tooltip>
                    </q-btn-toggle>
                </div>
                <div
                    class="row no-wrap"
                    :class="{
                        'justify-between': !!comparisonTeam,
                        'justify-center': !comparisonTeam,
                        'col-12': !!comparisonTeam || $q.screen.xs,
                        'col-6': !comparisonTeam && !$q.screen.xs,
                    }"
                >
                    <div
                        class="column team__header items-center"
                        :class="comparisonTeam ? 'col-6' : 'col-12'"
                    >
                        <div class="avatar__container q-mb-sm">
                            <TeamAvatar :team="team" :viewable="false" />
                        </div>

                        <div class="column items-center">
                            <div class="text-sm">Team</div>
                            <h2 class="text-sm text-bold text-center">
                                {{ team.name }}
                            </h2>
                        </div>
                    </div>

                    <div
                        class="column team__header items-center col-6"
                        v-if="comparisonTeam"
                    >
                        <div class="avatar__container q-mb-sm">
                            <LazyTeamAvatar :team="comparisonTeam" />
                        </div>

                        <div class="column items-center">
                            <div class="text-sm">Team</div>
                            <h2
                                class="text-sm text-bold text-center"
                                style="white-space: nowrap"
                            >
                                {{ comparisonTeam.name }}
                            </h2>
                        </div>
                    </div>
                </div>
                <div class="row justify-around col-12 q-mt-md">
                    <TeamAttribute
                        title="Games played"
                        icon="track_changes"
                        color="primary"
                        class="col-5"
                    >
                        <div class="row no-wrap items-center">
                            <div>
                                {{
                                    headToHead
                                        ? h2hTeam.games_played
                                        : team.games_played
                                }}
                            </div>
                            <h2
                                class="text-xs text-underline clickable q-pl-sm"
                                style="margin-top: 1px"
                                @click="browseGames"
                                v-if="teamViewMode !== 'total'"
                            >
                                Browse
                            </h2>
                        </div>
                    </TeamAttribute>
                    <LazyTeamAttribute
                        title="Head to head"
                        color="red"
                        icon="leaderboard"
                        class="col-5"
                        v-if="headToHead"
                    >
                        <div class="row items-center">
                            <div class="q-mr-xs">
                                <span
                                    v-if="h2hTeam?.win !== h2hOpposition?.win"
                                >
                                    +{{
                                        Math.abs(
                                            h2hTeam?.win - h2hOpposition?.win
                                        )
                                    }}
                                </span>
                                <span v-else-if="!h2hTeam && !h2hOpposition"
                                    >-</span
                                >
                                <span v-else>Even</span>
                            </div>
                            <div
                                style="height: 1em; width: 1em"
                                v-if="h2hTeam?.win !== h2hOpposition?.win"
                            >
                                <LazyTeamAvatar
                                    :team="
                                        h2hTeam?.win > h2hOpposition?.win
                                            ? h2hTeam
                                            : h2hOpposition
                                    "
                                />
                            </div>
                        </div>
                        <template v-slot:tooltip>
                            <q-tooltip v-if="$q.platform.is.desktop">
                                <div v-if="!!h2hTeam && !!h2hOpposition">
                                    <div>
                                        <span class="text-bold">{{
                                            h2hTeam.name
                                        }}</span
                                        >: {{ h2hTeam.win }} wins
                                    </div>
                                    <div>
                                        <span class="text-bold">{{
                                            h2hOpposition.name
                                        }}</span
                                        >: {{ h2hOpposition.win }} wins
                                    </div>
                                    <div>
                                        <span class="text-bold">Ties</span>:
                                        {{ h2hTeam.tie }}
                                    </div>
                                </div>
                                <div v-else>
                                    {{ team.name }} and
                                    {{ comparisonTeam.name }} have played no
                                    games.
                                </div>
                            </q-tooltip>
                        </template>
                    </LazyTeamAttribute>

                    <LazyTeamAttribute
                        title="Games played"
                        icon="track_changes"
                        color="primary"
                        class="col-5"
                        v-if="comparisonTeam && !headToHead"
                    >
                        {{
                            headToHead
                                ? h2hOpposition.games_played
                                : comparisonTeam.games_played
                        }}
                    </LazyTeamAttribute>
                    <LazyTeamAttribute
                        title="Win percentage"
                        color="amber"
                        icon="emoji_events"
                        class="col-5"
                        v-if="!headToHead"
                    >
                        <span v-if="team.games_played">
                            {{
                                headToHead
                                    ? getStatPercent(
                                          h2hTeam.win,
                                          h2hTeam.games_played
                                      )
                                    : getStatPercent(
                                          team.win,
                                          team.games_played
                                      )
                            }}%
                        </span>
                        <span v-else>-</span>

                        <span
                            class="text-xs text-regular text-grey-8"
                            v-if="
                                (headToHead && h2hTeam.tie) ||
                                (!headToHead && team.tie)
                            "
                            >({{
                                headToHead
                                    ? getStatPercent(
                                          h2hTeam.tie,
                                          h2hTeam.games_played
                                      )
                                    : getStatPercent(
                                          team.tie,
                                          team.games_played
                                      )
                            }}% tie)</span
                        >
                    </LazyTeamAttribute>
                    <LazyTeamAttribute
                        title="Win percentage"
                        color="amber"
                        icon="emoji_events"
                        class="col-5"
                        v-if="!!comparisonTeam && !headToHead"
                    >
                        {{
                            headToHead
                                ? getStatPercent(
                                      h2hOpposition.win,
                                      h2hOpposition.games_played
                                  )
                                : getStatPercent(
                                      comparisonTeam.win,
                                      comparisonTeam.games_played
                                  )
                        }}%

                        <span
                            class="text-xs"
                            v-if="
                                (headToHead && h2hOpposition.tie) ||
                                (!headToHead && comparisonTeam.tie)
                            "
                            >({{
                                headToHead
                                    ? getStatPercent(
                                          h2hOpposition.tie,
                                          h2hOpposition.games_played
                                      )
                                    : getStatPercent(
                                          comparisonTeam.tie,
                                          comparisonTeam.games_played
                                      )
                            }}%)</span
                        >
                    </LazyTeamAttribute>
                    <LazyTeamAttribute
                        title="Points per game"
                        v-if="!comparisonTeam"
                        class="col-5"
                        icon="sym_o_counter_1"
                        color="blue"
                    >
                        <span v-if="team.games_played">
                            {{
                                `${
                                    team.points_for / team.games_played -
                                        team.points_against /
                                            team.games_played >
                                    0
                                        ? "+"
                                        : ""
                                }${(
                                    team.points_for / team.games_played -
                                    team.points_against / team.games_played
                                ).toFixed(1)}`
                            }}
                            <span class="text-xs text-regular text-grey-8">{{
                                `(${(
                                    team.points_for / team.games_played
                                ).toFixed(1)} - ${(
                                    team.points_against / team.games_played
                                ).toFixed(1)})`
                            }}</span>
                        </span>
                        <span v-else>-</span>
                    </LazyTeamAttribute>
                    <LazyTeamAttribute
                        v-if="!comparisonTeam"
                        title="Ends per game"
                        class="col-5"
                        color="blue"
                        icon="filter_1"
                    >
                        <span v-if="team.games_played">
                            {{
                                `${
                                    team.ends_for / team.games_played -
                                        team.ends_against / team.games_played >
                                    0
                                        ? "+"
                                        : ""
                                }${(
                                    team.ends_for / team.games_played -
                                    team.ends_against / team.games_played
                                ).toFixed(1)}`
                            }}
                            <span class="text-xs text-regular text-grey-8">{{
                                `(${(team.ends_for / team.games_played).toFixed(
                                    1
                                )} - ${(
                                    team.ends_against / team.games_played
                                ).toFixed(1)})`
                            }}</span>
                        </span>
                        <span v-else>-</span>

                        <template v-slot:tooltip>
                            <q-tooltip v-if="$q.platform.is.desktop">
                                <div>
                                    <span class="text-bold"
                                        >Avg ends won:
                                    </span>
                                    {{
                                        (
                                            team.ends_for / team.games_played
                                        ).toFixed(1)
                                    }}
                                </div>
                                <div>
                                    <span class="text-bold"
                                        >Avgs ends lost:
                                    </span>
                                    {{
                                        (
                                            team.ends_against /
                                            team.games_played
                                        ).toFixed(1)
                                    }}
                                </div>
                            </q-tooltip>
                        </template>
                    </LazyTeamAttribute>
                </div>
                <!-- Comparison stats -->
                <div
                    class="row full-width justify-around"
                    v-if="(comparisonTeam || h2hTeam) && headToHead"
                ></div>
            </header>

            <main class="main__content">
              
              <!-- Team players -->

                <div v-if="!comparisonTeam">
                    
                
                    <LazyTeamPlayerList
                        :players="players"
                       
                        :teamId="team.id"
                    >
                        <template v-slot:title="{ editing, setEditing }" >
                            <div class="row justify-between items-end q-my-sm">
                        <div class="row items-center">
                            <q-icon
                                name="groups_2"
                                color="primary"
                                class="text-md q-mr-sm"
                            />
                            <h2 class="text-md text-bold">Team members</h2>
                        </div>
                        <div v-if="isAuthorized">
                            <q-btn
                                :icon="editing ? 'close' : 'edit'"
                                flat
                                round
                                dense
                                :color="editing ? 'blue' : 'grey-7'"
                                padding="4px"
                                @click="setEditing(!editing)"
                            />
                        </div>
                    </div>
                        <q-separator />
                        </template>
                    </LazyTeamPlayerList>
                </div>

                  <div>
                    <!-- BADGES -->
                    <div v-if="!comparisonTeam">
                        <div class="row justify-between items-end q-my-sm">
                            <div class="row items-center">
                                <q-icon
                                    name="token"
                                    color="amber"
                                    class="text-md q-mr-sm"
                                />
                                <h2 class="text-md text-bold">Badges</h2>
                            </div>
                        </div>
                        <q-separator />
                        <div class="row badge__container">
                            <div
                                class="badge"
                                v-for="badge in badges"
                                :key="badge"
                            >
                                <LazyBadge :badge="badge" height="3em" />
                            </div>
                            <div
                                v-if="!badges?.length"
                                class="text-sm full-width text-center text-italic"
                            >
                                {{ team.name }} is working on it.
                            </div>
                        </div>
                    </div>
                    <!-- END BADGES -->
                </div>

                <div>
                    <!-- STATS-->

                    <div class="row items-end justify-between q-my-sm">
                        <div class="row items-center">
                            <q-icon
                                color="blue"
                                name="insights"
                                class="text-md q-mr-sm q-mt-xs"
                            />
                            <div>
                                <h3 class="text-md text-bold">Stats</h3>
                            </div>
                        </div>

                       
                    </div>
                    <q-separator />

                    <div class="stats-view__container">
                        <LazyTeamStatsView
                            :team="headToHead ? h2hTeam : team"
                            v-if="team"
                            key="stats"
                            viewerHeight="400px"
                            :oppositionTeam="
                                headToHead ? h2hOpposition : comparisonTeam
                            "
                        >
                        </LazyTeamStatsView>
                    </div>
                </div>
                <!-- RESULTS -->
                <!-- :class="{
                            'full-column': !!comparisonTeam || $q.screen.xs,
                            'half-column': !comparisonTeam && !$q.screen.xs,
                        }" -->
                <div v-if="!comparisonTeam || headToHead" ref="gamesContainer">
                    <q-separator />
                    <div>
                        <div
                            class="row justify-between col-12 items-end q-my-sm"
                        >
                            <div class="row items-center" ref="results">
                                <q-icon
                                    name="o_scoreboard"
                                    color="green"
                                    class="text-md q-mr-sm"
                                />
                                <h2 class="text-md text-bold">
                                    Latest results
                                </h2>
                            </div>
                            <q-btn
                                rounded
                                outlined
                                flat
                                dense
                                color="primary"
                                icon="add"
                                label="Add game"
                                class="q-pa-none"
                                v-if="!comparisonTeam && isAuthorized"
                                @click="
                                    toggleLineScore({
                                        open: true,
                                        options: {
                                            homeTeam: team,
                                        },
                                    })
                                "
                            />
                        </div>
                        <q-separator />
                        <div class="stats-view__container">
                              <div v-if="!recordLoaded || gettingRecord" class="q-pa-sm row justify-center items-center">
                                <q-circular-progress indeterminate color="primary"/>
                              </div>
                            <div v-else-if="!games.length">
                                <div
                                    class="row full-width justify-center q-pa-md"
                                >
                                    {{ team.name }} has played no games.
                                </div>
                            </div>
                          
                            <div v-else class="game-history__container" >
                                <LazyGameResultList :results="games" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>
<style lang="scss" scoped>
$avatar-dimension: 7em;

.overview__container {
    padding: var(--space-md);
    padding-top: 0px;
    width: 100%;
    height: fit-content;
    position: relative;
    .compare__container {
        position: absolute;
        left: 0;
        margin: var(--space-md);
    }
    .badge__container {
        padding: var(--space-md) 0px;
        .badge {
            margin-right: var(--space-md);
        }
    }
    .link-more {
        text-decoration: underline;
        cursor: pointer;
    }
    .stats-view__container {
        margin: 0px calc(-1 * var(--space-md));
        .game-history__container {
            padding: 0px var(--space-md);
        }
    }
    .back-button__container {
        position: absolute;
        top: 0;
        left: 0;
        padding: var(--space-xs);
    }
    .team__header {
        padding: var(--space-lg);
        padding-bottom: var(--space-sm);

        .avatar__container {
            height: $avatar-dimension;
            max-width: 100%;
            width: $avatar-dimension;
        }
    }
    .h2h__container {
        margin: 0px var(--space-md);
    }
    .main__content {
        display: flex;
        flex-direction: column;
        // flex-wrap: wrap;
        width: 100%;
        .full-column {
            width: 100%;
        }
        .half-column {
            width: 50%;
            height: fit-content;
        }
        .full-column,
        .half-column {
            box-sizing: border-box;
            &:nth-child(1) {
                order: 1;
            }
            &:nth-child(2) {
                order: 2;
            }
            &:nth-child(3) {
                order: 3;
            }
        }
    }
    .team-view-options__container {
        margin-top: var(--space-sm);
        .my-custom-toggle {
            border: 1px solid $primary;
        }
    }

    .pending-request__container {
        padding: var(--space-sm);
        width: 100%;
    }
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import {useTeamRequestStore} from '@/store/team-requests'
import {useUserTeamStore} from '@/store/user-teams'
import { useElementBounding, useRefHistory, watchDebounced, useElementVisibility } from "@vueuse/core";
import { BADGE_FIELDS } from "@/constants/badges";

const props = defineProps({
    team: Object,
});

const { getStatPercent } = useConvert();


const index = ref(0);

const { hasBadge } = useBadge();
const badges = ref(
    Object.keys(BADGE_FIELDS).reduce((all, key) => {
        if (hasBadge(null, key, props.team)) return [...all, key];
        return all;
    }, [])
);

const { toggleGlobalSearch, toggleLineScore } = useDialogStore();

const showPlayers = ref(true);
const editingPlayers = ref(false);

const comparisonTeam = ref(null);
const loadingComparison = ref(false);
const router = useRouter();
const { currentRoute  } = router;

const {history} = useRefHistory(currentRoute)

const onSelect = async ({ id }) => {
    toggleGlobalSearch({ open: false });
    navigateTo(`?opponent=${id}`);
};

const loadComparison = async (id) => {
    loadingComparison.value = true;
    await Promise.all([getComparisonTeam(id), getH2h(id)]);
    loadingComparison.value = false;
};

const gamesContainer = ref(null)

const isVisible = useElementVisibility(gamesContainer)

watchDebounced(
    currentRoute,
    (val) => {
        const { opponent } = val?.query || {};
        if (!opponent) {
            endComparison();
        } else {
            loadComparison(opponent);
        }
    },
    { debounce: 200, immediate: true }
);

watchDebounced(isVisible, (val) => {
    if (!val || gettingRecord.value) return;
    if (!games.value.length) getTeamRecord(props.team.id)
}, {immediate: true, debounce: 200})

const getComparisonTeam = async (id) => {
    const { data: stats } = await useSupabaseClient()
        .rpc("get_user_teams")
        .eq("id", id)
        .limit(1);
    const [t] = stats;
    comparisonTeam.value = t;
};

const headToHead = computed(
    () => teamViewMode.value === "h2h" && h2hTeam.value && h2hOpposition.value
);

const h2hTeam = ref(null);
const h2hOpposition = ref(null);

const getH2h = async (oppositionId) => {
    const { getHeadToHead } = useGame();
    const data = await getHeadToHead(
        props.team.id,
        Number.parseInt(oppositionId)
    );
    if (!data) {
        teamViewMode.value = "total";
        return;
    }
    const { team1, team2 } = data || {};
    h2hTeam.value = { ...team1, id: props.team.id };
    h2hOpposition.value = { ...team2, id: oppositionId };
    getHeadToHeadRecord(oppositionId);
};

const endComparison = () => {
    comparisonTeam.value = null;
    h2hTeam.value = null;
    teamViewMode.value = "h2h";
    h2hOpposition.value = null;
     const {opponent} = currentRoute.value.query;
    if (!opponent) return;
    navigateTo(`/teams/${props.team.id}`)
};

const games = ref([]);
const gettingRecord = ref(false)
const recordLoaded = ref(false)

const getTeamRecord = async (team_id_param) => {
     recordLoaded.value = true;
   gettingRecord.value = true;
  
    const { getTeamGames } = useGame();
    const teamGames = await getTeamGames([team_id_param], 0, 10);
    games.value = teamGames;
    gettingRecord.value = false;
};

const getHeadToHeadRecord = async (opponentId) => {
    const { data } = await useSupabaseClient()
        .rpc("get_team_record", { team_ids_param: [props.team.id] })
        .order("start_time", { ascending: false })
        .or(`home_id.eq.${opponentId},away_id.eq.${opponentId}`);

    games.value = data ?? [];
};

const players = ref([]);
const getPlayers = async () => {
    const { getTeamPlayers } = useTeam();
    players.value = await getTeamPlayers(props.team.id, isAuthorized.value);
};

onMounted(() => {
    getPlayers();
});

const $q = useQuasar();

const teamViewMode = ref("h2h");

const results = ref(null);

const { y: resultsY } = useElementBounding(results);

const browseGames = () => {
    let scrollElement;
    if ($q.platform.is.mobile) {
        scrollElement = document.querySelector(".page__container--global");
    } else {
        scrollElement = document.getElementById("__nuxt");
    }

    if (!scrollElement) return;
    scrollElement.scrollTop = resultsY.value;
};

const isAuthorized = computed(() => {
    return useUserTeamStore().userTeams.some(
        ({ id }) => id === props.team.id
    );
})

const pendingTeamRequest = computed(() => {
     return useTeamRequestStore().requests.find(({team_id}) => team_id === props.team.id)?.id
})

const respondToRequest = async (response) => {
    const trStore = useTeamRequestStore()
    let success;
    if (!!response) {
       success = await trStore.updateTeamRequestStatus({id: pendingTeamRequest.value, status: 'accepted'})
    } else {
        success = await trStore.updateTeamRequestStatus({id: pendingTeamRequest.value, status: 'rejected'})
    }
    if (!success) return;
    const {user:userId} = useUser();
     trStore.getTeamRequestsByUser(userId.value)
    useUserTeamStore().fetchUserTeams(true);
    if (!!response) getPlayers();
}




</script>
<script>
export default {
    name: "Team",
};
</script>
