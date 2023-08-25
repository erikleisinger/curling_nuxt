<template>
    <DialogFloating
        @close="togglePlayerEditor({ open: false })"
    >
    <template v-slot:buttonRight>{{}}</template>
        <PlayerGenerator
            style="height: 100%"
            :player="player"
            @close="togglePlayerEditor({ open: false })"
        />
    </DialogFloating>
</template>
<script setup lang="ts">
import { useDialogStore } from "@/store/dialog";
import {usePlayerStore} from '@/store/players'

const editorStore = useDialogStore();
const { togglePlayerEditor } = editorStore;
const player = ref({});
onBeforeMount(() => {
    const { editedPlayer } = editorStore.playerEditor;
    if (!editedPlayer?.created_at && editedPlayer?.id) {
        player.value = usePlayerStore().players.find((p) => p.id === editedPlayer.id)

    } else if (editedPlayer) player.value = editedPlayer;
});

const emit = defineEmits(["close"]);



</script>
