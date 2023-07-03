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
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

function onOKClick (e) {
    console.log('OK CLICK: ', e)
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK()
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}

</script>