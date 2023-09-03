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
                <header
                    :class="{
                        'col-12': $q.screen.xs || !!comparisonTeam,
                        'col-6 q-pr-lg': !$q.screen.xs && !comparisonTeam,
              
                    }"
                    v-if="tab === 'overview'"
                >
                    <div class="row no-wrap justify-between">
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
                        class="full-width row justify-around"
                      
                    >
                        <TeamAttribute
                            title="Games played"
                            icon="track_changes"
                            color="primary"
                            class="col-5"
                        >
                            {{
                                headToHead
                                    ? h2hTeam.games_played
                                    : team.games_played
                            }}
                        </TeamAttribute>

                        <TeamAttribute
                            title="Games played"
                            icon="track_changes"
                            color="primary"
                            class="col-5"
                            v-if="comparisonTeam"
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
                        >
                            {{
                                headToHead
                                    ? (
                                          (h2hTeam.win / h2hTeam.games_played) *
                                          100
                                      ).toFixed(1)
                                    : (
                                          (team.win / team.games_played) *
                                          100
                                      ).toFixed(1)
                            }}%

                            <span
                                class="text-xs"
                                v-if="
                                    (headToHead && h2hTeam.tie) ||
                                    (!headToHead && team.tie)
                                "
                                >({{
                                    headToHead
                                        ? (
                                              (h2hTeam.tie /
                                                  h2hTeam.games_played) *
                                              100
                                          ).toFixed(1)
                                        : (
                                              (team.tie / team.games_played) *
                                              100
                                          ).toFixed(1)
                                }}%)</span
                            >
                        </TeamAttribute>
                        <TeamAttribute
                            title="Win percentage"
                            color="amber"
                            icon="emoji_events"
                            class="col-5"
                            v-if="comparisonTeam"
                        >
                            {{
                                headToHead
                                    ? (
                                          (h2hOpposition.win /
                                              h2hOpposition.games_played) *
                                          100
                                      ).toFixed(1)
                                    : (
                                          (comparisonTeam.win /
                                              comparisonTeam.games_played) *
                                          100
                                      ).toFixed(1)
                            }}%

                            <span
                                class="text-xs"
                                v-if="
                                    (headToHead && h2hOpposition.tie) ||
                                    (!headToHead && comparisonTeam.tie)
                                "
                                >({{
                                    headToHead
                                        ? (
                                              (h2hOpposition.tie /
                                                  h2hOpposition.games_played) *
                                              100
                                          ).toFixed(1)
                                        : (
                                              (comparisonTeam.tie /
                                                  comparisonTeam.games_played) *
                                              100
                                          ).toFixed(1)
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
                            
                            v-if="comparisonTeam && h2hTeam"
                        >
                         <TeamAttribute class="col-5" style="visibility:hidden" v-if="h2hTeam.win < h2hOpposition.win"/>
                            <TeamAttribute
                                title="Head to head"
                                color="red"
                                icon="leaderboard"
                                class="col-5"
                                :highlight="headToHead"
                               
                            >
                                <div
                                    class="row items-center"
                                    @click="headToHead = !headToHead"
                                >
                                    <div class="q-mr-xs">
                                        <span  v-if="h2hTeam.win !== h2hOpposition.win">
                                        +{{ Math.abs(h2hTeam.win - h2hOpposition.win) }}
                                        </span>
                                        <span v-else>Even</span>
                                    </div>
                                    <div
                                        style="height: 1em; width: 1em"
                                        v-if="h2hTeam.win !== h2hOpposition.win"
                                    >
                                        <TeamAvatar
                                            :team="
                                                h2hTeam.win > h2hOpposition.win
                                                    ? h2hTeam
                                                    : h2hOpposition
                                            "
                                        />
                                    </div>
                                </div>
                                <template v-slot:tooltip>
                                      
                                    <q-tooltip>
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
                                    </q-tooltip>
                                </template>
                            </TeamAttribute>
                            <TeamAttribute class="col-5" style="visibility:hidden" v-if="h2hTeam.win > h2hOpposition.win"/>
                            
                        </div>
                     <q-separator v-if="!comparisonTeam" />
                    <div
                        class="row justify-between col-12 items-end q-my-sm"
                        v-if="!comparisonTeam"
                    >
                        <div class="row items-center">
                            <q-icon
                                name="token"
                                color="amber"
                                class="text-md q-mr-sm"
                            />
                            <h2 class="text-md text-bold">Badges</h2>
                        </div>
                    </div>
                    <q-separator v-if="!comparisonTeam" />
                    <div class="row badge__container" v-if="!comparisonTeam">
                        <div class="badge" v-for="badge in badges" :key="badge">
                            <Badge :badge="badge" height="3em" />
                        </div>
                    </div>
                  
                </header>
                <main
                    :class="{
                        'col-12': $q.screen.xs || !!comparisonTeam,
                        'col-6': !$q.screen.xs && !comparisonTeam,
                    }"
                >
                   
                    
                    <div
                        class="row items-end justify-between q-my-sm"
                        v-if="!comparisonTeam"
                    >
                        <div class="row items-center">
                            <q-icon
                                color="blue"
                                name="insights"
                                class="text-md q-mr-sm"
                            />
                            <h3 class="text-md text-bold">Stats</h3>
                        </div>
                        <div
                            class="link-more text-sm"
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
                    </div>
                    <q-separator v-if="!comparisonTeam" />

                    <div class="stats-view__container">
                        <TeamStatsView
                            :teamId="team?.id"
                            v-if="team"
                            key="stats"
                            viewerHeight="400px"
                            :oppositionTeam="
                                headToHead ? h2hOpposition : comparisonTeam
                            "
                            :customTeam="headToHead ? h2hTeam : null"
                        >
                        </TeamStatsView>
                    </div>
                </main>
            </div>
            <main
                class="column select__section full-width no-wrap"
                v-else
                key="other"
            >
                <TeamGameHistory
                    :teamId="team?.id"
                    :team="team"
                    key="gamehistory"
                    v-if="team && tab === 'history'"
                />
            </main>
        </transition-group>
    </div>
</template>
<style lang="scss" scoped>
$avatar-dimension: 7em;

.overview__container {
    padding: var(--space-md);
    width: 100%;
    height: fit-content;
    position: relative;
    header {
        margin-bottom: var(--space-md);
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
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import { BADGE_FIELDS } from "@/constants/badges";

const props = defineProps({
    team: Object,
});

const tab = ref("overview");

const index = ref(0);

const { hasBadge } = useBadge();
const badges = ref(
    Object.keys(BADGE_FIELDS).reduce((all, key) => {
        if (hasBadge(null, key, props.team)) return [...all, key];
        return all;
    }, [])
);

const { toggleGlobalSearch } = useDialogStore();

const comparisonTeam = ref(null);
const loadingComparison = ref(false);

const onSelect = async ({ id }) => {
    loadingComparison.value = true;
    toggleGlobalSearch({ open: false });
    await getComparisonTeam(id);
    await getHeadToHead(id);
    loadingComparison.value = false;
};

const getComparisonTeam = async (id) => {
    const { data: stats } = await useSupabaseClient()
        .rpc("get_user_teams")
        .eq("id", id);
    const [t] = stats;
    comparisonTeam.value = t;
};

const headToHead = ref(false);

const h2hTeam = ref(null);
const h2hOpposition = ref(null);

const getHeadToHead = async (oppositionId) => {
    const { data } = await useSupabaseClient()
        .from("games")
        .select("id")
        .or(`home.eq.${props.team.id},away.eq.${props.team.id}`)
        .or(`home.eq.${oppositionId},away.eq.${oppositionId}`);
    const games = data?.map(({ id }) => id) || [];

    //TODO inform user there have been no games
    if (!games?.length) return;

    const { data: stats } = await useSupabaseClient()
        .from("team_stats")
        .select(
            `
        *,
        team:team_id (
            name,
            team_avatar,
            avatar_url,
            avatar_type
        )
        `
        )
        .in("game_id", games);

    const [reference] = stats;

    const EXCLUDE_STATS_FROM_COMPARISON = [
        "id",
        "created_at",
        "game_id",
        "team_id",
        "team",
    ];

    const keys = Object.keys(reference).filter(
        (key) => !EXCLUDE_STATS_FROM_COMPARISON.includes(key)
    );

    const myTeam = {};
    const oppTeam = {};

    keys.forEach((key) => {
        myTeam[key] = stats.reduce((all, current) => {
            if (current.team_id !== props.team.id) return all;
            return all + current[key];
        }, 0);

        oppTeam[key] = stats.reduce((all, current) => {
            if (current.team_id !== oppositionId) return all;
            return all + current[key];
        }, 0);
    });

    const oneOppositionEntry = stats.find(
        ({ team_id }) => team_id === oppositionId
    );

    const { avatar_type, avatar_url, team_avatar, name } = { ...props.team };

    h2hTeam.value = {
        ...myTeam,
        games_played: stats.length / 2,
        avatar_type,
        avatar_url,
        team_avatar,
        name,
    };
    h2hOpposition.value = {
        ...oppTeam,
        games_played: stats.length / 2,
        ...oneOppositionEntry.team,
    };
};

const endComparison = () => {
    comparisonTeam.value = null;
    h2hTeam.value = null;
    h2hOpposition.value = null;
};
</script>
