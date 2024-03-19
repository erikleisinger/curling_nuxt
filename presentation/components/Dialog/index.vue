<template>
   <q-dialog ref="dialogRef" @hide="onDialogHide">
    <div>
      <slot :onDialogOK="onDialogOK" :onDialogCancel="onDialogCancel"/>
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