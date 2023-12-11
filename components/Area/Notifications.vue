<template>
        <h1 class="text-md text-bold q-pa-md row justify-between items-center">
            Notifications
        </h1>
        <div v-for="request in requests" :key="request.id" style="min-height: 50px">
            <NotificationRequest :request="request" />
            <q-separator/>
        </div>
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