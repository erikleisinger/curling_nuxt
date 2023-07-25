<template>
    <q-dialog v-model="isOpen" persistent @hide="emit('close')">
        <q-card >
            <q-card-section class="q-pb-xs">
                <h1 style="font-size: 1em">Please input the score for end {{end}}</h1>
            </q-card-section>
            <q-card-section class="q-pt-xs">
              <GameScoreboard :highlight="end"/>
            </q-card-section>
             <slot name="buttons">
            <q-card-actions align="right" class="row justify-between">
               
          <q-btn flat label="Back"  @click="emit('close')" v-close-popup></q-btn>
          <q-btn flat label="Save" color="primary"  @click="emit('save')" v-close-popup></q-btn>
           
        </q-card-actions>
             </slot>
        </q-card>
    </q-dialog>
</template>
<script setup lang="ts">
import {useSessionStore} from '@/store/session'
    const isOpen = ref(true)
    const emit = defineEmits(['close', 'save'])

    const store = useSessionStore();
    const end = computed(() => store.end)
</script>