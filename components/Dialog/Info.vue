<template>
    <q-dialog v-model="isOpen"  class="z-max" @hide="emit('close')">
        
        <q-card style="max-width: 400px; width: 90vw">
            
            <q-card-section>
                <slot/>
            </q-card-section>
             <slot name="buttons">
            <q-card-actions align="right" class="row justify-between">
               
           <q-btn flat :label="props.cancelButtonText" :color="cancelColor" @click="emit('close')" v-close-popup v-if="showCancel"></q-btn>
          <q-btn flat :label="props.confirmButtonText" :color="confirmColor" @click="emit('confirm')" v-close-popup v-if="showConfirm"></q-btn>
           
        </q-card-actions>
             </slot>
        </q-card>
    </q-dialog>
</template>
<style lang="scss">
    .close-button__floating {
        position: absolute;
        right: 0;
    }
</style>
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
        showConfirm: Boolean,
        showCancel: Boolean,
    })
</script>