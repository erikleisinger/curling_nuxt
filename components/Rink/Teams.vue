<template>
  
    <div class="relative-position" style="min-height: inherit">
        <TeamCard v-for="teamId in teams" :key="teamId" :teamId="teamId" dense/>
        <h2 class="full-width text-md text-center q-pa-lg " v-if="!isLoading && !teams.length">Could not find any teams.</h2>
          <q-inner-loading indeterminate color="primary" :showing="isLoading"/>
    </div>
</template>
<script setup>
import {useQuery} from '@tanstack/vue-query'
const props = defineProps({
    id: Number, 
})
    import Rink from '@/store/models/rink';

    const rink = computed(() => useRepo(Rink).where('id', props.id).first())

    const getRinkTeams = async () => {
        const client = useSupabaseClient();
        const {data} = await client.from('teams').select('id, name').eq('rink_id', props.id);
        const {sortAlphabetically} = useSort();
        return data.sort((a,b) => sortAlphabetically(a.name, b.name)).map(({id}) => id)
    }

    const {isLoading, data:teams} = useQuery({
        queryKey: ['rink', 'teams', props.id],
        queryFn: getRinkTeams,
        refetchOnWindowFocus:false
    })
</script>
<script>
export default {
    name: 'RinkTeams',
}
</script>
