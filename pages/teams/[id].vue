<template>
    <NuxtLayout>
        <Team v-if="team && !loading" :team="team"> </Team>
        <div v-else />
        <q-inner-loading :showing="loading" color="primary" />
    </NuxtLayout>
</template>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
const route = useRoute();
const loading = ref(false);
const team = ref(null);
onMounted(async () => {
    loading.value = true;
    const client = useSupabaseClient();

    const { data } = await client
        .rpc("get_user_teams")
        .eq("id", route.params.id)
        .limit(1);

    const [t] = data;

    const { id: teamId } = t;

    const is_admin = !!useUserTeamStore().userTeams.find(
        ({ id }) => id === teamId
    )?.is_admin;

    team.value = {
        ...t,
        is_admin,
    };
    loading.value = false;
});
</script>
