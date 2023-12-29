<template>
   <!-- <LeagueResultsGrid :leagueId="leagueId"/> -->
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

<script setup>
import { useQuery } from "@tanstack/vue-query";
import Game from "@/store/models/game";
import Rink from "@/store/models/rink";
import League from "@/store/models/league";
const props = defineProps({
    leagueId: Number,
});

const league = computed(() =>
    useRepo(League).with("teams").with('pools').where("id", props.leagueId).first()
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


</script>
<script>
export default {
    name: "LeagueResults",
};
</script>
