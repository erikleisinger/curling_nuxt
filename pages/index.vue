<template>
    <NuxtLayout>
        <AreaManage2 v-if="view === VIEWS.MANAGE" />
        <Profile v-else-if="view === VIEWS.SETTINGS" />
        <MySeason v-else-if="view === VIEWS.SEASON" />
        <TeamSearch v-else-if="view === VIEWS.EXPLORE"/>
        <DialogTeamViewer v-if="isTeamViewerOpen" />
        <DialogPlayerEditor v-if="isPlayerEditorOpen" />
        <DialogConnect v-if="isConnectDialogOpen" />
        <DialogLinescore v-if="isLinescoreOpen"/>

        <DialogPlayerSelect v-if="isPlayerSelectOpen" />

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
import { useEditorStore } from "@/store/editor";
import { VIEWS } from "@/constants/navigation";
const navStore = useNavigationStore();
const view = computed(() => navStore.view);
const handleLogout = () => {
    const { logout } = useSession();
    logout();
};

const editorStore = useEditorStore();
const isConnectDialogOpen = computed(() => editorStore.connectDialog.open);
const isLinescoreOpen = computed(() => editorStore.linescore.open);
const isPlayerEditorOpen = computed(() => editorStore.playerEditor.open);
const isPlayerSelectOpen = computed(() => editorStore.playerSelect.open);
const isTeamViewerOpen = computed(() => editorStore.teamViewer.open);
</script>
