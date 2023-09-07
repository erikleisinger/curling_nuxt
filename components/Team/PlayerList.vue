<template>
    <slot
        name="title"
        :editing="editing"
        :setEditing="setEditing"
        :loading="loading"
    />

    <div class="row">
        <TeamPlayer
            v-for="player in players"
            :key="player.id"
            :player="player"
            :editing="editing"
            @cancelInvitation="cancelRequest"
            @removePlayer="playerToRemove = $event"
            v-memo="[player?.first_name, player?.last_name, player?.username]"
        />
        <TeamPlayer v-if="editing" editing>
            <div
                class="full-height full-width row justify-center items-center no-wrap"
                v-ripple
                @click="
                    toggleGlobalSearch({
                        open: true,
                        options: {
                            inputLabel: 'Search for a user to invite',
                            resourceTypes: ['profile'],
                            filterIds: players.map(({ id }) => id),
                            callback: inviteUser,
                        },
                    })
                "
            >
                <q-icon name="add" color="blue" size="1.2em" />
                Invite player
            </div>
        </TeamPlayer>
    </div>
    <LazyDialogConfirmation
        v-if="!!playerToRemove"
        confirmButtonText="Remove from team"
        cancelButtonText="Cancel"
        @confirm="removePlayer"
        @close="closeRemovePlayerDialog"
        cancelColor=""
        confirmColor="negative"
    >
        Are you sure you want to remove {{ playerToRemove.first_name }}
        {{ playerToRemove.last_name }} from the team?
    </LazyDialogConfirmation>
</template>
<style lang="scss" scoped>
.player__container {
    width: min(calc(50% - var(--space-xs) * 2), 250px);
    padding: var(--space-xxs);
    border: 1px solid $grey-4;
    border-radius: 8px;
    margin: var(--space-xs);
    transition: all 0.2s;
    position: relative;
    &.editing {
        border: 2px solid $blue-5;
        transform: scale(1.05);
    }
    .edit-overlay {
        $overlay-color: rgba(0, 0, 0, 0.7);
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        border-radius: inherit;
        border: 2px solid $overlay-color;
        position: absolute;
        background-color: $overlay-color;
        box-sizing: border-box;
    }
}
.member-avatar__wrap {
    position: relative;
    aspect-ratio: 1/1;
    overflow: visible;
    .member-avatar__container {
        overflow: visible;
        transition: all 0.2s;
        cursor: pointer;
    }
}
</style>
<script setup>
import { useTeamRequestStore } from "@/store/team-requests";
import { useDialogStore } from "@/store/dialog";
import { toRef } from "@vueuse/core";
import { TEAM_POSITIONS } from "@/constants/team";
import Player from "@/store/models/player";
import TP from "@/store/models/team-player";
import Team from "@/store/models/team";

const { deleteTeamRequest, sendTeamRequest, updateTeamRequestStatus } =
    useTeamRequestStore();
const { toggleGlobalSearch } = useDialogStore();

const props = defineProps({
    showPending: Boolean,
    teamId: Number,
});
const emit = defineEmits(['loaded'])

const players = computed(() => {
    const p = useRepo(TP).with("player").where("team_id", props.teamId).get();
    return p.map(({ player, status }) => ({
        ...player,
        status,
    }));
});
const getPlayers = async () => {
    loading.value = true;
    const { getTeamPlayers } = useTeam();
    await getTeamPlayers(props.teamId, props.showPending);
    loading.value = false;
    emit('loaded')
    
};

const loading = ref(false);

onMounted(() => {
    nextTick(() => {
  getPlayers();
    })
  
});

const editing = ref(false);
const setEditing = (bool) => {
    editing.value = bool;
};

const showOverlay = ref(false);

const onClick = () => {
    if (!editing.value) return;
    showOverlay.value = true;
};

const inviteUser = async (user) => {
    if (!user?.profile_id) return;
    const rowId = await sendTeamRequest({
        requestee_profile_id: user?.profile_id,
        team_id: props.teamId,
    });

    if (!rowId) return;
    const newUser = {
        ...user,
        rowId,
        status: "pending",
        id: user.profile_id,
        username: user.name,
        avatar: user.avatar ? JSON.parse(user.avatar) : {},
    };
    players.value.push(newUser);
};

const cancelRequest = async (id) => {
    const success = await deleteTeamRequest(id);
    if (!success) return;
    const index = players.value.findIndex(({ rowId }) => rowId === id);
    if (index === -1) return;
    players.value.splice(index, 1);
};

const playerToRemove = ref(null);

const removePlayer = async () => {
    const { error } = await useSupabaseClient()
        .from("team_profile_junction")
        .delete()
        .eq("team_id", props.teamId)
        .eq("profile_id", playerToRemove.value?.id);

    if (error) return;
    const index = players.value.findIndex(
        ({ id }) => playerToRemove.value?.id === id
    );
    if (index === -1) return;

    players.value.splice(index, 1);
};

const closeRemovePlayerDialog = () => {
    setTimeout(() => {
        playerToRemove.value = null;
    }, 200);
};

// const players = ref([]);

// watch(
//     () => props.players,
//     () => {
//         players.value = [...props.players];
//     },
//     { immediate: true }
// );
</script>
<script>
export default {
    name: "TeamPlayers",
};
</script>
