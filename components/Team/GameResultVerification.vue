<template>
    <q-badge
        :style="{backgroundColor: isVerified ? getColor('mint') : getColor('slate')}"
        class="badge"
        rounded
        @click.stop="
            () => {
                verifiedPopup = true;
            }
        "
        >{{ isVerified ? "Verified" : "Unverified" }}</q-badge
    >
      <GlobalMenu v-model="verifiedPopup">
        <DialogCard>
            <template v-slot:title>
                {{isVerified ? 'Verified game' : 'Unverified game'}}
            </template>
            <template v-slot:content>
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
            <span v-if="pendingTeam?.id">
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
        It has been verified by both teams and contributes towards their season stats.
        </span>
            </template>
            <template v-slot:footer>
                 <div class="row justify-between q-py-sm full-width">
                    <Button color="white" textColor="slate" @click="verifiedPopup = false">Close</Button>
                    <Button color="mint" @click="onRequestConfirm">{{robotTeam ? 'Invite team' : 'Verify game'}}</Button>
                 </div>

                    
                </template>
        </DialogCard>
      </GlobalMenu>
    <!-- <DialogInfo
        v-if="!!verifiedPopup"
        :confirmButtonText="
            pendingTeam.id ? 'Invite team' : 'Accept result'
        "
        cancelButtonText="Reject result"
        @confirm="onRequestConfirm"
        @close="verifiedPopup = false"
        cancelColor="negative"
        :confirmColor="!pendingTeam.id ? 'blue' : 'positive'"
        :showConfirm="
        !isVerified &&
            (isOnTeam(pendingTeam?.id) ||
            (isOnTeam(creatorTeam?.id) && !!pendingTeam?.id))
        "
    > -->

    <!-- CREATOR VIEW -->
        <!-- <span v-if="!isVerified && isOnTeam(pendingTeam?.id)">
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
            <span v-if="pendingTeam?.id">
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
        It has been verified by both teams and contributes towards their season stats.
        </span>
    </DialogInfo> -->
      <!-- </GlobalMenu> -->
</template>
<style lang="scss" scoped>
    .badge {
        transform: scale(0.9);
        padding: 4px 8px;
        font-weight: bold;
        @include text-caption;
        line-height: 0.9;
        @include sm {
            padding-top: 8px;
        }
     
    }
</style>
<script setup>
import { useGameRequestStore } from "@/store/game-requests";
import {useDialogStore} from '@/store/dialog'
import Game from "@/store/models/game";
import TeamPlayer from '@/store/models/team-player';
import Team from '@/store/models/team';
import GameTeam from '@/store/models/game-team'
import { useQuery, useQueryClient } from "@tanstack/vue-query";
const queryClient = useQueryClient()

const props = defineProps({
    gameId: Number,
});

const emit = defineEmits(['refresh'])

const game = computed(() =>
    useRepo(Game).withAllRecursive().where("id", props.gameId).first()
);


const creatorTeam = computed(() =>
    game.value.teams.find(({ pending }) => !pending)?.team ?? {}
);

const { isOnTeam } = useTeam();

const {getColor} = useColor();


const verifiedPopup = ref(false);
const isVerified = computed(() => game.value?.isVerified);

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

const robotTeam = computed(() => !pendingTeam.value?.id)

const onRequestConfirm = async () => {
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
        await updateGtj();
        queryClient.invalidateQueries({
            queryKey: ['game', props.gameId]
        })
    }
};

const updateGtj = async () => {
    const client = useSupabaseClient();
    await client.from('game_team_junction').update({pending: false}).eq('game_id', props.gameId).eq('team_id', pendingTeam.value?.id)
}


const onOptionClick = async (e) => {
      useDialogStore().toggleGlobalSearch({
        open: false,
    });
    await sendGameRequest(e, props.gameId);
    emit('refresh')
  
};

const getGameRequests = async () => {
    const client = useSupabaseClient();
    const {data} = await client.from('game_requests').select(`
        id,
        created_at,
        status,
        team:team_id (
            id,
            name,
            avatar_url
        )
    `).eq('game_id', props.gameId).single()

    const {team} = data ?? {};

    if (team) {
        useRepo(Team).save(team)
    }

    return data;
}

const {isLoading, data: request} = useQuery({
    queryKey: ['game', 'requests', props.gameId],
    queryFn: getGameRequests,
    refetchOnWindowFocus: false,
})

const pendingTeam = computed(() => {
    if (request?.value?.team) return request?.value?.team
    const p = game.value.teams.find(({ pending }) => !!pending) ?? {};
    return {
        ...(p?.team ?? {}),
        name: p.placeholder
    }
}
);
</script>
