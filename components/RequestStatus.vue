<template>
    <q-chip
        ref="chipElement"
        rounded
        :color="
            !isRevealed
                ? STATUS_COLORS[status] ?? 'white'
                : waiting
                ? 'primary'
                : 'negative'
        "
        :outline="!status"
        :text-color="isRevealed ? 'white' : 'black'"
        clickable
        class="request-status__container text-sm"
        @click="handleClick"
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
    pending: "question_mark",
    rejected: "close",
};

const STATUS_COLORS = {
    accepted: "positive",
    pending: "warning",
    rejected: "negative",
};

const TEXT = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
};

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
