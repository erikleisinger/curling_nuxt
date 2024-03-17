<template>
  <TeamPage v-if="!isLoading || !enabled" > </TeamPage>

</template>
<script setup>
import {getTeam} from '@/business/api/query/team'

const route = useRoute();
const teamId = Number(route.params.id)

const {setLoading} = useLoading();
const {fetch, loading: isLoading} = useApi()

const enabled = !!route.params.id && route.params.id !== 'create'

if (enabled) {
    fetch(getTeam(teamId)).then(() => setLoading(false))
}

onMounted(() =>{
    console.log('MOUNTED TEAM PAGE: ', teamId)
})


</script>
