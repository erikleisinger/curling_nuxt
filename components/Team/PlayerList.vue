<template>
    <slot name="title" :editing="editing" :setEditing="setEditing" />
    <div class="row">
        <LazyTeamPlayer
            v-for="player in playerList"
            :key="player.id"
            :player="player"
            :editing="editing"
            @cancelInvitation="cancelRequest"
            @removePlayer="playerToRemove = $event"
        />
        <LazyTeamPlayer v-if="editing" editing>
            <div
                class="full-height full-width row justify-center items-center no-wrap"
                v-ripple
                @click="
                    toggleGlobalSearch({
                        open: true,
                        options: {
                            inputLabel: 'Search for a user to invite',
                            resourceTypes: ['profile'],
                            filterIds: playerList.map(({ id }) => id),
                            callback: inviteUser,
                        },
                    })
                "
            >
                <q-icon name="add" color="blue" size="1.2em" />
                Invite player
            </div>
        </LazyTeamPlayer>
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
       Are you sure you want to remove {{playerToRemove.first_name}} {{playerToRemove.last_name}} from the team? 
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

const { deleteTeamRequest, sendTeamRequest, updateTeamRequestStatus } =
    useTeamRequestStore();
const { toggleGlobalSearch } = useDialogStore();

const props = defineProps({
    players: Array,
    teamId: Number,
});

const positions = {
    lead: {
        name: "Lead",
        icon: "looks_one",
        value: "lead",
    },
    second: {
        name: "Second",
        icon: "looks_two",
        value: "second",
    },
    third: {
        name: "Third",
        icon: "looks_three",
        value: "third",
    },
    fourth: {
        name: "Fourth",
        icon: "looks_four",
        value: "fourth",
    },
    fifth: {
        name: "Fifth",
        icon: "looks_five",
        value: "fifth",
    },
    coach: {
        name: "Coach",
        icon: "assignment",
        value: "coach",
    },
    alternate: {
        name: "Alternate",
        icon: "exposure_zero",
        value: "alternate",
    },
    skip: {
        name: "Skip",
        icon: "psychology",
        value: "skip",
    },
};

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
    playerList.value.push(newUser);
};

const cancelRequest = async (id) => {
    const success = await deleteTeamRequest(id);
    if (!success) return;
    const index = playerList.value.findIndex(({ rowId }) => rowId === id);
    if (index === -1) return;
    playerList.value.splice(index, 1);
};

const playerToRemove = ref(null)

const removePlayer = async () => {
    const { error } = await useSupabaseClient()
        .from("team_profile_junction")
        .delete()
        .eq("team_id", props.teamId)
        .eq("profile_id", playerToRemove.value?.id);

    if (error) return;
    const index = playerList.value.findIndex(({ id }) => playerToRemove.value?.id === id);
    if (index === -1) return;

    playerList.value.splice(index, 1);
};

const closeRemovePlayerDialog = () => {
    setTimeout(() => {
        playerToRemove.value = null;
    }, 200)
}

const playerList = ref([]);

watch(
    () => props.players,
    () => {
        playerList.value = [...props.players];
    },
    { immediate: true }
);
</script>
