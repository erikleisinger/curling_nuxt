<template>
    <div>
        <div v-if="!canEdit" class="row full-width justify-center">
            <Button
                rounded
                class="request-btn"
                v-if="!hasRequested"
                @click="requestToJoin"
                color="mint"
                dense
                >Request to join team</Button
            >
            <q-chip v-else class="request-chip" clickable @click="showRequesterMenu = true">Request pending</q-chip>
        </div>
        <div v-else-if="pendingPlayers?.length">
            <q-chip
                clickable
                class="request-chip"
                @click="showRequestsMenu = true"
                >{{ pendingPlayers.length }} pending </q-chip
            >
        </div>
        <GlobalMenu v-model="showRequestsMenu" closeOnOutsideClick>
            <DialogCard ref="confirmDelete" maxWidth="95vw">
                <template v-slot:title>
                 
                    {{ pendingPlayers.length }} pending player{{
                        pendingPlayers.length > 1 ? "s" : ""
                    }}
                 
                   
                </template>

                <template v-slot:content>
                    <q-list separator >
                        <q-item
                            v-for="player in pendingPlayers"
                            :key="player.id"
                            class="q-px-none"
                           
                           
                        >
                            <q-item-section avatar >
                                <div style="width: 40px">
                                    <Avataaar
                                        v-bind="parseAvatar(player.avatar)"
                                    />
                                </div>
                            </q-item-section>
                            <q-item-section class="request-name-section">
                                <q-item-label overline style="text-transform: uppercase">{{player.pivot.status === 'requested' ? 'Requested' : 'Invited'}}</q-item-label>
                                <q-item-label class="text-caption truncate-text"
                                    >{{ player.first_name }}
                                    {{ player.last_name }}</q-item-label
                                >
                                <q-item-label caption 
                                    >@{{ player.username }}</q-item-label
                                >
                            </q-item-section>
                            <q-item-section class="request-card-actions">
                                <div>
                                <Button
                                   
                                    round
                                    icon="close"
                                    dense
                                    color="white"
                                    text-color="red"
                                    size="14px"
                                    @click="
                                        respondToRequest('rejected', player.id)
                                    "
                                    :disable="responding"
                                    :loading="responding"
                                />
                                </div>
                                <div>
                                <Button
                                   
                                    round
                                    icon="check"
                                    dense
                                     color="mint"
                                    size="14px"
                                    @click="
                                        respondToRequest('accepted', player.id)
                                    "
                                    :disable="responding"
                                    :loading="responding"
                                    v-if="player.pivot.status === 'requested'"
                                />
                                </div>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </template>
              
            </DialogCard>
        </GlobalMenu>
          <GlobalMenu v-model="showRequesterMenu" closeOnOutsideClick>
            <DialogCard ref="confirmDelete" maxWidth="95vw">
                <template v-slot:title>
                    You have requested to join {{team.name}}
                </template>

                <template v-slot:content>
                    If you would like to cancel this request, click <strong>cancel request</strong>. You can always try your luck later!
                </template>
                <template v-slot:footer>
                    <div class="row justify-center full-width q-mb-sm">
                    <Button color="red" @click="cancelRequest">Cancel request</Button>
                    </div>
                </template>
              
            </DialogCard>
        </GlobalMenu>
    </div>
  
</template>
  <style lang="scss" scoped>
        .request-chip {
            padding: var(--space-xs);
            font-family: $font-family-header;
            background-color: $app-yellow;
            color: white;
            box-shadow: $pretty-shadow;
            @include reg-text;
        }
        .request-card-actions {
    min-width: 75px;
    justify-content: flex-end;
    flex-direction: row !important;
    align-items: center;
    flex-grow: 0;
    flex-wrap: nowrap;
    gap: var(--space-xs);
    margin-left: var(--space-lg);
}
.confirm-btn {
    font-family: $font-family-header;
    font-size: 1em;
    margin-bottom: var(--space-xs);

    &.red {
        background-color: $app-red;
        color: white;
    }
}
.request-btn {
    background-color: $app-yellow;
    color: white;
    font-family: $font-family-header;
    padding: 10px var(--space-sm);
    @include reg-text;
}
.request-name-section {
    flex-grow: 1;
}
    </style>
<script setup>
import Team from "@/store/models/team";
import TeamPlayer from "@/store/models/team-player";
import { useTeamRequestStore } from "@/store/team-requests";
import { parseAvatar } from "@/utils/avatar";
import { useUserTeamStore } from "@/store/user-teams";
import { useNotificationStore } from "@/store/notification";
import {useQueryClient, useQuery} from '@tanstack/vue-query';

const queryClient = useQueryClient();

const props = defineProps({
    teamId: Number,
});

const team = computed(() =>
    useRepo(Team).with("players").where("id", props.teamId).first()
);

const { getTeamPlayers } = useTeam();

const { isLoading } = useQuery({
    queryKey: ["team", "players", props.teamId],
    queryFn: () => getTeamPlayers(props.teamId),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
});

const { isOnTeam } = useTeam();

const canEdit = computed(() => isOnTeam(props.teamId));

const pendingPlayers = computed(() =>
    team.value.players?.filter(({ pivot }) => !!pivot.status)
);

const pendingRequests = computed(() => pendingPlayers.value.filter(({pivot}) => pivot.status === 'requested'))
const pendingInvitations = computed(() => pendingPlayers.value.filter(({pivot}) => pivot.status === 'invited'))

// REQUEST TO JOIN

const { user: userId } = useUser();
const hasRequested = computed(
    () =>
        !canEdit.value &&
        pendingPlayers.value.some(({ id }) => id === userId.value)
);

const requestToJoin = async () => {
    await useTeamRequestStore().sendTeamRequest({
        team_id: props.teamId,
        requester_profile_id: userId.value,
    });
    useTeamRequestStore().getTeamRequestsByUser(userId.value);
    queryClient.invalidateQueries({
        queryKey: ["team", "players", props.teamId],
    });
};

// RESPOND TO REQUESTS

const showRequestsMenu = ref(false);

const responding = ref(false);
const respondToRequest = async (status, playerId) => {
    responding.value = true;
    const player = pendingPlayers.value?.find(({ id }) => id === playerId);
    const { pivot } = player ?? {};
    const { request_id } = pivot ?? {};
    if (!request_id) return;
    await useTeamRequestStore().updateTeamRequestStatus({
        id: request_id,
        status,
    });
    await useUserTeamStore().fetchUserTeams(true);

    const isInvitation = pivot.status === 'invited'

    useNotificationStore().addNotification({
        state: "completed",
        text: `${isInvitation ? 'Invitation' : 'Request'} ${isInvitation && status === 'rejected' ? 'cancelled' : status}`,
        timeout: 3000,
    });
    queryClient.invalidateQueries({
        queryKey: ["team", "players", props.teamId],
    });
    if (pendingPlayers.value.length <= 1) showRequestsMenu.value = false;
    responding.value = false;
};

// Cancel request

const showRequesterMenu = ref(false)

const cancelRequest = async () => {
    showRequesterMenu.value = false;
    responding.value = true;
    await useTeamRequestStore().deleteTeamRequest({teamId: team.value.id, profileId: userId.value})
    await useUserTeamStore().fetchUserTeams(true);
     queryClient.invalidateQueries({
        queryKey: ["team", "players", props.teamId],
    });
    responding.value = false;
}
</script>
