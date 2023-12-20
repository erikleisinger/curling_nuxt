<template>
    <TeamCard v-for="team in teams" :key="team.id" :teamId="team.id" @click="navigateTo(`/teams/${team.id}`)" class="clickable card"/>
</template>
<script setup>
    import {useUserTeamStore} from '@/store/user-teams';

    const teams = computed(() => useUserTeamStore().userTeams)
</script>   