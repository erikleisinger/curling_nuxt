<template>
    <NuxtLayout>
        <q-inner-loading :showing="loading" color="primary" />
        <LinescoreEditor v-if="!!currentGame && !loading" :canEdit="false" v-model="currentGame" summary :score="score" :compact="false" static/>
    </NuxtLayout>
</template>

<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import Game from '@/store/models/game'
import Team from '@/store/models/team';
import GameTeam from '@/store/models/game-team';
const route = useRoute();
const { getGameResult } = useGame();

const loading = ref(false);
const result = ref(null);
const error = ref(null);
const isAuthorized = ref(false);

const { id: gameId } = route.params;

onBeforeMount(async () => {
    loading.value = true;
    await init();
    loading.value = false;
});

const score = ref({});
const stats = ref({});

const init = async () => {
    loading.value = true;
    await getGames();

    setTimeout(async () => {
        score.value = await generateScore(currentGame.value);

    stats.value = await getStatsForGame(currentGame.value);

    isAuthorized.value = useUserTeamStore().userTeams.some(
        ({ id }) => id === currentGame.value.teams?.find(({pending}) => !pending)?.id
    );
        loading.value = false;
    }, 100)

};

const games = ref([]);
const currentGame = computed(() => {
    const g = useRepo(Game).with('teams').where('id', Number(gameId)).first() || {};
    const {teams} = g;
    if (!teams) return {};
    return {
        ...g,
        home: home.value,
        away: away.value,
        hammerFirstEndTeam: g.hammer_first_end
    }
})

const home = computed(() => {
   if (loading.value || !currentGame?.value?.teams?.length) return {};
    const team = useRepo(GameTeam).with('team').where('team_id', currentGame?.value?.teams[0]?.team_id).where('game_id', Number(gameId)).first()
    return {
        ...team,
        ...(team?.team ?? {})
    }
})
const away = computed(() => {
    if (loading.value || !currentGame?.value?.teams?.length) return {};
 const team = useRepo(GameTeam).with('team').where('team_id', currentGame?.value?.teams[1]?.team_id).where('game_id', Number(gameId)).first()
    return {
        ...team,
        ...(team?.team ?? {})
    }
})

const getGames = async () => {
    const client = useSupabaseClient();

    const {data} = await client.rpc('get_team_record_new', {
        team_id_param: null,
        game_id_param: gameId
    })
    const [team1, team2] = data;

    useRepo(Game).save({
        id: team1.game_id,
        end_count: team1.end_count,
        rink: team1.rink,
        sheet: team1.sheet,
        hammer_first_end: team1.hammer_first_end
    })
    useRepo(Team).save({
        ...team1.team,
        id: team1.team.id ?? team1.game_id + 100000000
       })
       useRepo(Team).save({
        ...team2.team,
        id: team2.team.id ?? team2.game_id + 100000000
       })
    useRepo(GameTeam).save({
        id: team1.id,
        game_id: team1.game_id,
        team_id: team1.team?.id ?? team1.game_id + 100000000,
        pending: team1.pending,
        points_scored: team1.points_scored,
         color: team1.color
      })

      useRepo(GameTeam).save({
        id: team2.id,
        game_id: team2.game_id,
        team_id: team2.team?.id ?? team2.game_id + 100000000,
        pending: team2.pending,
        points_scored: team2.points_scored,
        color: team2.color
      })
   
};

const getScoreDetails = async () => {
    const client = useSupabaseClient();
    const {data} = await client.from('ends').select(`
        id,
        end_number,
        scoring_team_id,
        hammer_team_id,
        points_scored
    `).eq('game_id', gameId)
    return data;
};
const generateFormattedGame = (game) => {
    const home = {
        id: game.home_id,
        team_avatar: game.home_avatar,
        avatar_type: game.home_avatar_type,
        avatar_url: game.home_avatar_url,
    };
    const away = {
        id: game.away_id,
        team_avatar: game.away_avatar,
        avatar_type: game.away_avatar_type,
        avatar_url: game.away_avatar_url,
    };
    const homeColor = game.home_color;
    const awayColor = game.away_color;

    return {
        home,
        away,
        homeColor,
        awayColor,
        hammerFirstEnd: game.hammer_first_end,
    };
};

const generateScore = async (game) => {
    const details = await getScoreDetails(game?.id);
    const s = Array.from(
        {
            length: Math.max(currentGame.value.end_count, details?.length),
        },
        (_, i) => i + 1
    ).reduce((all, current, index) => {
        if (!details[index]) {
            return {
                ...all,
                [index + 1]: {
                    home: "X",
                    away: "X",
                },
            };
        } else {
            return {
                ...all,
                [index + 1]: {
                    home:
                        details[index]?.points_scored === null
                            ? "X"
                            : details[index]?.scoring_team_id ===
                              home.value?.id || (home.value?.pending && !details[index]?.scoring_team_id)
                            ? details[index]?.points_scored
                            : 0,
                    away:
                        details[index]?.points_scored === null
                            ? "X"
                            : details[index]?.scoring_team_id ===
                              away.value?.id || (away.value?.pending && !details[index]?.scoring_team_id)
                            ? details[index]?.points_scored
                            : 0,
                    ...details[index],
                },
            };
        }
    }, {});
    return s
};

const getStatsForGame = async (game) => {
    const { data } = await useSupabaseClient()
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
        .eq("game_id", game?.id);
    if (!data?.length) return null;
    return {
        home: data.find(({ team_id }) => team_id === home.value.id),
        away: data.find(({ team_id }) => !team_id || team_id === away.value.id),
    };
};

const { format, toTimezone } = useTime();
</script>
<script>
export default {
    name: "Game",
};
</script>
