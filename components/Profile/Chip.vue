<template>
      <q-chip dense class="text-sm q-mx-none text-bold" style="width: min-content"   color="black" clickable outline  ><span >@{{username}}</span>
      </q-chip>
</template>
<script setup>
import {useConfirmDialog} from '@vueuse/core'
    const props = defineProps({
        id: String,
        username: String
    })

    const {reveal, isRevealed, confirm, onConfirm, cancel} = useConfirmDialog();

</script>