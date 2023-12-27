<template>
    <q-badge
        :color="isVerified ? 'primary' : 'red'"
        @click.stop="
            () => {
                verifiedPopup = true;
            }
        "
        >{{ isVerified ? "Verified" : "Unverified" }}</q-badge
    >
    <DialogInfo
        v-if="!!verifiedPopup"
        :confirmButtonText="
            pendingTeam.id > 100000000 ? 'Invite team' : 'Accept result'
        "
        cancelButtonText="Reject result"
        @confirm="onRequestConfirm"
        @close="verifiedPopup = false"
        cancelColor="negative"
        :confirmColor="!pendingTeam.id ? 'blue' : 'positive'"
        :showConfirm="
        !isVerified &&
            isOnTeam(pendingTeam?.id) ||
            (isOnTeam(creatorTeam?.id) && pendingTeam?.id > 100000000)
        "
    >

    <!-- CREATOR VIEW -->
        <span v-if="!isVerified && isOnTeam(pendingTeam?.id)">
            <TeamChip :teamId="creatorTeam.id"/> added this game result and
            has invited you to verify that it is real.
            <br />
            <br />
            If the game result is valid (i.e. the game occured), press
            <span class="text-positive text-bold">Accept Result.</span> It will
            then contribute towards your season statistics.

        </span>
        <span v-else-if="!isVerified">
            This game was created by <TeamChip :teamId="creatorTeam.id"/>.
            <span v-if="pendingTeam?.id < 100000000">
                <br />
                <br />

                It will only contribute to
                <TeamChip :teamId="pendingTeam.id"/>'s statistics once it is
                verified by a member of <TeamChip :teamId="pendingTeam.id"/>.
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
        <span v-else>
              This game was created by <TeamChip :teamId="creatorTeam.id"/>.
            <br/>

        <br/>
        It has been verified by <TeamChip :teamId="pendingTeam.id"/> and contributes towards their season stats.
        </span>
    </DialogInfo>
</template>
<script setup>
import { useGameRequestStore } from "@/store/game-requests";
import {useDialogStore} from '@/store/dialog'
import Game from "@/store/models/game";
import TeamPlayer from '@/store/models/team-player'
import { useQuery } from "@tanstack/vue-query";


const props = defineProps({
    gameId: Number,
});

const emit = defineEmits(['refresh'])

const { getFullTeam } = useTeam();



const game = computed(() =>
    useRepo(Game).withAllRecursive().where("id", props.gameId).first()
);

const pendingTeam = computed(() =>
    game.value.teams.find(({ home_team }) => !home_team)?.team ?? {}
);
const creatorTeam = computed(() =>
    game.value.teams.find(({ pending }) => !pending)?.team ?? {}
);

const creatorQueryEnabled = computed(() => !!creatorTeam.value?.id)
const {isLoading} = useQuery({
    queryKey: ['team', 'full', creatorTeam.value.id],
    queryFn: () => getFullTeam({id: creatorTeam.value.id }),
    refetchOnWindowFocus: false,
    enabled: creatorQueryEnabled,
})

const pendingQueryEnabled = computed(() => !!pendingTeam.value?.id)
const {isLoading: isLoadingPending} = useQuery({
    queryKey: ['team', 'full', pendingTeam.value.id],
    queryFn: () => getFullTeam({id: pendingTeam.value.id }),
    refetchOnWindowFocus: false,
    enabled: pendingQueryEnabled,
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

const robotTeam = computed(() => pendingTeam.value?.id > 100000000)

const onRequestConfirm = () => {
    if (isVerified.value) return;
    if (robotTeam.value) {
        useDialogStore().toggleGlobalSearch({
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
      useDialogStore().toggleGlobalSearch({
        open: false,
    });
    await sendGameRequest(e, props.gameId);
    emit('refresh')
  
};
</script>
