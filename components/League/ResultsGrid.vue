<template>
    <div class="results__scroller" v-for="pool, index in teamsSorted" :key="index">
        <h2 class="text-md text-bold q-pa-sm">{{teamsSorted?.length > 1 ? league?.pools[index]?.name : 'Head to head'}}</h2>
        <q-separator :style="{backgroundColor: league.color}" size="2px"/>
        <div class="results__grid" :style="{'grid-template-rows': `repeat(${pool?.length + 1}, 1fr)`}">
            <div class="results__teams-x grid-row" :style="{'grid-template-columns': `repeat(${pool?.length + 1}, 1fr)`}">
                <div />
                <div
                    class="row justify-center full-width full-height items-center grid-column"
                    v-for="team in pool"
                    :key="team.team_id"
                >
                    <div style="width: 30px">
                        <TeamAvatar :teamId="team.team_id" />
                    </div>
                </div>
            </div>
            <div
                v-for="(team, xIndex) in pool"
                :key="team.team_id"
                class="grid-row"
                :style="{'grid-template-columns': `repeat(${pool?.length + 1}, 1fr)`}"
            >
                <div
                    class="full-height full-width row justify-center items-center grid-column"
                >
                    <div style="width: 30px">
                        <TeamAvatar :teamId="team.team_id" />
                    </div>
                </div>
                <div
                    v-for="(team, yIndex) in pool"
                    :key="team.team_id"
                    class="text-bold text-lg text-center grid-column"
                >
                    <LeagueResultGridItem :result="getResult(xIndex, yIndex)" />
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.results__scroller {
    overflow: auto;
}
.results__grid {
    display: grid;
    min-width: v-bind(minWidth);

    .grid-row {
        display: grid;
        grid-template-columns: v-bind(columns);
    }
    .grid-column {
        border-right: 1px solid rgba(0, 0, 0, 0.2);
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }
}
</style>
<script setup>
import League from "@/store/models/league";
import Game from '@/store/models/game'
    const props = defineProps({
        leagueId: Number,
    })

    const league = computed(() =>
    useRepo(League).with("teams").with('pools').where("id", props.leagueId).first()
);

const teamsSorted = computed(() => {
    if (!league.value?.pools?.length) return [
        league.value.teams
    ]

    return league.value.pools.map(({id}) => league.value.teams.filter(({league_pool_id}) => league_pool_id === id))
})

const games = computed(() => {
    return useRepo(Game)
        .query()
        .withAllRecursive()
        .where("league_id", props.leagueId)
        .orderBy("start_time", "desc")
        .get()
});

const rows = computed(
    () => `repeat(${(league.value?.teams?.length ?? 0) + 1}, 1fr)`
);
const columns = computed(
    () => `repeat(${(league.value?.teams?.length ?? 0) + 1}, 1fr)`
);

const getResult = (x, y) => {
    if (x === y) return null;
    const { teams } = league.value;
    const xTeam = teams[x];
    const yTeam = teams[y];
    // console.log(xTeam, xTeam.team_id)
    const allGames = games.value?.filter(
        ({ teams }) =>
            teams.some(({ team_id }) => xTeam.team_id === team_id) &&
            teams.some(({ team_id }) => yTeam.team_id === team_id)
    );
    if (!allGames?.length)
        return {
            [xTeam.team_id]: 0,
            [yTeam.team_id]: 0,
        };
    const results = {
        [xTeam.team_id]: 0,
        [yTeam.team_id]: 0,
    };
    allGames.forEach((game) => {
        const { points_scored: xTeamPoints } = game.teams.find(
            ({ team_id }) => team_id === xTeam.team_id
        );
        const { points_scored: yTeamPoints } = game.teams.find(
            ({ team_id }) => team_id === yTeam.team_id
        );
        if (xTeamPoints > yTeamPoints) {
            results[xTeam.team_id] += 1;
        } else if (yTeamPoints > xTeamPoints) {
            results[yTeam.team_id] += 1;
        }
    });

    return results;
};

const minWidth = computed(
    () => `${((league.value?.teams?.length ?? 0) + 1) * 60}px`
);
</script>