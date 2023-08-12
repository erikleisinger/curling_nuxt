<template>
    <q-dialog v-model="isOpen" persistent>
        <q-card style="max-width: 90vw; width: 90vw">
            <q-card-section>
                <slot/>
            </q-card-section>
             <slot name="buttons">
            <q-card-actions align="right" class="row justify-between">
               
          <q-btn flat :label="props.cancelButtonText" :color="cancelColor" @click="emit('close')" v-close-popup></q-btn>
          <q-btn flat :label="props.confirmButtonText" :color="confirmColor" @click="emit('confirm')" v-close-popup></q-btn>
           
        </q-card-actions>
             </slot>
        </q-card>
    </q-dialog>
</template>
<script setup lang="ts">
    const isOpen = ref(true)
    const emit = defineEmits(['close', 'confirm'])
    const props = defineProps({
        confirmButtonText: {
            type: String,
            default() {
                return 'Delete'
            }
        },
        confirmColor: {
            type: String,
            default() {
                return 'negative'
            }
        },
        cancelButtonText: {
            type: String,
            default() {
                return 'Cancel'
            }
        },
          cancelColor: {
            type: String,
            default() {
                return 'primary'
            }
        },
    })
</script>