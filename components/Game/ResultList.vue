<template>
    <div
        v-for="(game, index) in games"
        :key="game.id"
        class="result__container"
    >
    <!-- v-if="
                        !game.verified &&
                        game.away_id &&
                        isAuthorized(game.away_id)
                    " -->
        <TeamGameResult :result="game">
            <template v-slot:before>
                <div
                    class="game-request-response__container row items-center no-wrap justify-end"
                    
                >
                    <h3 class="text-sm text-bold">Verify game</h3>
                  <q-btn
                        color="red"
                        
                        class="q-mx-sm"
                        @click="
                            respondToRequest(game.id, false, index)
                        "
                        :loading="responding"
                        dense
                        round
                        icon="close"
                        />
                    <q-btn
                        color="green"
                        
                        class="q-mx-sm"
                        @click="
                            respondToRequest(game.id, true, index, game.away_id)
                        "
                        :loading="responding"
                        dense
                        round
                        icon="check"
                        />
                         <q-btn
                        color="primary"
                        
                        class="q-mx-sm"
                        :loading="responding"
                       
                        rounded
                        icon="check"
                        label="view"
                        no-wrap
                        :to="`/games/${game.id}`"
                        />
                
                
                </div>
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
import {useNotificationStore} from '@/store/notification'
import { useThrottleFn } from "@vueuse/core";
const props = defineProps({
    results: {
        type: Array,
        default: [],
    },
});

const games = ref([]);

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
            text: accepted ? 'Verifying game...' : 'Rejecting game...',
            state: 'pending',

        })
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
            state: 'completed',
            text: `Game result ${accepted ? 'verified!' : 'rejected.'}`
        })
    },
    1000
);

const isAuthorized = (teamId) => {
    return useUserTeamStore().userTeams.some(
        ({ id, is_admin }) => id === teamId
    );
};
</script>
