<template>
    <q-badge
        :color="isVerified ? 'primary' : 'red'"
        @click="
            () => {
                if (isVerified) return;
                verifiedPopup = true;
            }
        "
        >{{ isVerified ? "Verified" : "Unverified" }}</q-badge
    >
    <DialogInfo
        v-if="!!verifiedPopup"
        :confirmButtonText="
            !pendingTeam.id ? 'Invite team' : 'Accept result'
        "
        cancelButtonText="Reject result"
        @confirm="onRequestConfirm"
        @close="verifiedPopup = false"
        cancelColor="negative"
        :confirmColor="!pendingTeam.id ? 'blue' : 'positive'"
        :showConfirm="
            isOnTeam(pendingTeam?.id) ||
            (isOnTeam(creatorTeam?.id) && !pendingTeam?.id)
        "
    >
        <span v-if="isOnTeam(pendingTeam?.id)">
            <strong>{{ creatorTeam.name }}</strong> added this game result and
            has invited you to verify that it is real.
            <br />
            <br />
            If the game result is valid (i.e. the game occured), press
            <span class="text-positive text-bold">Accept Result.</span> It will
            then contribute towards your season statistics.

        </span>
        <span v-else>
            This game was created by <strong>{{ creatorTeam.name }}</strong
            >.
            <span v-if="pendingTeam?.id">
                <br />
                <br />

                It will only contribute to
                <strong>{{ pendingTeam.name }}'s</strong> statistics once it is
                verified by a member of <strong>{{ pendingTeam.name }}</strong
                >.
            </span>
            <span v-else>
                <br />
                <br />
                <span class="text-negative"
                    >The name <strong>{{ pendingTeam.name }}</strong> was used
                    as a placeholder, as the real
                    <strong>{{ pendingTeam.name }}</strong> does not have an
                    account.
                </span>
                <span v-if="isOnTeam(creatorTeam.id)">
                    <br />
                    <br />
                    To invite a team to verify this game, press
                    <strong>Invite team</strong>
                </span>
            </span>
        </span>
    </DialogInfo>
</template>
<script setup>
import { useGameRequestStore } from "@/store/game-requests";
import Game from "@/store/models/game";
import TeamPlayer from '@/store/models/team-player'
import { useQuery } from "@tanstack/vue-query";


const props = defineProps({
    gameId: Number,
});

const emit = defineEmits(['refresh'])

const { getTeamPlayers } = useTeam();



const game = computed(() =>
    useRepo(Game).withAllRecursive().where("id", props.gameId).first()
);

const pendingTeam = computed(() =>
    game.value.teams.find(({ pending }) => !!pending)?.team ?? {}
);
const creatorTeam = computed(() =>
    game.value.teams.find(({ pending }) => !pending)?.team ?? {}
);

const {isLoading} = useQuery({
    queryKey: ['game', 'players', props.gameId],
    queryFn: () => Promise.all([getTeamPlayers(pendingTeam.value.id), getTeamPlayers(creatorTeam.value.id)]),
   
    enabled: !!pendingTeam.value?.id
})

const { isOnTeam } = useTeam();


const verifiedPopup = ref(false);
const isVerified = computed(() => game.value.isVerified);

const { getGameRequestsByUser, updateGameRequestStatus, sendGameRequest } = useGameRequestStore();

const respondToRequest = async (status) => {
    verifiedPopup.value = false;
    await updateGameRequestStatus({
        team_id: pendingTeam.value?.id,
        game_id: props.gameId,
        status,
    });
    emit('refresh')
    getGameRequestsByUser();
};

const onRequestConfirm = () => {
    if (!pendingTeam.value?.id) {
        toggleGlobalSearch({
            open: true,

            options: {
                resourceTypes: ["team"],
                inputLabel: "Invite a team to verify this game",
                filterIds: [creatorTeam.value?.id],
                callback: onOptionClick,

                persistent: true,
            },
        });
    } else {
        respondToRequest("accepted");
    }
};


const onOptionClick = async (e) => {
      toggleGlobalSearch({
        open: false,
    });
    await sendGameRequest(e, props.gameId);
    emit('refresh')
  
};
</script>
