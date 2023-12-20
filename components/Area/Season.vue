<template>
    <TeamCard v-for="team in teams" :key="team.id" :teamId="team.id" @click="navigateTo(`/teams/${team.id}`)" class="clickable card"/>
</template>
<style lang="scss" scoped>
    .card {
        transition: transform 0.2s;
        &:hover {
            transform: scale(1.009)
        }
    }
</style>
<script setup>
    import {useUserTeamStore} from '@/store/user-teams';

    const teams = computed(() => useUserTeamStore().userTeams)
</script>   