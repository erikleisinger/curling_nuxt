<template>
    <div class="row no-wrap" style="overflow: hidden">
        <div class="overview__container row" key="overview">
            <div
                v-if="pendingTeamRequest && !comparisonTeam"
                class="pending-request__container"
            >
                <div>You have been invited to join team {{ team.name }}!</div>
                <div class="row">
                    <q-btn
                        class="col-6"
                        square
                        color="red"
                        flat
                        @click="respondToRequest(false)"
                        >Decline</q-btn
                    >
                    <q-btn
                        class="col-6"
                        square
                        color="green"
                        flat
                        @click="respondToRequest(true)"
                        >Accept</q-btn
                    >
                </div>
            </div>
            <div class="back-button__container" v-if="comparisonTeam">
                <q-btn flat round icon="arrow_back" @click="endComparison" />
            </div>
            <header class="row justify-center col-12">
                <div class="compare__container">
                    <q-btn
                        flat
                        round
                        icon="compare_arrows"
                        color="grey-8"
                        v-if="!comparisonTeam"
                        :label="$q.screen.xs ? '' : 'Team comparison'"
                        @click="
                            toggleGlobalSearch({
                                open: true,
                                options: {
                                    inputLabel: 'Search for a team to compare',
                                    resourceTypes: ['team'],
                                    callback: onSelect,
                                    filterIds: [teamId],
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
                        :disable="true"
                        :options="[
                            { label: 'Head to head', value: 'h2h' },
                            { label: 'All time totals', value: 'total' },
                        ]"
                        :readonly="!comparisonTeam || !team"
                    >
                        <q-tooltip v-if="!comparisonTeam || !team">
                            {{ team.name }} and {{ comparisonTeam.name }} have
                            not played any games.
                        </q-tooltip>
                    </q-btn-toggle>
                </div>
                <div
                    class="row no-wrap full-width"
                    :class="{
                        'justify-between': !!comparisonTeam,
                        'justify-center': !comparisonTeam,
                        'col-12': !comparisonTeam,
                    }"
                >
                    <TeamProfile
                        :teamId="teamId"
                        :canEdit="isAuthorized && !headToHead"
                        :showPlayers="!headToHead"
                        :class="comparisonTeam ? 'col-6' : 'col-12'"
                    >
                        <div class="row justify-around col-12 q-mt-md">
                            <TeamAttribute
                                title="Games played"
                                icon="track_changes"
                                color="primary"
                                v-memo="[team?.games_played, team.games_played]"
                            >
                                <div class="row no-wrap items-center">
                                    <div>
                                        {{
                                            headToHead
                                                ? comparisonTeam?.games_played
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
                                title="Win percentage"
                                color="amber"
                                icon="emoji_events"
                                v-if="!headToHead"
                            >
                                <span v-if="team.games_played">
                                    {{
                                        headToHead
                                            ? getStatPercent(
                                                  team.win,
                                                  team.games_played
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
                                        (headToHead && team.tie) ||
                                        (!headToHead && team.tie)
                                    "
                                    >({{
                                        headToHead
                                            ? getStatPercent(
                                                  team.tie,
                                                  team.games_played
                                              )
                                            : getStatPercent(
                                                  team.tie,
                                                  team.games_played
                                              )
                                    }}% tie)</span
                                >
                            </LazyTeamAttribute>
                            <LazyTeamAttribute
                                title="Points per game"
                                v-if="!comparisonTeam"
                                icon="o_looks_one"
                                color="blue"
                            >
                                <span v-if="team.games_played">
                                    {{
                                        `${
                                            team.points_for /
                                                team.games_played -
                                                team.points_against /
                                                    team.games_played >
                                            0
                                                ? "+"
                                                : ""
                                        }${(
                                            team.points_for /
                                                team.games_played -
                                            team.points_against /
                                                team.games_played
                                        ).toFixed(1)}`
                                    }}
                                    <span
                                        class="text-xs text-regular text-grey-8"
                                        >{{
                                            `(${(
                                                team.points_for /
                                                team.games_played
                                            ).toFixed(1)} - ${(
                                                team.points_against /
                                                team.games_played
                                            ).toFixed(1)})`
                                        }}</span
                                    >
                                </span>
                                <span v-else>-</span>
                            </LazyTeamAttribute>
                            <LazyTeamAttribute
                                v-if="!comparisonTeam"
                                title="Ends per game"
                                color="blue"
                                icon="filter_1"
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
                                            team.ends_against /
                                                team.games_played
                                        ).toFixed(1)}`
                                    }}
                                    <span
                                        class="text-xs text-regular text-grey-8"
                                        >{{
                                            `(${(
                                                team.ends_for /
                                                team.games_played
                                            ).toFixed(1)} - ${(
                                                team.ends_against /
                                                team.games_played
                                            ).toFixed(1)})`
                                        }}</span
                                    >
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
                            </LazyTeamAttribute>
                        </div>
                    </TeamProfile>
                    <TeamProfile
                        v-if="comparisonTeam"
                        :teamId="comparisonTeam?.id"
                        class="col-6"
                        @loaded="showGames = true"
                    >
                        <div class="row justify-around col-12 q-mt-md">
                            <LazyTeamAttribute
                                title="Head to head"
                                color="red"
                                icon="leaderboard"
                                v-if="headToHead"
                            >
                                <div
                                    class="row items-center"
                                    v-if="
                                        typeof comparisonTeam.win ===
                                            'number' &&
                                        typeof team.win === 'number'
                                    "
                                >
                                    <div class="q-mr-xs">
                                        <span
                                            v-if="
                                                team.win !== comparisonTeam?.win
                                            "
                                        >
                                            +{{
                                                Math.abs(
                                                    team?.win -
                                                        comparisonTeam?.win
                                                )
                                            }}
                                        </span>

                                        <span v-else>Even</span>
                                    </div>
                                    <div
                                        style="height: 1em; width: 1em"
                                        v-if="team?.win !== comparisonTeam?.win"
                                    >
                                        <LazyTeamAvatar
                                            :teamId="
                                                team?.win > comparisonTeam?.win
                                                    ? team?.id
                                                    : comparisonTeam?.id
                                            "
                                        />
                                    </div>
                                </div>
                                <div style="visibility: hidden" v-else>-</div>

                                <template v-slot:tooltip>
                                    <q-tooltip v-if="$q.platform.is.desktop">
                                        <div v-if="!!team && !!comparisonTeam">
                                            <div>
                                                <span class="text-bold">{{
                                                    team.name
                                                }}</span
                                                >: {{ team.win }} wins
                                            </div>
                                            <div>
                                                <span class="text-bold">{{
                                                    comparisonTeam.name
                                                }}</span
                                                >: {{ comparisonTeam.win }} wins
                                            </div>
                                            <div>
                                                <span class="text-bold"
                                                    >Ties</span
                                                >:
                                                {{ team.tie }}
                                            </div>
                                        </div>
                                        <div v-else>
                                            {{ team.name }} and
                                            {{ comparisonTeam.name }} have
                                            played no games.
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
                                        ? comparisonTeam.games_played
                                        : comparisonTeam.games_played
                                }}
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
                                              comparisonTeam.win,
                                              comparisonTeam.games_played
                                          )
                                        : getStatPercent(
                                              comparisonTeam.win,
                                              comparisonTeam.games_played
                                          )
                                }}%

                                <span
                                    class="text-xs"
                                    v-if="
                                        (headToHead && comparisonTeam.tie) ||
                                        (!headToHead && comparisonTeam.tie)
                                    "
                                    >({{
                                        headToHead
                                            ? getStatPercent(
                                                  comparisonTeam.tie,
                                                  comparisonTeam.games_played
                                              )
                                            : getStatPercent(
                                                  comparisonTeam.tie,
                                                  comparisonTeam.games_played
                                              )
                                    }}%)</span
                                >
                            </LazyTeamAttribute>
                        </div>
                    </TeamProfile>
                </div>
            </header>

            <main class="main__content">
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
                    </div>
                    <q-separator />

                    <div class="stats-view__container">
                        <TeamStatsView
                            :teamId="team.id"
                            key="stats"
                            viewerHeight="600px"
                            :oppositionId="Number(comparisonTeam?.id)"
                            :h2h="headToHead"
                            v-memo="[
                                team?.id,
                                team?.id,
                                comparisonTeam?.id,
                                comparisonTeam?.id,
                            ]"
                        >
                        </TeamStatsView>
                    </div>
                </div>
                <!-- RESULTS -->
                <div v-if="!comparisonTeam || headToHead">
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
                            <div class="game-history__container">
                                <LazyGameResultList
                                    :teamId="teamId"
                                    :filterOpposition="
                                        currentRoute.query.opponent
                                            ? [
                                                  Number(
                                                      currentRoute.query
                                                          .opponent
                                                  ),
                                              ]
                                            : []
                                    "
                                />
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
    .main__content {
        display: flex;
        flex-direction: column;
        width: 100%;
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
import { useTeamRequestStore } from "@/store/team-requests";
import { useUserTeamStore } from "@/store/user-teams";
import { watchDebounced, useElementVisibility } from "@vueuse/core";
import { BADGE_FIELDS } from "@/constants/badges";
import Game from "@/store/models/game";
import GameTeam from "@/store/models/game-team";
import Team from "@/store/models/team";
import TeamStats from "@/store/models/team-stats";

const router = useRouter();
const { currentRoute } = router;

const teamId = Number.parseInt(currentRoute.value.params.id);

const team = computed(() => {
    const t = useRepo(Team).with("stats").where("id", teamId).first() || {};
    if (!t) return {};

    if (headToHead.value) {
        return {
            ...t,
            ...getCumulativeStats(t.stats ?? []),
            games_played: t.stats?.length ?? 0,
        };
    } else {
        const stats = t.stats.find(({ game_id }) => game_id === 0);
        if (!stats) return null;
        const {
            games_played,
            points_for,
            points_against,
            ends_for,
            ends_against,
            win,
            loss,
            tie,
        } = stats;
        return {
            ...t,
            games_played,
            points_for,
            points_against,
            ends_for,
            ends_against,
            win,
            loss,
            tie,
        };
    }
});

const getCumulativeStats = (statsArray) => {
    return statsArray.reduce((all, current) => {
        const allCopy = { ...all };
        Object.keys(current).forEach((key) => {
            allCopy[key] = allCopy[key] ?? 0 + current[key];
        });
        return allCopy;
    }, {});
};

const comparisonTeam = computed(() => {
    const { opponent } = currentRoute.value.query;
    if (!opponent) return null;
    const t =
        useRepo(Team).with("stats").where("id", Number(opponent)).first() || {};
    if (!t) return {};

    if (headToHead.value) {
        return {
            ...t,
            ...getCumulativeStats(t.stats ?? []),
            games_played: t.stats?.length ?? 0,
        };
    } else {
        const stats = t.stats.find(({ game_id }) => game_id === 0);
        if (!stats) return null;
        const {
            games_played,
            points_for,
            points_against,
            ends_for,
            ends_against,
            win,
            loss,
            tie,
        } = stats;
        return {
            ...t,
            games_played,
            points_for,
            points_against,
            ends_for,
            ends_against,
            win,
            loss,
            tie,
        };
    }
});

const { getStatPercent } = useConvert();

const index = ref(0);

const { hasBadge } = useBadge();
const badges = ref([]);

const calculateBadges = () => {
    const [stats] = team.value?.stats ?? [];
    badges.value = Object.keys(BADGE_FIELDS).reduce((all, key) => {
        if (hasBadge(null, key, stats)) return [...all, key];
        return all;
    }, []);
};

onMounted(() => {
    calculateBadges();
});

const { toggleGlobalSearch, toggleLineScore } = useDialogStore();

const showPlayers = ref(true);

const onSelect = async ({ id }) => {
    toggleGlobalSearch({ open: false });
    if (currentRoute.value.query.opponent) {
        loadComparison();
    } else {
        navigateTo(`?opponent=${id}`);
    }
};

const getH2h = async (oppositionId) => {
    const { getHeadToHead } = useGame();
    await getHeadToHead(team.value.id, Number.parseInt(oppositionId));
};

const loadingComparison = ref(false);

const loadComparison = async (id) => {
    loadingComparison.value = true;
    await getH2h(id);
    loadingComparison.value = false;
};

const showGames = ref(false);

watchDebounced(
    currentRoute,
    (val) => {
        const { opponent } = val?.query || {};
        if (!opponent) {
            endComparison();
        } else {
            showGames.value = true;
            loadComparison(opponent);
        }
    },
    { debounce: 200, immediate: true }
);

const headToHead = computed(
    () => teamViewMode.value === "h2h" && !!currentRoute.value.query.opponent
);

const endComparison = () => {
    const { opponent } = currentRoute.value.query;
    if (!opponent) return;
    navigateTo(`/teams/${team.value.id}`);
};

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
    return useUserTeamStore().userTeams.some(({ id }) => id === teamId);
});

const pendingTeamRequest = computed(() => {
    return useTeamRequestStore().requests.find(
        ({ team_id }) => team_id === team.value.id
    )?.id;
});

const respondToRequest = async (response) => {
    const trStore = useTeamRequestStore();
    let success;
    if (!!response) {
        success = await trStore.updateTeamRequestStatus({
            id: pendingTeamRequest.value,
            status: "accepted",
        });
    } else {
        success = await trStore.updateTeamRequestStatus({
            id: pendingTeamRequest.value,
            status: "rejected",
        });
    }
    if (!success) return;
    const { user: userId } = useUser();
    trStore.getTeamRequestsByUser(userId.value);
    useUserTeamStore().fetchUserTeams(true);
    if (!!response) getPlayers();
};
</script>
<script>
export default {
    name: "Team",
};
</script>
