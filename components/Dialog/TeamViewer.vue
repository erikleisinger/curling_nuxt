<template>
    <DialogFloating @close="toggleTeamViewer({ open: false })">
        <template v-slot:buttonLeft>
            <div />
        </template>
        <template v-slot:header>
            <ProfileCard :avatar="team.team_avatar" v-if="!loading" type="team">
                {{ team.name }}
            </ProfileCard>
        </template>
        <!-- <template v-slot:prependButton>
              <RequestStatus v-if="request && !canEdit" :initialStatus="request.status" :profileId="team.profile_id" :resourceId="team.id"  resourceType="team"/> -->
        <!-- </template> -->
        <main :style="`height: calc(100% - ${height}px); overflow: auto`">
            <TeamPlayerList :item="team" />
        </main>
    </DialogFloating>
</template>
<style lang="scss" scoped>
$header-height: 2em;
.result__container {
    display: grid;
    // grid-template-rows: 1fr auto;
    grid-template-rows: 100%;
    grid-template-columns: 30% 40% 30%;
}
.team-viewer__wrap {
    display: grid;
    grid-template-rows: 2em calc(40% - $header-height / 2) calc(
            60% - $header-height / 2
        );
}
</style>
<script setup lang="ts">
import { useEditorStore } from "@/store/editor";
import { useTeamStore } from "@/store/teams";
import { useUserStore } from "@/store/user";
import { parseAvatar } from "@/utils/avatar";
import { useElementSize } from "@vueuse/core";
import Team from "@/types/team";
const editorStore = useEditorStore();

const tab = ref("stats");

const { toggleTeamViewer } = editorStore;

const { format } = useTime();

const loading = ref(false);

const teamStore = useTeamStore();

const teamId = editorStore.teamViewer.team?.id;

const team = computed(() => {
    return (
        teamStore.teams.find((t) => t.id === teamId) ||
        editorStore.teamViewer.team
    );
});

const userStore = useUserStore();
const canEdit = computed(() => team.value?.profile_id === userStore.id);
</script>
