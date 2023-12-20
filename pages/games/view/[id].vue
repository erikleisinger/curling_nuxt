<template>
    <NuxtLayout>
        <aside class="game-request__container" v-if="gameRequest">
            <GameRequest :request="gameRequest" />
            <q-separator />
        </aside>

        <LinescoreEditor
            v-if="!isLoadingGames && !loading && !!currentGame"
            :canEdit="canEdit && !!editedGame"
            :canEditDetails="canEdit && !!editedGame"
            v-model="editedGame"
            summary
            :score="score"
            :compact="false"
            static
            @update:modelValue="onUpdate"
            canViewTeams
            showVerified
        >
            <template v-slot:name-append__home>
                <div class="row badges justify-center items-end">
                    <Badge
                        v-for="badge in [...(badges[home.id] ?? [])].splice(
                            0,
                             showMoreBadgesHome ? badges[home.id]?.length : 2
                        )"
                        :key="badge.id"
                        :badge="badge"
                        height="1.9em"
                        iconOnly
                    />
                    <div v-if="!showMoreBadgesHome && badges[home.id]?.length > 2" class="clickable" @click="showMoreBadges('home')">
                        +{{ badges[home.id].length - 2 }}
                    </div>
                    <div v-if="showMoreBadgesHome" class="text-sm full-width text-center text-underline clickable" @click="showMoreBadges('home')">Show less</div>
                </div>
            </template>
            <template v-slot:name-append__away>
                <div class="row badges justify-center items-end">
                    <Badge
                        v-for="badge in [...(badges[away.id] ?? [])].splice(
                            0,
                             showMoreBadgesAway ? badges[away.id]?.length : 2
                        )"
                        :key="badge.id"
                        :badge="badge"
                        height="1.9em"
                      
                        class="clickable"
                        iconOnly
                    />
                    <div v-if="!showMoreBadgesAway && badges[away.id]?.length > 2" class="clickable" @click="showMoreBadges('away')">
                        +{{ badges[away.id].length - 3 }}
                    </div>
                       <div v-if="showMoreBadgesAway" class="text-sm full-width text-center text-underline clickable" @click="showMoreBadges('away')">Show less</div>
                </div>
            </template>
        </LinescoreEditor>

        <TeamStatsView
            v-if="!isLoadingGames && !loading && !!currentGame"
            :teamId="home.id"
            :oppositionId="away.id"
            h2h
            :gameId="Number(gameId)"
        />

    </NuxtLayout>
</template>
<style lang="scss" scoped>
.badges {
    gap: var(--space-xs);
    margin-top: var(--space-xs);
    max-width: 100%;
    overflow: hidden;
    padding: var(--space-sm);
    text-overflow: ellipsis;
    min-width: 0;

    white-space: nowrap;
}
.game-request__container {
    position: fixed;
    top: 0;
    background-color: white;
    z-index: 4;
}
.game-badges--container {
    display: grid;
    grid-template-columns: repeat(2, 50%);
    padding: var(--space-md);
}
.placeholder--floating {
    position: absolute;
    top: 0;
    &:not(.right) {
        left: -1em;
        margin-right: var(--space-xs);
    }
    &.right {
        right: -1em;
        margin-left: var(--space-xs);
    }
}
</style>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import { createSheet } from "@/utils/create-game";
import Game from "@/store/models/game";
import Team from "@/store/models/team";
import GameTeam from "@/store/models/game-team";
import TeamStats from "@/store/models/team-stats";
import Rink from "@/store/models/rink";
import Sheet from "@/store/models/sheet";
import { useGameRequestStore } from "@/store/game-requests";
import { useNotificationStore } from "@/store/notification";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
const route = useRoute();
const { getGameResult } = useGame();

const gameRequest = computed(() =>
    useGameRequestStore().requests.find(
        ({ game_id }) => game_id === Number(route.params.id)
    )
);



const loading = ref(false);
const result = ref(null);
const error = ref(null);
const isAuthorized = ref(false);

const showMoreBadgesHome = ref(false);
const showMoreBadgesAway = ref(false);

const showMoreBadges = (name) => {
    if (name === 'home') {
        showMoreBadgesHome.value = !showMoreBadgesHome.value
    } else {
        showMoreBadgesAway.value = !showMoreBadgesAway.value
    }
}

const { id: gameId } = route.params;

const score = ref({});
const stats = ref({});

const games = ref([]);

const editedGame = ref(null);

const { getGames } = useGame();

const { setLoading } = useLoading();

const gameLoaded = ref(false);

const {
    isLoading: isLoadingGames,
    isSuccess: isGamesDone,
    data: currentGame,
} = useQuery({
    queryKey: ["game", Number(gameId)],
    queryFn: () =>
        getGames({
            team_id_param: null,
            game_id_param: Number(gameId),
        }),
    select: () => {
        const g =
            useRepo(Game)
                .withAllRecursive()
                .where("id", Number(gameId))
                .first() || {};
        const { teams } = g;

        if (!teams) return {};
        const ga = {
            ...g,
            home: g.teams
                .filter(({ home_team }) => !!home_team)
                .map((i) => ({
                    ...i.team,
                    pending: i.pending,
                }))[0],
            away: g.teams
                .filter(({ home_team }) => !home_team)
                .map((i) => ({
                    ...i.team,
                    pending: i.pending,
                }))[0],
            hammerFirstEndTeam: g.hammer_first_end,
            homeColor: g.teams[0].color,
            awayColor: g.teams[1].color,
            rink: useRepo(Rink).where("id", g.rink_id).first(),
            sheet: useRepo(Sheet).where("id", g.sheet_id).first(),
        };
        editedGame.value = ga;
        gameLoaded.value = true;
        return ga;
    },
});

