<template>
    <div class="container" v-if="!isLoadingGames" ref="container">
        <GamePageHeader :gameId="gameId" />
        <GamePageSummary :gameId="gameId" />
        <div class="details">
            <GamePageLinescore :gameId="gameId" />
            <GameStatsView :gameId="gameId" />
        </div>
        <div class="full-width row justify-around">

        <GamePageDeleteHandler :gameId="gameId" />
        <GamePageEditHandler :gameId="gameId"/>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.container {
    position: relative;
    padding-bottom: var(--space-xl);
    &:before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        width: 3px;
        height: 100%;
        border-left: 1px solid rgba(0, 0, 0, 0.08);
        border-right: 1px solid rgba(0, 0, 0, 0.08);
    }
}
.details {
    @include sm {
        padding: 0px var(--space-xl);
    }
    margin-bottom: var(--space-xxl);
}
</style>
<script setup>
import { useQuery} from "@tanstack/vue-query";

const props = defineProps({
    gameId: Number,
});


const { setLoading } = useLoading();

const { getGame } = useGame();

const gameLoaded = ref(false);

const {
    isLoading: isLoadingGames,
    isSuccess: isGamesDone,
    data: currentGame,
} = useQuery({
    queryKey: ["game", props.gameId],
    queryFn: () => getGame(props.gameId),
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

const getBadges = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("badges")
        .select("*")
        .eq("game_id", props.gameId);
};

// onMounted(() => {
//     getBadges()
// })

</script>
<script>
export default {
    name: "Game",
};
</script>
