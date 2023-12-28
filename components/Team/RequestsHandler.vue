<template>
    <div>

        <div v-if="isInvited" class="q-pa-sm">
            <div class="full-width text-center">
            You have been invited to join this team.
            </div>
            <div class="full-width row justify-around">
                <q-btn color="red" @click="respondToRequest('rejected')" :disable="responding">Decline</q-btn>
                <q-btn color="green" @click="respondToRequest('accepted')" :disable="responding">Accept</q-btn>
            </div>
        </div>
        <div v-else-if="isRequested && !isOnTeam">
            You have requested to join this team.
        </div>
        <q-btn v-else-if="!isOnTeam && !isLoading" class="full-width" color="primary" @click="requestToJoin">Request to join team</q-btn>
    </div>
</template>
<script setup>
    import {useQuery, useQueryClient} from '@tanstack/vue-query';
    import Team from '@/store/models/team'
    import {useTeamRequestStore} from '@/store/team-requests'
    import {useUserTeamStore} from '@/store/user-teams'

    const queryClient = useQueryClient()

    const props = defineProps({
        teamId: Number,
    })

    const {user: userId} = useUser();

    const team = computed(() => useRepo(Team).with('players').where('id', props.teamId).first())

    const requests = computed(() => team.value?.players.map((p) => ({
        ...p,
        ...p.pivot
    })).filter(({status}) => status === 'invited' || status === 'requested'))


    const isOnTeam = computed(() => team.value?.players.some(({id, pivot}) => id === userId.value && pivot.status !== 'invited' && pivot.status !== 'requested'))
    const isInvited = computed(() => requests.value?.some(({player_id, status}) => player_id === userId.value && status === 'invited'))
    const isRequested = computed(() => requests.value?.some(({player_id, status}) => player_id === userId.value && status === 'requested'))

    const {getFullTeam} = useTeam();


const {isLoading} = useQuery({
    queryKey: ['team', 'full', props.teamId],
    queryFn: () => getFullTeam({id:props.teamId}),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
})

    // SEND request to join

    const requestToJoin = async () => {
        useTeamRequestStore().sendTeamRequest({
            team_id: props.teamId,
            requester_profile_id: userId.value
        })

        queryClient.invalidateQueries({
            queryKey: ['team', 'full', props.teamId]
        })

    }

    // Accept team request 

    const responding = ref(false)
    const respondToRequest = async (status) => {
        responding.value = true;
        const {request_id} = requests.value?.find(({player_id}) => userId.value === player_id)
    await useTeamRequestStore().updateTeamRequestStatus({ id: request_id, status });
    await useUserTeamStore().fetchUserTeams(true);
    queryClient.invalidateQueries({
        queryKey: ['team', 'full', props.teamId]
    })
    responding.value = false;

};
</script>