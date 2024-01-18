<template>
  <TeamPage v-if="!isLoading || !enabled" > </TeamPage>

</template>
<script setup>
import Team from '@/store/models/team';
import Player from '@/store/models/player';
import TeamPlayer from '@/store/models/team-player';
import Rink from '@/store/models/rink'
import { useQuery} from '@tanstack/vue-query'

const route = useRoute();
const teamId = Number(route.params.id)

const getTeam = async () => {
    const client = useSupabaseClient();
    const {data} = await client.from('teams').select(`
        id,
        name,
        avatar_url,
        rink:rink_id (
            id,
            name,
            city,
            province,
            sheets
        )
        `).eq('id', teamId)

    data.forEach((team) => {
        const {rink} = team;
        useRepo(Team).save(team);
        if (rink) useRepo(Rink).save(rink)
    })


    
    return data;
}

const enabled = computed(() => !Number.isNaN(teamId))


const {setLoading} = useLoading();

const {isLoading} = useQuery({
    queryKey: ['team', 'full', Number(route.params.id)],
    queryFn: getTeam,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled,
    select: (val) => {
        setLoading(false)
        return val;
    }
})

</script>
