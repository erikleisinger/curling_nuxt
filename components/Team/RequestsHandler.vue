<template>
    <div>

        <div v-if="isInvited">
            You have been invited to join this team.
        <q-btn >Respond</q-btn>
        </div>
        <div v-else-if="isRequested && !isOnTeam">
            You have requested to join this team.
        </div>
        <q-btn v-else-if="!isOnTeam" class="full-width" color="primary" @click="requestToJoin">Request to join team</q-btn>
    </div>
</template>
<script setup>
    import {useQuery, useQueryClient} from '@tanstack/vue-query';
    import Team from '@/store/models/team'
    import {useTeamRequestStore} from '@/store/team-requests'

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
</script>