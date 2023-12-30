<template>
  <TeamPage v-if="!isLoading" > </TeamPage>

</template>
<script setup>
import { useQuery} from '@tanstack/vue-query'

const {getFullTeam} = useTeam();

const route = useRoute();
const {setLoading} = useLoading();

const {isLoading} = useQuery({
    queryKey: ['team', 'full', Number(route.params.id)],
    queryFn: () => getFullTeam({id: Number(route.params.id)}),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
})

</script>
