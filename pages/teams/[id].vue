<template>
 <!-- <NuxtLayout> -->
     <Team v-if="team && !loading" :team="team">
        <!-- <template v-slot:appendButton>
            <q-btn
                flat
                round
                icon="search"
                color="grey-8"
                @click="toggleSearch"
            /> -->
        <!-- </template> -->
    </Team>
 <!-- </NuxtLayout> -->
</template>
<script setup>
    const route = useRoute();
    const loading = ref(false)
    const team = ref(null)
    onMounted(async () => {
        console.log('MOUNT TEA')
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
        console.log(data)

        loading.value = false;
    })
</script>
