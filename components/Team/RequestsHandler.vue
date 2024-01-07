<template>
<DialogCard class="invited-container__floating" :class="{ move: invited }"  ref="invitedContainer">
    <template v-slot:title>
You have been invited to join {{team.name}}.
    </template>
    <template v-slot:footer>
 <q-btn
                class="cancelbtn"
                rounded
                @click="respondToRequest('rejected')"
                :disable="responding"
                :loading="responding"
                >Decline</q-btn
            >
            <q-btn flat @click="doInviteAnimation(false)">
                Hide</q-btn>
            <q-btn
               class="confirmbtn"
                rounded
                @click="respondToRequest('accepted')"
                :disable="responding"
                :loading="responding"
                >Accept</q-btn
            >
    </template>
</DialogCard>

    <div class="full-width row justify-center">
        <TeamPlayerChangeListener :teamId="props.teamId" />

        <q-btn
            v-if="!onlyInvite && !isOnTeam && !isLoading && !isRequested"
            rounded
            size="md"
            color="primary"
            @click="requestToJoin"
            >Request to join team</q-btn
        >
    </div>
</template>
<style lang="scss" scoped>
.invited-container__floating {
    position: fixed;
    bottom: 100px;
    z-index: 3;


    margin: auto;
    left: 0;
    right: 0;
    width: 0px;
    height: 0px;
    visibility: hidden;

    &.move {
        width: fit-content;
        height: fit-content;
        // padding: var(--space-md);
        visibility: visible;
    }
    .hide {
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: -1em;
    }
    .cancelbtn,
    .confirmbtn {
        color: white;
    }
    .cancelbtn {
        background-color: $app-red;
    }
    .confirmbtn {
        background-color: $app-mint;
    }
}
</style>
<script setup>
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import Team from "@/store/models/team";
import { useTeamRequestStore } from "@/store/team-requests";
import { useUserTeamStore } from "@/store/user-teams";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useDebounceFn } from "@vueuse/core";
import { useNotificationStore } from "@/store/notification";

gsap.registerPlugin(Flip);

const queryClient = useQueryClient();

const props = defineProps({
    onlyInvite: Boolean,
    teamId: Number,
});

const { user: userId } = useUser();

const team = computed(() =>
    useRepo(Team).with("players").where("id", props.teamId).first()
);

const requests = computed(() =>
    team.value?.players
        .map((p) => ({
            ...p,
            ...p.pivot,
        }))
        .filter(({ status }) => status === "invited" || status === "requested")
);

const isOnTeam = computed(() =>
    team.value?.players.some(
        ({ id, pivot }) =>
            id === userId.value &&
            pivot.status !== "invited" &&
            pivot.status !== "requested"
    )
);
const isInvited = computed(() =>
    requests.value?.some(
        ({ player_id, status }) =>
            player_id === userId.value && status === "invited"
    )
);
const isRequested = computed(() =>
    requests.value?.some(
        ({ player_id, status }) =>
            player_id === userId.value && status === "requested"
    )
);

const { getTeamPlayers } = useTeam();

const { isLoading } = useQuery({
    queryKey: ["team", "players", props.teamId],
    queryFn: () => getTeamPlayers(props.teamId),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
});

// SEND request to join

const requestToJoin = async () => {
    useTeamRequestStore().sendTeamRequest({
        team_id: props.teamId,
        requester_profile_id: userId.value,
    });
};

// Accept team request

const responding = ref(false);
const respondToRequest = async (status) => {
    responding.value = true;
    const { request_id } = requests.value?.find(
        ({ player_id }) => userId.value === player_id
    );
    await useTeamRequestStore().updateTeamRequestStatus({
        id: request_id,
        status,
    });
    await useUserTeamStore().fetchUserTeams(true);
    useNotificationStore().addNotification({
        state: "completed",
        text: "Invitation accepted!",
        timeout: 3000,
    });
    responding.value = false;
    doInviteAnimation(false);
};

// INVITED ANIMATIONS

const invitedContainer = ref(null);

const doInviteAnimation = (show) => {
    const state = Flip.getState(".invited-container__floating");
    invited.value = show;
    nextTick(() => {
        Flip.from(state, {
            duration: 0.5,
            scale: true,
            ease: "power",
            nested: true,
        });
    });
};

const invited = ref(false);
watch(isInvited, (val) => {
    doInviteAnimation(val);
});

onMounted(() => {
    doInviteAnimation(isInvited.value);
});
</script>
