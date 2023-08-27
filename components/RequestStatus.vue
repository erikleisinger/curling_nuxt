<template>
    <q-chip
        ref="chipElement"
        rounded
        :color="
        isRevealed ? 'negative' : 
            STATUS_COLORS[status]
        "
        :outline="status === 'pending'"
        :text-color="isRevealed ? 'white' : TEXT_COLOR[status]"
        clickable
        class="request-status__container text-sm"
        @click="handleClick"
        dense
        size="md"
        :icon="ICONS[status]"
    >
        <div v-if="!isRevealed">{{ TEXT[status] || "Read only" }}</div>
        <div v-else-if="!waiting">Cancel request?</div>
        <div v-else>Invitation will be sent</div>
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
    status: String,
    requesteeId: [String, Number],
    resourceId: Number,
    resourceType: {
        type: String,
        default: "team",
    },
    waiting: Boolean,
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
    if (!props.canEdit) return;
    if (props.status === "pending") {
        if (props.resourceType === "team") {
            useTeamRequestStore().cancelTeamRequest({
                requestee_profile_id: props.requesteeId,
                team_id: props.resourceId,
            });
            emit("cancel");
        } else if (props.resourceType === "game") {
            const success = await useGameRequestStore().cancelGameRequest({
                team_id: props.requesteeId,
                game_id: props.resourceId,
            });
            if (success) emit("cancel");
        }
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
    }
    if (props.waiting) {
        cancel();
    } else {
        confirm();
    }
};

const chipElement = ref(null);

onClickOutside(chipElement, cancel);
</script>
