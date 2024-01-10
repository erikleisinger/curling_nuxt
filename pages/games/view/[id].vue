<template>
    <GamePageHeader :gameId="gameId" />
    <GamePageSummary :gameId="gameId" />
    <GamePageLinescore :gameId="gameId" />
    <GameStatsView :gameId="Number(gameId)" />
</template>

<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import { createSheet } from "@/utils/create-game";
import { useNotificationStore } from "@/store/notification";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
const route = useRoute();

const gameId = Number(route.params.id);

const score = ref({});
const stats = ref({});

const editedGame = ref(null);

const { setLoading } = useLoading();

const { getGames } = useGame();
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
    select: (val) => {
        gameLoaded.value = true;
        return val;
    },
});

const pageReady = computed(() => gameLoaded.value);

watch(pageReady, (val) => {
    if (!val) return;
    setLoading(false);
});

const { toUTC } = useTime();

const queryClient = useQueryClient();

const notStore = useNotificationStore();

const refreshGame = () => {
    queryClient.invalidateQueries({
        queryKey: ["game", Number(gameId)],
    });
};

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
    const { start_time, rink = {}, sheet = {}, league = {} } = val;
    const { id: rink_id } = rink ?? {};
    const { number: sheet_number } = sheet || {};
    const { id: league_id } = league || {};

    let sheet_id;
    if (sheet_number) sheet_id = await createSheet(rink_id, sheet_number);

    const updates = {};
    if (sheet_id) updates.sheet_id = sheet_id;
    if (rink_id) updates.rink_id = rink_id;
    if (start_time) updates.start_time = toUTC(start_time, null, true);
    if (league_id) updates.league_id = league_id;
    const client = useSupabaseClient();
    const { error } = await client
        .from("games")
        .update(updates)
        .eq("id", Number(gameId));
    if (!error) refreshGame();

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

const { toTimezone } = useTime();
</script>
<script>
export default {
    name: "Game",
};
</script>
