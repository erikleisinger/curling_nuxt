<template>
    <div class="results__scroller">
        <div class="results__grid">
            <div class="results__teams-x grid-row">
                <div />
                <div
                    class="row justify-center full-width full-height items-center grid-column"
                    v-for="team in league?.teams"
                    :key="team.team_id"
                >
                    <div style="width: 30px">
                        <TeamAvatar :teamId="team.team_id" />
                    </div>
                </div>
            </div>
            <div
                v-for="(team, xIndex) in league?.teams"
                :key="team.team_id"
                class="grid-row"
            >
                <div
                    class="full-height full-width row justify-center items-center grid-column"
                >
                    <div style="width: 30px">
                        <TeamAvatar :teamId="team.team_id" />
                    </div>
                </div>
                <div
                    v-for="(team, yIndex) in league?.teams"
                    :key="team.team_id"
                    class="text-bold text-lg text-center grid-column"
                >
                    <LeagueResultGridItem :result="getResult(xIndex, yIndex)" />
                </div>
            </div>
        </div>
    </div>
     <div v-if="!isLoading && games.length" class="q-mt-lg">
     
        <div
                v-for="game in games"
                :key="game.id"
                class="result__container"
            >
                <TeamGameResult
                    :gameId="game.id"
                    :home="game.teams.find(({home_team}) => !!home_team)?.team?.id"
              />
            </div>
    </div>
</template>
<style lang="scss" scoped>
.results__scroller {
    overflow: auto;
}
.results__grid {
    display: grid;
    grid-template-rows: v-bind(rows);
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
import { useQuery } from "@tanstack/vue-query";
import Game from "@/store/models/game";
import Rink from "@/store/models/rink";
import League from "@/store/models/league";
const props = defineProps({
    leagueId: Number,
});

const league = computed(() =>
    useRepo(League).with("teams").where("id", props.leagueId).first()
);

const { getLeagueGames } = useGame();

const { isLoading } = useQuery({
    queryKey: ["league", "games", props.leagueId],
    queryFn: () => getLeagueGames([props.leagueId]),
    refetchOnWindowFocus: false,
});

const games = computed(() => {
    if (isLoading.value) return [];

    return useRepo(Game)
        .query()
        .withAllRecursive()
        .where("league_id", props.leagueId)
        .orderBy("start_time", "desc")
        .get()
        .map((game) => ({
            ...game,
            rink: useRepo(Rink).where("id", game.rink_id).first(),
        }));
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
<script>
export default {
    name: "LeagueResults",
};
</script>
