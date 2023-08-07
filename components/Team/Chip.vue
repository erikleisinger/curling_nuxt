<template>
      <q-chip dense class="text-sm q-mx-none text-bold" color="deep-purple" outline clickable icon="group" @click="() => isRevealed ? confirm() : reveal()"><span >{{name}}</span>
      <div v-if="isRevealed" style="position:absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px" class="row justify-center bg-deep-purple text-white">View</div>
      </q-chip>
</template>
<script setup>
import {useConfirmDialog} from '@vueuse/core'
import {useEditorStore} from '@/store/editor'
const {toggleTeamViewer} = useEditorStore();
    const props = defineProps({
        id: Number,
        name: String
    })

    const {reveal, isRevealed, confirm, onConfirm, cancel} = useConfirmDialog();
    onConfirm(() => {
        toggleTeamViewer({open: true, team: {id: props.id}})
    })

</script>