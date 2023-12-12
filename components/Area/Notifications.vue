<template>
        <h1 class="text-md text-bold q-pa-md row justify-between items-center">
            Notifications
        </h1>
        <q-separator/>
        <AreaSeason/>
</template>
<script setup>

import {useTeamRequestStore} from '@/store/team-requests'
import { useGameRequestStore } from "@/store/game-requests";
const teamRequests = computed(() => useTeamRequestStore().requests)
const gameRequests = computed(() => useGameRequestStore().requests)

const requests = computed(() => [...teamRequests.value.map((i) => ({
    ...i,
    type: 'team'
})), ...gameRequests.value.map((i) => ({
    ...i,
    type: 'game'
}))])
</script>