<template>
    <div
        v-for="(game, index) in games"
        :key="game.id"
        class="result__container"
    >
        <LazyTeamGameResult
            :result="game"
            :notify="canVerify(game)"
            :authorized="!!isAuthorized(game.teams.find(({team_id}) => team_id === home)?.team_id)"
            @invite="inviteTeam($event, game)"
            :home="home"
        >
            <!-- Verification -->
            <template
                v-slot:actions
                v-if="canVerify(game) || isAuthorized(game.teams[0]?.team_id)"
            >
                <q-fab-action
                    v-if="canVerify(game)"
                    color="white"
                    text-color="primary"
                    icon="verified"
                    @click="
                        respondToRequest(game.id, true, index, game.teams[1]?.team_id)
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
                    v-if="
                        isAuthorized(game.home_id) && requiresVerification(game)
                    "
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
        </LazyTeamGameResult>
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
import {isPlaceholder} from '@/utils/team'
import GameTeam from '@/store/models/game-team'
const props = defineProps({
    home: Number,
    results: {
        type: Array,
        default: [],
    },
});

const games = ref([]);

const confirmUnsaved = ref(false);

const requiresVerification = (game) => {
    const awayTeam = game.teams.find(({team_id}) => team_id !== props.home) ?? {};
    if (awayTeam.pending) return true;
    return isPlaceholder(awayTeam.team_id, game.id)
}

const canVerify = (game) => {
    return requiresVerification(game) && isAuthorized(game.teams.find(({team_id}) => team_id !== props.home)?.team_id);
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
        try {
 if (accepted) {
            await acceptRequest(gameId, teamId)
            // updates = {
            //     verified: true,
            //     away: teamId,
            // };
        } else {
            await declineRequest(gameId, teamId)
            // updates = {
            //     away: null,
            //     verified: false,
            // };
        }
        } catch(e) {
              notStore.updateNotification(notId, {
            state: "failed",
            text: `Error occured when ${accepted ? 'verifying' : 'rejecting'} game (code: ${e.code})`,
        });
        }
       
        // const { data: updated } = await useSupabaseClient()
        //     .from("game_team_junction")
        //     .update(updates)
        //     .eq("id", gameId)
        //     .select("verified,away")
        //     .single();
        // const newGame = {
        //     ...games.value[index],
        //     verified: updated.verified,
        //     away_id: updated.away,
        // };
        // games.value[index] = newGame;
        responding.value = false;
        notStore.updateNotification(notId, {
            state: "completed",
            text: `Game result ${accepted ? "verified!" : "rejected."}`,
        });
    },
    1000
);

const acceptRequest = async (game_id, team_id) => {
    const {data, errors} = await useSupabaseClient().from('game_team_junction').update({
        team_id,
        game_id,
        pending: false
    }).eq('game_id', game_id).eq('team_id', team_id).select('pending')
    if (errors) throw new Error(errors);

    const [updates] = data;
    useRepo(GameTeam).where('team_id', team_id).where('game_id', game_id).update(updates);
    

}

const declineRequest = async (game_id, team_id) => {
    await useSupabaseClient().from('game_team_junction').delete().eq('game_id', game_id).eq('team_id', team_id)
}

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
    const homeId = game.teams.find(({team_id}) => team_id === props.home)?.team_id
    const {data, errors} = await useSupabaseClient().from('game_team_junction').update({team_id: team.id, game_id: game.id, pending: true}).eq('game_id', game.id).is('team_id', null).select(`*`)
    console.log('ERRORS: ', errors)
    if (errors) return;
    const [updates] = data;
    const {created_at, ...newGameTeam} = updates;
    useRepo(GameTeam).where('team_id', updates.game_id + 100000000).delete();
    useRepo(GameTeam).save(newGameTeam)


    if (errors) {
        notStore.updateNotification(notId,{
        text: `Error inviting ${team.name} (code ${errors.code})`,
        state: 'failed'
    })
    return;
    }

    useRepo(GameTeam).where('id', 20).update({avatar_type: 'avataaar'})

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
