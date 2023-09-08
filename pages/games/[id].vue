<template>
    <NuxtLayout>
        <q-inner-loading :showing="loading" color="primary" />
        <div v-if="!!currentGame && !loading" class="game__container">
            <header class="game__header">
                <nav class="row no-wrap justify-center full-width items-center">
                    <div>
                        <h2 class="text-sm text-center">Game</h2>
                        <h1 class="text-md text-bold text-center">
                            {{
                                format(
                                    toTimezone(currentGame.start_time),
                                    "MMMM DD, YYYY"
                                )
                            }}
                        </h1>
                        <h2 class="text-sm text-center">
                            {{
                                format(
                                    toTimezone(currentGame.start_time),
                                    "HH:mm a"
                                )
                            }}
                        </h2>
                    </div>
                </nav>
                <div
                    class="row no-wrap justify-between col-12"
                    style="position: relative"
                >
                    <div class="end-count__container">
                        {{ `After ${currentGame.end_count}` }}
                    </div>
                    <div class="column team__header items-center col-6">
                        <div class="avatar__container q-mb-md">
                            <TeamAvatar
                                :teamId="home?.id"
                                :color="home.color"
                                :viewable="!!home.id"
                            />
                        </div>

                        <div class="column items-center full-width">
                            <div class="text-sm">Team</div>
                            <h2 class="text-sm text-bold text-center truncate-text full-width">
                                {{ home.name }}
                            </h2>
                        </div>
                        <div class="score__container">
                            {{ home.points_scored ?? 0 }}
                        </div>
                    </div>
                    <div class="column team__header items-center col-6">
                        <div class="avatar__container q-mb-md">
                            <TeamAvatar
                                :teamId="away?.id"
                                :color="away.color"
                                :viewable="!!away.id"
                                :invitable="
                                    isAuthorized && !away?.id
                                "
                            />
                        </div>

                        <div class="column items-center full-width">
                            <div class="text-sm">Team</div>
                            <div style="position: relative" class="full-width">
                                <div
                                    class="verified__container"
                                    v-if="currentGame.verified"
                                >
                                    <q-icon
                                        name="verified"
                                        :color="
                                            currentGame.verified
                                                ? 'primary'
                                                : 'grey-5'
                                        "
                                    />
                                    <q-tooltip v-if="$q.platform.is.desktop">
                                        <div v-if="currentGame.verified">
                                            {{ currentGame.away_name }} has
                                            verified that this score is
                                            accurate.
                                        </div>
                                        <div v-else>
                                            Game is unverified by
                                            {{ away.name }} and may
                                            not be accurate.
                                        </div>
                                    </q-tooltip>
                                </div>
                                <h2
                                    class="text-sm text-bold text-center truncate-text"
                                    style="white-space: nowrap"
                                >
                                    {{ away.name }}
                                </h2>
                            </div>
                        </div>
                        <div class="score__container">
                            {{ away.points_scored ?? 0 }}
                        </div>
                    </div>
                </div>
            </header>
            <main class="main__content">
                <div class="row justify-between items-end q-my-sm">
                    <div class="row items-center">
                        <q-icon
                            name="o_scoreboard"
                            color="deep-purple"
                            class="text-md q-mr-sm"
                        />
                        <h2 class="text-md text-bold">Linescore</h2>
                    </div>
                </div>
                <q-separator />
                <LinescoreGridView
                    v-if="currentGame && score"
                    :game="{
                        ...currentGame,
                        home,
                        away
                    }"
                    :endCount="
                        Math.max(
                            currentGame.end_count,
                            Object.keys(score)?.length
                        )
                    "
                    :score="score"
                    :selected="0"
                    :colorCode="false"
                />
                <div class="row justify-around">
                    <div class="info__section">
                        <q-icon name="location_on" color="red" />
                        <h2 class="text-sm">
                            {{ currentGame.rink_name ?? "Unspecified rink" }}
                        </h2>
                    </div>
                    <div class="info__section">
                        <q-icon name="crop_portrait" color="primary" />
                        <h2 class="text-sm">
                            {{ currentGame.sheet_name ?? "Unspecified sheet" }}
                        </h2>
                    </div>
                </div>
                <div class="row justify-between items-end q-my-sm q-mt-lg">
                    <div class="row items-center">
                        <q-icon
                            name="insights"
                            color="blue"
                            class="text-md q-mr-sm"
                        />
                        <h2 class="text-md text-bold">Stats</h2>
                    </div>
                </div>
                <q-separator />
                <div v-if="stats">
                    <TeamStatsView
                        :team="
                            stats.home
                                ? {
                                      color: home.color,
                                      ...stats?.home,
                                      ...stats?.home.team,
                                      id: stats.home.team_id,
                                      ...home
                                  }
                                : {}
                        "
                        key="stats"
                        viewerHeight="400px"
                        :oppositionTeam="
                            stats?.away
                                ? {
                                      color: away.color,
                                      ...stats?.away,
                                      ...stats?.away.team,
                                      id: stats.away.team_id,
                                      ...away
                                  }
                                : {}
                        "
                        :exclude="['firstend', 'strategist']"
                        showColors
                    >
                    </TeamStatsView>
                </div>
            </main>
        </div>
    </NuxtLayout>
</template>
<style lang="scss" scoped>
$avatar-dimension: 7em;
.game__container {
    .game__header {
        padding: 0px var(--space-md);
        nav {
            padding: var(--space-sm) 0px;
            margin-bottom: var(--space-md);
        }
        h1 {
            text-align: center;
        }
    }
    .info__section {
        display: flex;
        justify-content: center;
        .q-icon {
            margin-right: var(--space-xxxs);
        }
    }
    .team__header {
             .avatar__container {
            height: $avatar-dimension;
            max-width: 100%;
            width: $avatar-dimension;
        }
        .score__container {
            font-size: 4em;
            position: relative;
        }
    }
    .verified__container {
        position: absolute;

        left: -1em;

        height: min-content;
        .q-icon {
            font-size: 1em;
        }
    }
    .end-count__container {
        position: absolute;
        bottom: 1em;
        left: 0;
        right: 0;
        margin: auto;
        width: fit-content;
        color: $grey-8;
        font-size: 0.8em;
    }
    .main__content {
        padding: 0px var(--space-md);
        :deep(.stats__container) {
            padding: unset !important;
        }
    }
}
</style>
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
    return useRepo(Game).with('teams').where('id', Number(gameId)).first() || {};
})

const home = computed(() => {
    const team = useRepo(GameTeam).with('team').where('team_id', currentGame?.value?.teams[0]?.team_id).where('game_id', Number(gameId)).first()
    return {
        ...team,
        ...(team?.team ?? {})
    }
})
const away = computed(() => {
    if (!currentGame?.value?.teams?.length) return {};
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
        end_count: team1.end_count
    })
    useRepo(Team).save(team1.team)
       useRepo(Team).save(team2.team)
    
    
    
    useRepo(GameTeam).save(team1)

    useRepo(GameTeam).save(team2)
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
