<template>
    <DialogFloating @close="toggleTeamViewer({ open: false })">
        <header class="pretty-shadow q-px-sm" ref="header">
            <div class="row">
                <TeamBasic :item="team" v-if="!loading" :editable="canEdit">
                </TeamBasic>
            </div>
        </header>

        <main :style="`height: calc(100% - ${height}px); overflow: auto`">
            <TeamPlayerList :item="team" />
        </main>
    </DialogFloating>
</template>
<style lang="scss">
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

const header = ref(null);
const { height } = useElementSize(header);
</script>
