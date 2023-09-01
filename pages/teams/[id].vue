<template>
 <NuxtLayout>
     <Team v-if="team && !loading" :team="team">
    </Team>
    <div v-else/>
 </NuxtLayout>
</template>
<script setup>
    const route = useRoute();
    const loading = ref(false)
    const team = ref(null)
    onMounted(async () => {
        loading.value = true;
        const client = useSupabaseClient();

        const {data} = await client.from('teams').select(`
            id,
            team_avatar,
            avatar_type,
            avatar_url,
            name
        `).eq('id', route.params.id)
        const [t] = data;
        team.value = t;
        loading.value = false;
    })
</script>
