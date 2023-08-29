<template>
    <q-chip
        ref="chipElement"
        rounded
        :color="isRevealed ? 'negative' : STATUS_COLORS[invitation.status]"
        :outline="invitation.status === 'pending'"
        :text-color="isRevealed ? 'white' : TEXT_COLOR[invitation.status]"
        clickable
        class="request-status__container text-sm"
        @click="handleClick"
        dense
        size="md"
        :icon="ICONS[invitation.status]"
    >
        <div v-if="!isRevealed">
            {{ TEXT[invitation.status] || "Read only" }}
        </div>
        <div v-else>Cancel invitation?</div>
    </q-chip>
</template>
<script setup>
import {
    useEventListener,
    useConfirmDialog,
    onClickOutside,
} from "@vueuse/core";
import { useTeamRequestStore } from "@/store/team-requests";
import { useGameRequestStore } from "@/store/game-requests";
const props = defineProps({
    canEdit: Boolean,
    invitation: Object,
    resourceType: String,
});

const ICONS = {
    accepted: "check",
    pending: "sym_o_outgoing_mail",
    rejected: "close",
};

const STATUS_COLORS = {
    accepted: "positive",
    pending: "",
    rejected: "negative",
};

const TEXT = {
    pending: "Invitation sent",
    accepted: "Accepted invite",
    rejected: "Rejected invite",
};

const TEXT_COLOR = {
    pending: 'primary',
    accepted: 'white',
    rejected: 'white'
}

const emit = defineEmits(["cancel"]);

const doAction = async () => {
    if (!props.canEdit || props.invitation.status !== 'pending') return;

        if (props.resourceType === "team") {
            const success = await useTeamRequestStore().deleteTeamRequest(props.invitation.requestId);
            if (success)emit("cancel");
        } else if (props.resourceType === "game") {
            const success = await useGameRequestStore().cancelGameRequest({
                team_id: props.requesteeId,
                game_id: props.resourceId,
            });
            if (success) emit("cancel");

    }
};

const { reveal, isRevealed, onConfirm, cancel, confirm, onCancel } =
    useConfirmDialog();

onConfirm(() => {
    doAction();
});

const handleClick = () => {
    if (!isRevealed.value && props.canEdit) {
        reveal();
        return;
    } else {
       confirm();
    }



};

const chipElement = ref(null);

onClickOutside(chipElement, cancel);
</script>
