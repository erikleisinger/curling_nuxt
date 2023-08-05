<template>
    <DialogFloating @close="close($event)">
        <template v-slot:prependButton>
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
        <!-- <LoaderComponent/> -->
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
  const timeout = () => {
        return new Promise((resolve) => setTimeout(resolve, 4000));
      };
// const LoaderComponent = defineAsyncComponent({
//     loader: async () => {
//         // await timeout();
//         return import('../Table/Players.vue')
//     },
//     loadingComponent: `<div>Loading</div>`,
//     delay: 4000,
//     timeout: 200,
// })
</script>
