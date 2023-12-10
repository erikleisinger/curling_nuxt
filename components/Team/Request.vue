<template>
        <div class="team-request__container row no-wrap items-center">
                    <div style="width: 40px" class="q-mr-sm">
                        <TeamAvatar :teamId="request.team_id" />
                    </div>
                    <div>
                        <span class="text-bold q-mr-xs">{{ request.name }}</span>
                        <span>has invited you to join their team!</span>
                    </div>
                    <q-btn flat
                        >Respond
                        <q-menu>
                            <q-item
                            v-if="viewable"
                                clickable
                                v-ripple
                                @click="navigateTo(`/teams/${request.team_id}`)"
                            >
                                <q-item-section avatar>
                                    <q-icon name="visibility"></q-icon>
                                </q-item-section>
                                <q-item-section no-wrap
                                    >View team</q-item-section
                                >
                            </q-item>
                            <q-item
                                clickable
                                v-ripple
                                @click="respondToRequest(request.id, 'accepted')"
                                color="green"
                            >
                                <q-item-section avatar>
                                    <q-icon name="check" color="green"></q-icon>
                                </q-item-section>
                                <q-item-section no-wrap
                                    >Accept invitation</q-item-section
                                >
                            </q-item>
                            <q-item
                                clickable
                                v-ripple
                                  @click="respondToRequest(request.id, 'rejected')"
                            >
                                <q-item-section avatar>
                                    <q-icon name="close" color="red"></q-icon>
                                </q-item-section>
                                <q-item-section no-wrap
                                    >Decline invitation</q-item-section
                                >
                            </q-item>
                        </q-menu>
                    </q-btn>
                </div>
</template>
<style lang="scss" scoped>
      .team-request__container {
        padding: var(--space-xs);
    }
</style>
<script setup>
import {useTeamRequestStore} from '@/store/team-requests'
import {useUserTeamStore} from '@/store/user-teams'
import { useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();

    const props = defineProps({
        request: Object,
        viewable: Boolean,
    })


const { updateTeamRequestStatus, getTeamRequestsByUser} =
    useTeamRequestStore();

const {fetchUserTeams} = useUserTeamStore();

const respondToRequest = async (id, status) => {
    await updateTeamRequestStatus({ id, status });
    const { user: userId } = useUser();
    await getTeamRequestsByUser(userId.value);
    if (status === "accepted") await fetchUserTeams(true);
    queryClient.invalidateQueries({
        queryKey: ['team', 'page', props.request.team_id]
    })
    queryClient.invalidateQueries({
        queryKey: ['team', 'players', props.request.team_id]
    })

};
</script>