<template>

<div v-for="a in achievements" :key="a.id">
    <AchievementHistoryItem  :item="a"/>
   
    <q-separator/>
</div>

</template>
<script setup>
import {useUserTeamStore} from '@/store/user-teams'
    import {useQuery} from '@tanstack/vue-query'

    const {user: userId} = useUser();

    const getAchievements = async () => {
        const teamList = useUserTeamStore().userTeams.map(({id}) => id)
        const client = useSupabaseClient();

        const {data} = await client.from('achievements').select(`
        id,
        created_at,
        team:team_id (
            id,
            name,
            avatar_url
        ),
        profile:profile_id (
            id,
            first_name,
            last_name,
            avatar
        ),
        name,
        type,
        info
        `).or(`team_id.in.(${teamList}),profile_id.eq.${userId.value}`).order('created_at', {ascending: false})

        return data;
    }

    const {isLoading, data: achievements} = useQuery({
        queryKey: ['achievements', userId.value],
        queryFn: getAchievements,
        refetchOnMount: true,
    })

    
</script>
<script>
export default {
    name: 'AchievementHistory'
}
</script>
