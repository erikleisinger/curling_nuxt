<template>
    <NuxtLayout>
        <Team v-if="!loading" > </Team>
        <q-inner-loading :showing="loading" color="primary" />
    </NuxtLayout>
</template>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import TeamModel from '@/store/models/team'

const teamRepo = useRepo(TeamModel);



const route = useRoute();
const loading = ref(true);
const team = ref(null);
onMounted(async () => {
    loading.value = true;
    const client = useSupabaseClient();

    const { data } = await client
        .rpc("get_user_teams")
        .eq("id", route.params.id)
        .limit(1);

    const [t] = data;

const {avatar_type, avatar_url, team_avatar, id, name, ...stats} = t;

const obj = {
    avatar_type,
    avatar_url,
    team_avatar,
    id,
    name,
    stats: [
        {
        ...stats,
        team_id: id,
        game_id: 0,
 
    }
    ]
}
teamRepo.save(obj)
setTimeout(() => {
  loading.value = false;
}, 10)

  
});
</script>
