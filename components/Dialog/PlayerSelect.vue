<template>
    <DialogFloating @close="emit('close')">
        <template v-slot:prependButton>
            <q-btn
                flat
                round
                icon="person_add"
                @click="togglePlayerEditor({ open: true })"
            />
        </template>
        <TablePlayers>
            <template v-slot:actions="{ playerId }">
                <q-btn
                    @click="emit('select', playerId)"
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
</script>
