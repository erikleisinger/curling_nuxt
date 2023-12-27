<template>
    <div v-if="league.pools?.length && !isLoading">
        <section
            v-for="pool in league.pools"
            :key="pool.id"
            class="pool-section"
        >
            <h2 class="text-md text-bold pool-header">{{ pool?.name }}</h2>
            <q-separator
                :style="{ backgroundColor: league.color }"
                size="2px"
            />
            <table class="full-width standings__table">
                <thead>
                    <th class="text-left" style="width: 50px">Rank</th>
                    <th style="width: 50px"></th>
                    <th class="text-left">Team</th>
                    <th style="width: 60px" class="text-left">W L T</th>
                    <th style="width: 20px"></th>
                </thead>
                <tbody>
                    <tr
                        v-for="({ team }, index) in pool.teams.sort(
                            (a, b) =>
                                rankOrder.indexOf(a.team?.id) -
                                rankOrder.indexOf(b.team?.id)
                        )"
                        :key="team.id"
                    >
                        <td class="text-lg text-bold q-pl-md">
                            <span>
                                {{ index + 1 }}
                            </span>
                        </td>
                        <td class="relative-position">
                            <div style="width: 30px">
                                <TeamAvatar :teamId="team.id" viewable />
                            </div>
                        </td>
                        <td>
                            {{ team?.name }}
                        </td>
                        <td>
                            <div class="row" v-if="standings">
                                {{ standings[team.id]?.win }}
                                {{ standings[team.id]?.loss }}
                                {{ standings[team.id]?.tie }}
                            </div>
                        </td>
                        <td>
                            <q-btn
                                flat
                                round
                                icon="more_vert"
                                dense
                                size="0.7em"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
    <div v-else-if="!league?.pools?.length && !isLoading" class="pool-section">
        <h2 class="text-md text-bold pool-header">Standings</h2>
        <q-separator :style="{ backgroundColor: league.color }" size="2px" />
        <table class="full-width standings__table">
            <thead>
                <th class="text-left" style="width: 50px">Rank</th>
                <th style="width: 50px"></th>
                <th class="text-left">Team</th>
                <th style="width: 60px" class="text-left">W L T</th>
                <th style="width: 20px"></th>
            </thead>
            <tbody>
                <tr
                    v-for="({ team }, index) in league.teams.sort(
                        (a, b) =>
                            rankOrder.indexOf(a.team?.id) -
                            rankOrder.indexOf(b.team?.id)
                    )"
                    :key="team.id"
                >
                    <td class="text-lg text-bold q-pl-md">
                        <span>
                            {{ index + 1 }}
                        </span>
                    </td>
                    <td class="relative-position">
                        <div style="width: 30px">
                            <TeamAvatar :teamId="team.id" viewable />
                        </div>
                    </td>
                    <td>
                        {{ team?.name }}
                    </td>
                    <td>
                        <div class="row" v-if="standings">
                            {{ standings[team.id]?.win }}
                            {{ standings[team.id]?.loss }}
                            {{ standings[team.id]?.tie }}
                        </div>
                    </td>
                    <td>
                        <q-btn flat round icon="more_vert" dense size="0.7em" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<style lang="scss" scoped>
.pool-section {
    margin: var(--space-xs);
    box-shadow: $pretty-shadow;
    padding: var(--space-xs);
    border-radius: 16px;
    .pool-header {
        padding: var(--space-xs);
        padding-top: 0px;
    }
}

.standings__table {
    table-layout: fixed;
        border-collapse: collapse;
  
    td {
        vertical-align: middle;
    }
    tr {
        
        &:nth-child(even) {
            background-color: rgba(0,0,0,0.05);
        }
    }
}
</style>
<script setup>
import League from "@/store/models/league";
import { useQuery } from "@tanstack/vue-query";
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
</script>
