<template>
  <TeamPage v-if="!isLoading || !enabled" > </TeamPage>

</template>
<script setup>
import {getTeam} from '@/business/api/query/team'

const route = useRoute();
const teamId = Number(route.params.id)

const {setLoading} = useLoading();
const {fetch} = useApi()

const enabled = computed(() => !!route.params.id && route.params.id !== 'create')

const {loading: isLoading} = fetch(getTeam(teamId), {
    enabled,
    onComplete: () => setLoading(false)
})



</script>
