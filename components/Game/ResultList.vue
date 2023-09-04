<template>
    <div
        v-for="(game, index) in games"
        :key="game.id"
        class="result__container"
    >
        <TeamGameResult :result="game" :notify="canVerify(game)" :authorized="!!isAuthorized(game.home_id)" @invite="inviteTeam($event, game)">
            <!-- Verification -->
            <template
                v-slot:actions
                v-if="canVerify(game) || isAuthorized(game.home_id)
                       
                    "
            >
                <q-fab-action
                v-if="canVerify(game)"
                    color="white"
                    text-color="primary"
                    icon="verified"
                    @click="
                        respondToRequest(game.id, true, index, game.away_id)
                    "
                    >Verify game</q-fab-action
                >
                <q-fab-action
                  v-if="canVerify(game)"
                    color="white"
                    text-color="red"
                    icon="new_releases"
                    @click="respondToRequest(game.id, false, index)"
                    >Reject game</q-fab-action
                >
                  <q-fab-action
                  v-if="isAuthorized(game.home_id) && requiresVerification(game)"
                    color="white"
                    text-color="red"
                    icon="new_releases"
                    @click="cancelRequest(game)"

                    >Cancel verification request</q-fab-action
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

const requiresVerification = (game) => {
    return !game.verified && game.away_id
}

const canVerify = (game) => {
    return requiresVerification(game) && isAuthorized(game.away_id);
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

const inviteTeam = async (team, game) => {
    if (!team?.id || !game?.id || !isAuthorized(team?.id)) return;
    const notStore= useNotificationStore();

    const notId = notStore.addNotification({
        text: 'Inviting team to verify game...',
        state: 'pending'
    })
    const {data, error} = await useSupabaseClient().from('games').update({away: team.id}).eq('id', game.id).select(`
    away (
        id,
        name,
        avatar_url,
        avatar_type,
        team_avatar
    ),
    verified
    `)


     const [updatedGame] = data;

    if (error || !updatedGame) {
        notStore.updateNotification(notId,{
        text: `Error inviting ${team.name} (code ${error.code})`,
        state: 'failed'
    })
    return;
    } 
   
    const index = games.value.findIndex(({id}) => id === game.id);
    if (index !== -1) games.value.splice(index, 1, {
        ...games.value[index],
        away_id: updatedGame.away.id,
        away_avatar_type: updatedGame.away.avatar_type,
        away_avatar_url: updatedGame.away.avatar_url,
        away_avatar: updatedGame.away.team_avatar,
        away_name: updatedGame.away.name,
        verified: updatedGame.verified
    })
         notStore.updateNotification(notId,{
        text: `${team.name} was invited to verify the game.`,
        state: 'completed'
    })
    
}

const cancelRequest = async (game) => {
    if (!game?.id) return;
    const notStore= useNotificationStore();

    const notId = notStore.addNotification({
        text: `Cancelling invitation to ${game.away_name}...`,
        state: 'pending'
    })
    const {data, error} = await useSupabaseClient().from('games').update({away: null}).eq('id', game.id).select(`
    placeholder_away,
    verified
    `)


     const [updatedGame] = data;

    if (error || !updatedGame) {
        notStore.updateNotification(notId,{
        text: `Error cancelling invitation to ${game.away_name} (code ${error.code})`,
        state: 'failed'
    })
    return;
    } 
   
    const index = games.value.findIndex(({id}) => id === game.id);
    if (index !== -1) games.value.splice(index, 1, {
        ...games.value[index],
        away_id: updatedGame.away?.id,
        away_avatar_type: null,
        away_avatar_url:null,
        away_avatar: null,
        away_name: updatedGame.placeholder_away,
        verified: updatedGame.verified

    })
         notStore.updateNotification(notId,{
        text: `Invitation to ${game.away_name} was cancelled.`,
        state: 'completed'
    })
    
}
</script>
