<template>
    <NuxtLayout>
        <q-inner-loading :showing="loading" color="primary" />
        <div v-if="!!currentGame" class="game__container">
            <header class="game__header">
                <nav class="row no-wrap justify-center full-width items-center">
                    <!-- <q-btn icon="chevron_left" flat round @click="goToGame(currentIndex - 1)" :disable="currentIndex === 0"/> -->
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
                    <!-- <q-btn icon="chevron_right" flat round @click="goToGame(currentIndex + 1)" :disable="endOfResults && currentIndex === games.length - 1"/> -->
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
                            <TeamAvatar :team="currentGame?.home" :color="currentGame.home_color" />
                        </div>

                        <div class="column items-center">
                            <div class="text-sm">Team</div>
                            <h2 class="text-sm text-bold text-center">
                                {{ currentGame.home_name }}
                            </h2>
                        </div>
                        <div class="score__container">
                            {{ currentGame.home_points ?? 0 }}
                        </div>
                    </div>
                    <div class="column team__header items-center col-6">
                        <div class="avatar__container q-mb-md">
                            <TeamAvatar :team="currentGame.away" :color="currentGame.away_color" />
                        </div>

                        <div
                            class="column items-center"
                          
                        >
                    
                            <div class="text-sm">Team</div>
                            <div   style="position: relative">
                                     <div class="verified__container" v-if="currentGame.verified">
                                    <q-icon name="verified" :color="currentGame.verified ? 'primary' : 'grey-5'" />
                                      <q-tooltip v-if="$q.platform.is.desktop">
                                <div v-if="currentGame.verified">
                                    {{ currentGame.away_name }} has verified that
                                    this score is accurate.
                                </div>
                                <div v-else>
                                    Game is unverified by
                                    {{ currentGame.away_name }} and may not be
                                    accurate.
                                </div>
                            </q-tooltip>
                                </div>
                            <h2
                                class="text-sm text-bold text-center"
                                style="white-space: nowrap"
                            >
                                {{ currentGame.away_name }}
                               
                            </h2>
                            </div>
                        </div>
                        <div class="score__container">
                            {{ currentGame.away_points ?? 0 }}
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
                    :game="currentGame"
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
                                    color: currentGame.home_color,
                                      ...stats?.home,
                                      ...stats?.home.team,
                                      id: stats.home.team_id,
                                  }
                                : {}
                        "
                        key="stats"
                        viewerHeight="400px"
                        st
                        :oppositionTeam="
                            stats?.away
                                ? {
                                    color: currentGame.away_color,
                                      ...stats?.away,
                                      ...stats?.away.team,
                                      id: stats.away.team_id,
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
        // padding-bottom: var(--space-sm);

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
import { useThrottleFn } from "@vueuse/core";
const route = useRoute();
const { getGameResult } = useGame();

const loading = ref(false);
const result = ref(null);
const error = ref(null);

const { id: gameId } = route.params;

onBeforeMount(async () => {
    loading.value = true;
    await init();
    loading.value = false;
});

const score = ref({});
const stats = ref({});

const init = async () => {
    await getGames();

    score.value = await generateScore(currentGame.value);

    stats.value = await getStatsForGame(currentGame.value);
};

const games = ref([]);
const currentGame = ref(null);

const getGames = async () => {
    const client = useSupabaseClient();
    const { data: gameData } = await client
        .from("games")
        .select("home")
        .eq("id", gameId)
        .single();
    const { home } = gameData ?? {};
    if (!home) return;

    const { data } = await client
        .rpc("get_team_record", { team_ids_param: [home] })
        .eq("id", gameId);
    if (data) {
        currentGame.value = data?.map((d) => ({
            ...d,
            end_count: d.end_count,
            id: d.id,
            is_home_team: d.is_home_team,
            event_color: d.event_color,
            event_name: d.event_name,
            rink_name: d.rink_name,
            sheet_name: d.sheet_name,
            start_time: d.start_time,
            ...generateFormattedGame(d),
        }))[0];
    }
};

const getScoreDetails = async (gameId) => {
    const client = useSupabaseClient();
    const { data } = await client.rpc("get_game_score_detailed", {
        game_id_param: gameId,
    });
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
    return Array.from(
        {
            length: Math.max(game.end_count, details?.length),
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
                              details[index]?.home_team
                            ? details[index]?.points_scored
                            : 0,
                    away:
                        details[index]?.points_scored === null
                            ? "X"
                            : details[index]?.scoring_team_id ===
                              details[index]?.away_team
                            ? details[index]?.points_scored
                            : 0,
                    ...details[index],
                },
            };
        }
    }, {});
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
        home: data.find(({ team_id }) => team_id === game?.home_id),
        away: data.find(({ team_id }) => team_id === game?.away_id),
    };
};

const { format, toTimezone } = useTime();
</script>
<script>
export default {
    name: "Game",
};
</script>
