<template>
<div class="q-pa-sm">
<ScheduleWidget/>
</div>
    <TeamCard v-for="team in teams" :key="team.id" :teamId="team.id" />
</template>
<script setup>
    import {useUserTeamStore} from '@/store/user-teams';
    const {sortAlphabetically} = useSort();
    const teams = computed(() => useUserTeamStore().userTeams.sort((a,b) => sortAlphabetically(a.name, b.name)))
</script>   