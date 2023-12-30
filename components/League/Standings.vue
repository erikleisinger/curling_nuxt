<template>
    <div v-if="league.pools?.length && !isLoading">
        <section
            v-for="(pool, poolIndex) in league.pools"
            :key="pool.id"
            class="pool-section column no-wrap"
        >
            <div class="row justify-between pool-header">
                <h2 class="text-md text-bold">{{ pool?.name }}</h2>
                <q-btn
                    flat
                    dense
                    @click="addTeamToLeague(pool?.id)"
                    v-if="league.public"
                >
                    Join pool
                </q-btn>
            </div>
            <q-separator
                :style="{ backgroundColor: league.color }"
                size="2px"
            />
            <KeepAlive>
                <transition-group name="list">
                    <div
                        v-if="!h2h.includes(poolIndex)"
                        key="standings"
                        class="q-pa-xs"
                    >
                        <LeagueStandingsItem
                            v-for="({ team }, index) in pool.teams.sort(
                                (a, b) =>
                                    rankOrder.indexOf(a.team?.id) -
                                    rankOrder.indexOf(b.team?.id)
                            )"
                            :key="team.id"
                            :index="index"
                            :teamId="team.id"
                            :leagueId="leagueId"
                        >
                            <div>{{ standings[team.id]?.win }} wins</div>
                            <div>
                                {{ standings[team.id]?.loss }}
                                losses
                            </div>
                            <div>{{ standings[team.id]?.tie }} ties</div>
                        </LeagueStandingsItem>
                    </div>
                    <LeagueResultsGrid
                        v-else
                        :leagueId="league?.id"
                        :poolId="pool?.id"
                        key="grid"
                    />
                </transition-group>
            </KeepAlive>
            <div class="full-width justify-end row" >
                <div class="clickable text-underline text-sm q-px-md q-py-sm" style="width: fit-content" @click="viewH2h(poolIndex)">
                    {{
                        h2h.includes(poolIndex)
                            ? "View standings"
                            : "View head-to-head"
                    }}
                </div>
            </div>
        </section>
    </div>
    <div v-else-if="!league?.pools?.length && !isLoading" class="pool-section">
        <div class="row justify-between pool-header">
            <h2 class="text-md text-bold">Standings</h2>
            <q-btn flat dense @click="addTeamToLeague" v-if="league.public">
                Join league
            </q-btn>
        </div>
        <q-separator :style="{ backgroundColor: league.color }" size="2px" />
        <KeepAlive>
            <transition-group name="list">
                <div v-if="!h2h.includes(0)" key="standings" class="q-pa-xs">
                    <LeagueStandingsItem
                        :style="{
                            backgroundColor:
                                index === 0 ? league.color : 'white',
                        }"
                        class="standing__item"
                        v-for="({ team }, index) in league.teams.sort(
                            (a, b) =>
                                rankOrder.indexOf(a.team?.id) -
                                rankOrder.indexOf(b.team?.id)
                        )"
                        :key="team.id"
                        :index="index"
                        :teamId="team.id"
                        :leagueId="leagueId"
                    >
                        <div>{{ standings[team.id]?.win }} wins</div>
                        <div>
                            {{ standings[team.id]?.loss }}
                            losses
                        </div>
                        <div>{{ standings[team.id]?.tie }} ties</div>
                    </LeagueStandingsItem>
                </div>

                <LeagueResultsGrid v-else :leagueId="league?.id" key="grid" />
            </transition-group>
        </KeepAlive>
        <div class="full-width justify-end row" >
            <div class="clickable text-underline text-sm q-px-md q-py-sm" style="width: fit-content" @click="viewH2h(0)">
                {{ h2h.includes(0) ? "View standings" : "View head-to-head" }}
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(100px) translateY(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
    position: absolute;
}

.pool-section {
    margin: var(--space-xs);
    box-shadow: $pretty-shadow;
    border-radius: 16px;
    .pool-header {
        padding: var(--space-sm);
    }
}

