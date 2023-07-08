<template>
 <Dialog v-slot="{onDialogOK, onDialogCancel}">
      <EditorInputArea @save="onDialogOK" @cancel="onDialogCancel" />
 </Dialog>
</template>