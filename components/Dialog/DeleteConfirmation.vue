<template>
    <q-dialog v-model="isOpen" persistent>
        <q-card>
            <q-card-section>
                <slot/>
            </q-card-section>
            <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" @click="emit('close')" v-close-popup></q-btn>
          <q-btn flat label="Delete" color="negative" @click="emit('confirm')" v-close-popup></q-btn>
        </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script setup>
    const isOpen = ref(true)
    const emit = defineEmits(['close', 'confirm'])
</script>