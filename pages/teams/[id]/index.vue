<template>
  <TeamPage v-if="!isLoading || !enabled" > </TeamPage>

</template>
<script setup>
import getTeam from '@/business/api/fetch/getTeam'

const route = useRoute();
const teamId = Number(route.params.id)

const {setLoading} = useLoading();
const {$api} = useNuxtApp();

const enabled = !!route.params.id && route.params.id !== 'create'

const {isLoading} = $api.getTeam(route.params.id, {
    select: (val) => {
        setLoading(false);
        return val;
    },
    enabled
})

</script>
