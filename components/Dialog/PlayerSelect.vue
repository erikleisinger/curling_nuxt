<template>
    <DialogFloating @close="close($event)">
        <template v-slot:buttonLeft>
            <q-btn
                flat
                round
                icon="person_add"
                @click=" togglePlayerEditor({ open: true })"
            />
        </template>
        <TablePlayers>
            <template v-slot:actions="{playerId}">
                <q-btn
                    @click="handleSelect(playerId)"
                    flat
                    color="deep-purple"
                    >Select</q-btn
                >
            </template>
        </TablePlayers>
    </DialogFloating>
</template>
<script setup>
import { useEditorStore } from "@/store/editor";

const emit = defineEmits(["close", "select"]);

const editorStore = useEditorStore();
const { togglePlayerEditor } = editorStore;
const {onSelect} = editorStore.playerSelect;
const handleSelect = async (e) => {
    await onSelect(e);
    close();
}

const close = () => {
    editorStore.togglePlayerSelect({open: false})
}
</script>
