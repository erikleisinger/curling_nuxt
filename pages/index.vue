<template>
    <NuxtLayout>
        <AreaExplore v-if="view === VIEWS.EXPLORE" key="explore"/>
        <Profile v-else-if="view === VIEWS.SETTINGS" key="settings"/>
        <MySeason v-else-if="view === VIEWS.SEASON" key="season"/>
        <AreaNotifications v-else-if="view === VIEWS.NOTIFICATIONS" key="manage"/>


    
        <!-- <q-btn to="/creategame" class="q-mb-md" rounded color="primary">New Game</q-btn>
    <q-btn to="/select" class="q-mb-md" rounded>Select a game</q-btn>
     <q-btn @click="handleLogout" rounded>Logout</q-btn> -->
    </NuxtLayout>
</template>
<style lang="scss" scoped>
.main {
    height: 100%;
    width: 100%;
}
</style>
<script setup>
import { useNavigationStore } from "@/store/navigation";

import { VIEWS } from "@/constants/navigation";
const navStore = useNavigationStore();

const handleLogout = () => {
    const { logout } = useSession();
    logout();
};

const view = computed(() => navStore.view);


</script>
