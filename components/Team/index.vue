<template>
    <div class="row no-wrap" style="overflow: hidden">
        <q-inner-loading :showing="loadingComparison" color="primary" />
        <transition-group
            appear
            enter-active-class="animated slideInLeft"
            leave-active-class="animated slideOutRight"
        >
            <div
                v-if="tab === 'overview'"
                class="overview__container row"
                key="overview"
            >
                <div class="back-button__container" v-if="comparisonTeam">
                    <q-btn
                        flat
                        round
                        icon="arrow_back"
                        @click="endComparison"
                    />
                </div>
                <header class="col-12 row" v-if="tab === 'overview'">
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
                                { label: 'All time totals', value: 'total' },
                                { label: 'Head to head', value: 'h2h' },
                            ]"
                            :readonly="!h2hOpposition || !h2hTeam"
                        >
                        <q-tooltip v-if="!h2hOpposition || !h2hTeam">
                            {{team.name}} and {{comparisonTeam.name}} have not played any games.
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
                            <div class="avatar__container">
                                <TeamAvatar
                                    :team="team"
                                    :style="{
                                        marginTop:
                                            team.avatar_type === 'avataaar'
                                                ? '-15%'
                                                : '',
                                    }"
                                />
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
                            <div class="avatar__container">
                                <TeamAvatar
                                    :team="comparisonTeam"
                                    :style="{
                                        marginTop:
                                            comparisonTeam.avatar_type ===
                                            'avataaar'
                                                ? '-15%'
                                                : '',
                                    }"
                                />
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

                    <div
                        class="row justify-around items-end"
                        :class="{
                            'col-12': !!comparisonTeam || $q.screen.xs,
                            'col-6': !comparisonTeam && !$q.screen.xs,
                        }"
                    >
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
                                >
                                    Browse
                                </h2>
                            </div>
                        </TeamAttribute>
                        <TeamAttribute
                            title="Head to head"
                            color="red"
                            icon="leaderboard"
                            class="col-5"
                            v-if="headToHead"
                        >
                          
                            <div class="row items-center">
                                <div class="q-mr-xs">
                                    <span
                                        v-if="
                                            h2hTeam?.win !== h2hOpposition?.win
                                        "
                                    >
                                        +{{
                                            Math.abs(
                                                h2hTeam?.win -
                                                    h2hOpposition?.win
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
                                    <TeamAvatar
                                        :team="
                                            h2hTeam?.win > h2hOpposition?.win
                                                ? h2hTeam
                                                : h2hOpposition
                                        "
                                    />
                                </div>
                            </div>
                            <template v-slot:tooltip>
                                <q-tooltip>
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
                        </TeamAttribute>

                        <TeamAttribute
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
                        </TeamAttribute>
                        <TeamAttribute
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
                                class="text-xs"
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
                                }}%)</span
                            >
                        </TeamAttribute>
                        <TeamAttribute
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
                        </TeamAttribute>
                        <TeamAttribute
                            title="Points per game"
                            icon="filter_1"
                            color="blue"
                            v-if="!comparisonTeam"
                            class="col-5"
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
                            </span>
                            <span v-else>-</span>
                            <template v-slot:tooltip>
                                <q-tooltip>
                                    <div>
                                        <span class="text-bold"
                                            >Avgs points scored:
                                        </span>
                                        {{
                                            (
                                                team.points_for /
                                                team.games_played
                                            ).toFixed(1)
                                        }}
                                    </div>
                                    <div>
                                        <span class="text-bold"
                                            >Avgs points conceded:
                                        </span>
                                        {{
                                            (
                                                team.points_against /
                                                team.games_played
                                            ).toFixed(1)
                                        }}
                                    </div>
                                </q-tooltip>
                            </template>
                        </TeamAttribute>
                        <TeamAttribute
                            v-if="!comparisonTeam"
                            title="Ends per game"
                            color="green"
                            icon="o_pin"
                            class="col-5"
                        >
                            <span v-if="team.games_played">
                                {{
                                    `${
                                        team.ends_for / team.games_played -
                                            team.ends_against /
                                                team.games_played >
                                        0
                                            ? "+"
                                            : ""
                                    }${(
                                        team.ends_for / team.games_played -
                                        team.ends_against / team.games_played
                                    ).toFixed(1)}`
                                }}
                            </span>
                            <span v-else>-</span>

                            <template v-slot:tooltip>
                                <q-tooltip>
                                    <div>
                                        <span class="text-bold"
                                            >Avg ends won:
                                        </span>
                                        {{
                                            (
                                                team.ends_for /
                                                team.games_played
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
                        </TeamAttribute>
                    </div>
                    <!-- Comparison stats -->
                    <div
                        class="row full-width justify-around"
                        v-if="(comparisonTeam || h2hTeam) && headToHead"
                    ></div>
                </header>

                <main class="main__content">
                    <!-- <LinescoreGridView
                :game="{}"
                :endCount="10"
                :score="{}"
                :selected="0"
                :colorCode="false"
            /> -->
                    <!-- :class="{
                            'full-column': !!comparisonTeam || $q.screen.xs,
                            'half-column': !comparisonTeam && !$q.screen.xs,
                        }" -->
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
                                    <Badge :badge="badge" height="3em" />
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

                            <div
                                class="link-more text-sm"
                                v-if="!comparisonTeam"
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
                                Team comparison
                            </div>
                            <!-- <div v-else-if="headToHead" class="row items-center full-height">
                                  <h2 class="text-sm text-underline clickable" style="margin-top: 1px">Browse all games</h2>
                              
                            </div> -->
                        </div>
                        <q-separator />

                        <div class="stats-view__container">
                            <TeamStatsView
                                :team="headToHead ? h2hTeam : team"
                                v-if="team"
                                key="stats"
                                viewerHeight="400px"
                                :oppositionTeam="
                                    headToHead ? h2hOpposition : comparisonTeam
                                "
                            >
                            </TeamStatsView>
                        </div>
                    </div>
                    <!-- RESULTS -->
                    <!-- :class="{
                            'full-column': !!comparisonTeam || $q.screen.xs,
                            'half-column': !comparisonTeam && !$q.screen.xs,
                        }" -->
                    <div v-if="!comparisonTeam || headToHead"> 
                          <q-separator />
                    <div >
                        <div
                            class="row justify-between col-12 items-end q-my-sm"
                        >
                            <div class="row items-center">
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
                                v-if="team.is_admin && !comparisonTeam"
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
                        <div class="stats-view__container" >
                            <div v-if="!games.length">
                                <div
                                    class="row full-width justify-center q-pa-md"
                                >
                                    {{ team.name }} has played no games.
                                </div>
                            </div>
                            <div v-else class="game-history__container">
                                <GameResultList :results="games"/>
                            </div>
                        </div>
                    </div>
                    </div>
                </main>
            </div>
        </transition-group>
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
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import { BADGE_FIELDS } from "@/constants/badges";

const props = defineProps({
    team: Object,
});

const { getStatPercent } = useConvert();

const tab = ref("overview");

const index = ref(0);

const { hasBadge } = useBadge();
const badges = ref(
    Object.keys(BADGE_FIELDS).reduce((all, key) => {
        if (hasBadge(null, key, props.team)) return [...all, key];
        return all;
    }, [])
);

const { toggleGlobalSearch, toggleLineScore } = useDialogStore();

const comparisonTeam = ref(null);
const loadingComparison = ref(false);

const onSelect = async ({ id }) => {
    loadingComparison.value = true;
    toggleGlobalSearch({ open: false });
    await Promise.all([getComparisonTeam(id), getH2h(id)]);

    loadingComparison.value = false;
};

const getComparisonTeam = async (id) => {
    const { data: stats } = await useSupabaseClient()
        .rpc("get_user_teams")
        .eq("id", id)
        .limit(1);
    const [t] = stats;
    comparisonTeam.value = t;
};

const headToHead = computed(() => teamViewMode.value === "h2h");



const h2hTeam = ref(null);
const h2hOpposition = ref(null);

const getH2h = async (oppositionId) => {
    const { getHeadToHead } = useGame();
    const data = await getHeadToHead(props.team.id, oppositionId);
    if (!data) return;
    const { team1, team2 } = data || {};
    console.log(team1, team2)
    h2hTeam.value = team1;
    h2hOpposition.value = team2;
    getHeadToHeadRecord(oppositionId);
};

const endComparison = () => {
    headToHead.value = false;
    comparisonTeam.value = null;
    h2hTeam.value = null;
    h2hOpposition.value = null;
};

const games = ref([]);

const getTeamRecord = async (team_id_param) => {
    const { getTeamGames } = useGame();
    const teamGames = await getTeamGames([team_id_param], 0, 2);
    games.value = teamGames;
};

const getHeadToHeadRecord = async (opponentId) => {
    const { data } = await useSupabaseClient()
        .rpc("get_team_record", { team_ids_param: [props.team.id] })
        .order("start_time", { ascending: false })
        .or(`home_id.eq.${opponentId},away_id.eq.${opponentId}`);

    games.value = data ?? [];
};

onMounted(() => {
    getTeamRecord(props.team.id);
});

const teamViewMode = ref("total");

const browseGames = () => {
    loadingComparison.value = true;
    return navigateTo(
        `/teams/${props.team?.id}/games?opponent=${comparisonTeam.value?.id}`
    );
};
</script>
<script>
export default {
    name: "Team",
};
</script>
