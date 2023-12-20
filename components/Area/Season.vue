<template>
    <TeamCard v-for="team in teams" :key="team.id" :teamId="team.id" @click="navigateTo(`/teams/${team.id}`)" class="clickable card"/>
</template>
<script setup>
    import {useUserTeamStore} from '@/store/user-teams';
    const {sortAlphabetically} = useSort();
    const teams = computed(() => useUserTeamStore().userTeams.sort((a,b) => sortAlphabetically(a.name, b.name)))
</script>   