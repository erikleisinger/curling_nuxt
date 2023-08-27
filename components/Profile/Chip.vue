<template>
      <q-chip dense class="text-sm q-mx-none text-bold" style="width: min-content"  clickable  @click="() => isRevealed ? confirm() : reveal()"><span >@{{username}}</span>
      <div v-if="isRevealed" style="position:absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px" class="row justify-center bg-grey-4">View</div>
      </q-chip>
</template>
<script setup>
import {useConfirmDialog} from '@vueuse/core'
import {useDialogStore} from '@/store/dialog'
const {togglePlayerEditor} = useDialogStore();
    const props = defineProps({
        id: String,
        username: String
    })

    const {reveal, isRevealed, confirm, onConfirm, cancel} = useConfirmDialog();
    onConfirm(() => {
        togglePlayerEditor({open: true})
    })

</script>