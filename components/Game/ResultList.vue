<template>
    <div
        v-for="(game, index) in games"
        :key="game.id"
        class="result__container"
    >
        <TeamGameResult :result="game" :notify="canVerify(game)">
            <!-- Verification -->
            <template
                v-slot:actions
                v-if="canVerify(game)
                       
                    "
            >
                <q-fab-action
                    color="white"
                    text-color="primary"
                    icon="verified"
                    @click="
                        respondToRequest(game.id, true, index, game.away_id)
                    "
                    >Verify game</q-fab-action
                >
                <q-fab-action
                    color="white"
                    text-color="red"
                    icon="new_releases"
                    @click="respondToRequest(game.id, false, index)"
                    >Reject game</q-fab-action
                >
            </template>
            <template v-slot:before>
                <div
                    class="game-request-response__container row items-center no-wrap"
                ></div>
            </template>
        </TeamGameResult>
        <q-separator />
    </div>
</template>
<style lang="scss">
.result__container {
    padding-top: var(--space-xxxs);
}
</style>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import { useNotificationStore } from "@/store/notification";
import { useThrottleFn } from "@vueuse/core";
const props = defineProps({
    results: {
        type: Array,
        default: [],
    },
});

const games = ref([]);

const confirmUnsaved = ref(false);

const canVerify = (game) => {
    return !game.verified && game.away_id && isAuthorized(game.away_id);
};

watch(
    () => props.results,
    () => {
        games.value = [...props.results];
    },
    { immediate: true }
);

const responding = ref(false);

const respondToRequest = useThrottleFn(
    async (gameId, accepted, index, teamId) => {
        const notStore = useNotificationStore();
        const notId = notStore.addNotification({
            text: accepted ? "Verifying game..." : "Rejecting game...",
            state: "pending",
        });
        responding.value = true;
        let updates;
        if (accepted) {
            updates = {
                verified: true,
                away: teamId,
            };
        } else {
            updates = {
                away: null,
                verified: false,
            };
        }
        const { data: updated } = await useSupabaseClient()
            .from("games")
            .update(updates)
            .eq("id", gameId)
            .select("verified,away")
            .single();
        const newGame = {
            ...games.value[index],
            verified: updated.verified,
            away_id: updated.away,
        };
        games.value[index] = newGame;
        responding.value = false;
        notStore.updateNotification(notId, {
            state: "completed",
            text: `Game result ${accepted ? "verified!" : "rejected."}`,
        });
    },
    1000
);

const isAuthorized = (teamId) => {
    return useUserTeamStore().userTeams.some(
        ({ id, is_admin }) => id === teamId
    );
};
</script>