const { getBadgesForGame } = useBadge();

const { isLoading: isLoadingBadges, data: badges } = useQuery({
    queryKey: ["game", "badges", Number(route.params.id)],
    queryFn: () => getBadgesForGame(Number(route.params.id)),
});

const home = computed(() => {
    if (isLoadingGames.value) return {};
    const team = useRepo(GameTeam)
        .with("team")
        .where("team_id", currentGame?.value?.teams[0]?.team_id)
        .where("game_id", Number(gameId))
        .first();
    return {
        ...team,
        ...(team?.team ?? {}),
    };
});
const away = computed(() => {
    if (isLoadingGames.value) return {};
    const team = useRepo(GameTeam)
        .with("team")
        .where("team_id", currentGame?.value?.teams[1]?.team_id)
        .where("game_id", Number(gameId))
        .first();
    return {
        ...team,
        ...(team?.team ?? {}),
    };
});

const getScoreDetails = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("ends")
        .select(
            `
        id,
        end_number,
        scoring_team_id,
        hammer_team_id,
        points_scored
    `
        )
        .eq("game_id", gameId);
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
                                  home.value?.id ||
                              (home.value?.pending &&
                                  !details[index]?.scoring_team_id)
                            ? details[index]?.points_scored
                            : 0,
                    away:
                        details[index]?.points_scored === null
                            ? "X"
                            : details[index]?.scoring_team_id ===
                                  away.value?.id ||
                              (away.value?.pending &&
                                  !details[index]?.scoring_team_id)
                            ? details[index]?.points_scored
                            : 0,
                    ...details[index],
                },
            };
        }
    }, {});
    return s;
};

// Var that indicates we should remove
// The team-stat from piniaOrm for the opposition
// when component unmounts
const cleanupOpposition = ref(false);

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

    data.forEach((stat) => {
        if (!stat.team_id && !game.away?.id) return;
        if (!stat.team_id) cleanupOpposition.value = true;
        useRepo(TeamStats).save({
            ...stat,
            team_id: stat.team_id ?? game.away.id,
            games_played: 1,
        });
    });
};

const cleanupOppositionStats = () => {
    const { away, id: gameId } = currentGame.value;
    const { id } = away;
    useRepo(TeamStats).destroy(`[${id},${gameId}]`);
};

onBeforeUnmount(() => {
    if (cleanupOpposition.value) cleanupOppositionStats();
});

const { isOnTeam } = useTeam();

const canEdit = computed(
    () => isOnTeam(home.value.id) || isOnTeam(away.value.id)
);

const { getTeamPlayers } = useTeam();
const enabled = computed(() => !!home.value.id && !!away.value.id);

const playersLoaded = ref(false);
const { isLoading: isLoadingPlayers } = useQuery({
    queryKey: ["game", "players", Number(route.params.id)],
    queryFn: async () => {
        await Promise.all([
            getTeamPlayers(home.value.id),
            getTeamPlayers(away.value.id),
        ]);
        return true;
    },

    enabled,
    select: (val) => {
        playersLoaded.value = true;
        return val;
    },
});

const statsLoaded = ref(false);

const initScoreAndStats = async () => {
    score.value = await generateScore(currentGame.value);
    await getStatsForGame(currentGame.value);
    statsLoaded.value = true;
};

watch(
    isLoadingGames,
    (val) => {
        if (val) return;
        initScoreAndStats();
    },
    { immediate: true }
);

const pageReady = computed(
    () => playersLoaded.value && gameLoaded.value && statsLoaded.value
);

watch(pageReady, (val) => {
    if (!val) return;
    setLoading(false);
});

const { toUTC } = useTime();

const queryClient = useQueryClient();

const notStore = useNotificationStore();

const updated = ref(false);

const onUpdate = async (val) => {
    if (updated.value) {
        updated.value = false;
        return;
    }
    updated.value = true;
    const notId = notStore.addNotification({
        text: "Updating game...",
        state: "pending",
    });
    const { start_time, rink = {}, sheet = {} } = val;
    const { id: rink_id } = rink ?? {};
    const { number: sheet_number } = sheet || {};

    let sheet_id;
    if (sheet_number) sheet_id = await createSheet(rink_id, sheet_number);

    const updates = {};
    if (sheet_id) updates.sheet_id = sheet_id;
    if (rink_id) updates.rink_id = rink_id;
    if (start_time) updates.start_time = toUTC(start_time, null, true);
    const client = useSupabaseClient();
    const { error } = await client
        .from("games")
        .update(updates)
        .eq("id", Number(gameId));
    if (!error)
        queryClient.invalidateQueries({
            queryKey: ["game", Number(gameId)],
        });

    if (error) {
        notStore.updateNotification(notId, {
            state: "failed",
            text: `Error updating game. Please refresh the page and try again.`,
        });
    } else {
        notStore.updateNotification(notId, {
            state: "completed",
            text: `Game updated!`,
            timeout: 1000,
        });
    }
};
</script>
<script>
export default {
    name: "Game",
};
</script>
