<template>
        <TeamAvatar :teamId="teamId" class="team-chip__avatar" style="width: 18px" />
       <strong>{{ team?.name ?? name ?? teamName }}</strong>
</template>
<style lang="scss" scoped>
 .team-chip__avatar {
        display: inline-block;
        height: min-content; 
        transform: translateY(4px); 
        margin-right: 4px
    }
</style>
<script setup>
import Team from "@/store/models/team";
import {useQuery} from '@tanstack/vue-query'
const props = defineProps({
    teamId: Number,
    teamName: String,
});

const team = computed(() => useRepo(Team).where("id", props.teamId).first() ?? {
    id: props.teamId,
    name: props.teamName,
    avatar_url: props.teamAvatar
});

const getTeamName= async () => {
    const client = useSupabaseClient();
    const {data} = await client.from('teams').select('name').eq('id', props.teamId).single();
    return data?.name
}
const isEnabled = computed(() => !!props.teamId)

const { data: name} = useQuery({
    queryKey: ['team', 'name', props.teamId],
    queryFn: getTeamName,
    refetchOnWindowFocus: false,
    enabled: isEnabled,
})


</script>
<script>
export default {
    name: 'TeamChip'
}
</script>
