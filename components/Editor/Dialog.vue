<template>
   <q-dialog ref="dialogRef" @hide="onDialogHide">
    <div>
      <EditorInputArea @save="onDialogOK" @cancel="onDialogCancel" />
      </div>
   </q-dialog>
</template>

<script setup>  
import { useDialogPluginComponent } from 'quasar'
    defineEmits([
  ...useDialogPluginComponent.emits
])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

</script>