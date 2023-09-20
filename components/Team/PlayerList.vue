<template>

    <div class="row">
        <TeamPlayer
            v-for="player in players"
            :key="player.id"
            :player="player"
            :editing="editing"
            @cancelInvitation="cancelRequest"
            @removePlayer="playerToRemove = $event"
            v-memo="[
                player?.first_name,
                player?.last_name,
                player?.username,
                editing,
                player?.position,
            ]"
            :teamId="teamId"
        />
        <TeamPlayer v-if="create || editing" editing>
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
                            callback: onSearchSelect,
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
    create: Boolean,
    editing: Boolean,
    showPending: Boolean,
    teamId: Number,
});
const emit = defineEmits(["loaded", "update"]);

const players = computed(() => {
        const p = useRepo(TP)
            .with("player")
            .where("team_id", props.teamId)
            .get();
        return p.map(({ player, status, position }) => ({
            ...player,
            status,
            position,
        })).sort((a, b) => {
            return TEAM_POSITIONS[b.position]?.sortOrder ?? -1 - TEAM_POSITIONS[a.position]?.sortOrder ?? -1
        })
    
});
const getPlayers = async () => {
    loading.value = true;
    const { getTeamPlayers } = useTeam();
    await getTeamPlayers(props.teamId, props.showPending);
    loading.value = false;
    emit("loaded");
};

const loading = ref(false);

onMounted(() => {
    if (props.create) return;
    nextTick(() => {
        getPlayers();
    });
});

const showOverlay = ref(false);

const onClick = () => {
    if (!props.editing) return;
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

const onSearchSelect = (user) => {
    if (props.create) {
        const formattedUser = {
            ...user,
            id: user.profile_id,
            username: user.name
        }
        useRepo(Player).save(formattedUser)
        emit("update", [...players.value, formattedUser]);
    } else {
        inviteUser(user);
    }
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
