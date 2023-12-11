<template>
    <div v-if="requestType === 'game'" style="min-height: 50px">
        <div class="game-request__container row no-wrap items-center">
            <div class="avatar-container">
                <TeamAvatar :teamId="sender.id" />
            </div>
            <div class="text">
                <strong> {{ sender.name }}</strong> invited you to verify a
                game.
            </div>
            <div>
                <q-btn
                    @click="navigateTo(`/games/view/${props.request.game.id}`)"
                    flat
                >
                    View
                </q-btn>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.avatar-container {
    width: 30px;
}
.game-request__container {
    padding: var(--space-sm);
    .text {
        margin: 0px var(--space-sm);
    }
}
</style>
<script setup>
import { useQuery } from "@tanstack/vue-query";
const props = defineProps({
    request: Object,
});

const requestType = computed(() => props.request.type);
const sender = computed(() => {
    if (requestType.value === "game") {
        return props.request?.game?.home;
    }
    return null;
});
const showing = ref(false);

const showGame = computed(() => showing.value);

const { getGames } = useGame();

const { isLoading, data: game } = useQuery({
    queryKey: ["game", props.request.game?.id],
    queryFn: () =>
        getGames({
            team_id_param: null,
            game_id_param: props.request.game?.id,
        }),
    enabled: showGame,
});
</script>