.standings__table {
    table-layout: fixed;
    border-collapse: collapse;

    td {
        vertical-align: middle;
    }

    td,
    th {
        padding: var(--space-xxxs) var(--space-xs) !important;
    }
    tr {
        &:nth-child(odd) {
            background-color: rgba(0, 0, 0, 0.05);
        }
    }
}
</style>
<script setup>
import League from "@/store/models/league";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { useDialogStore } from "@/store/dialog";
import { useUserTeamStore } from "@/store/user-teams";

const queryClient = useQueryClient();

const h2h = ref([]);

const viewH2h = (index) => {
    if (h2h.value.includes(index)) {
        const i = h2h.value.indexOf(index);
        h2h.value.splice(i, 1);
    } else {
        h2h.value.push(index);
    }
};

const props = defineProps({
    leagueId: Number,
});

const { truncateWords } = useText();

const league = computed(() =>
    useRepo(League).withAllRecursive().where("id", props.leagueId).first()
);

const getLeagueStandings = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("games")
        .select("id")
        .eq("league_id", props.leagueId);
    const gameIds = data.map(({ id }) => id);

    const { data: stats } = await client
        .from("team_stats")
        .select("*")
        .in("game_id", gameIds)
        .not("team_id", "is", null);

    const formatted = stats.reduce((all, current) => {
        const allClone = { ...all };
        if (!allClone[current.team_id])
            allClone[current.team_id] = {
                win: 0,
                loss: 0,
                tie: 0,
            };
        return {
            ...allClone,
            [current.team_id]: {
                win: allClone[current.team_id].win + current.win,
                loss: allClone[current.team_id].loss + current.loss,
                tie: allClone[current.team_id].tie + current.tie,
            },
        };
    }, {});
    console.log(league.value.teams);
    league.value.teams.forEach(({ team_id }) => {
        if (!formatted[team_id])
            formatted[team_id] = {
                win: 0,
                loss: 0,
                tie: 0,
            };
    });

    return formatted;
};

const { isLoading, data: standings } = useQuery({
    queryKey: ["league", "standings", props.leagueId],
    queryFn: getLeagueStandings,
    refetchOnWindowFocus: false,
    enabled: !!league,
});

const rankOrder = computed(() => {
    if (!standings.value) return;
    return Object.entries(standings.value)
        .reduce((all, [key, value]) => {
            return [
                ...all,
                {
                    id: key,
                    winlosstieValue:
                        value.loss * 0 + value.tie * 1 + value.win * 3,
                },
            ];
        }, [])
        .sort((a, b) => b.winlosstieValue - a.winlosstieValue)
        .map(({ id }) => Number(id));
});

const joinLeague = async (e, league_pool_id) => {
    const { id: team_id } = e;
    const client = useSupabaseClient();
    await client.from("league_teams").insert({
        team_id,
        league_id: league.value?.id,
        league_pool_id,
    });
    queryClient.invalidateQueries({
        queryKey: ["league", props.leagueId],
    });
    setTimeout(() => {
        queryClient.invalidateQueries({
            queryKey: ["league", "standings", props.leagueId],
        });
    }, 3000);
};

const { toggleGlobalSearch } = useDialogStore();

const addTeamToLeague = (poolId) => {
    const userTeams = useUserTeamStore().userTeams.map(({ id }) => id);
    toggleGlobalSearch({
        open: true,
        options: {
            inputLabel: `Which team would like to join ${league.value.name}?`,
            resourceTypes: ["team"],
            restrictIds: userTeams,
            filterIds: userTeams.filter((id) =>
                league.value.teams.some(({ team_id }) => team_id === id)
            ),
            callback: (e) => joinLeague(e, poolId),
        },
    });
};

const { getLeagueGames } = useGame();

const { isLoading: isLoadingGames } = useQuery({
    queryKey: ["league", "games", props.leagueId],
    queryFn: () => getLeagueGames([props.leagueId]),
    refetchOnWindowFocus: false,
});
</script>
