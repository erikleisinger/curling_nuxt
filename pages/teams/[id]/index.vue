<template>
    <NuxtLayout>
        <TeamPage v-if="!isLoading" > </TeamPage>
        <q-inner-loading :showing="isLoading" color="primary" />
    </NuxtLayout>
</template>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import { useQuery} from '@tanstack/vue-query'
import GET_TEAM_WITH_STATS from '@/queries/get_team_with_stats'

const route = useRoute();

const {isLoading} = useQuery({
    queryKey: ['team', 'page', Number(route.params.id)],
    queryFn: () => GET_TEAM_WITH_STATS(Number(route.params.id)),
    refetchOnWindowFocus: false,
})

</script>
