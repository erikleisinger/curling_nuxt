<template>
    <q-chip
        ref="chipElement"
        rounded
        :color="STATUS_COLORS[status]"
        :text-color="status ? 'white' : 'black'"
        clickable
        class="request-status__container text-sm"
        @click="onChipClick"
    >
        {{ status || "Request access" }}
    </q-chip>
</template>
<script setup>
import { useEventListener } from "@vueuse/core";
import { useSocialStore } from "@/store/social";
const props = defineProps({
    initialStatus: String,
    profileId: String,
    resourceId: Number,
    resourceType: {
        type: String,
        default: "team",
    },
});

const status = ref(props.initialStatus);

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

const chipElement = ref(null);

const onUpdate = ({ detail }) => {
    const { status: newStatus } = detail;
    status.value = newStatus;
};

useEventListener(window, `REQUEST_${props.resourceId}_UPDATED`, onUpdate);

const onChipClick = () => {
    console.log(status.value);
    if (!status.value) {
        useSocialStore().sendTeamRequest({
            requestee_profile_id: props.profileId,
            team_id: props.resourceId,
        });
    } else if (status.value === "pending") {
        useSocialStore().cancelTeamRequest({
            requestee_profile_id: props.profileId,
            team_id: props.resourceId,
        });
    }
};
</script>
