<template>
    <q-dialog v-model="isOpen" persistent>
        <q-card>
            <q-card-section>
                <slot/>
            </q-card-section>
             <slot name="buttons">
            <q-card-actions align="right">
               
          <q-btn flat :label="props.cancelButtonText" color="primary" @click="emit('close')" v-close-popup></q-btn>
          <q-btn flat :label="props.confirmButtonText" color="negative" @click="emit('confirm')" v-close-popup></q-btn>
           
        </q-card-actions>
             </slot>
        </q-card>
    </q-dialog>
</template>
<script setup>
    const isOpen = ref(true)
    const emit = defineEmits(['close', 'confirm'])
    const props = defineProps({
        confirmButtonText: {
            type: String,
            default() {
                return 'Delete'
            }
        },
        cancelButtonText: {
            type: String,
            default() {
                return 'Cancel'
            }
        }
    })
</script>