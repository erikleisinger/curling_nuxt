<template>
        <q-dialog v-model="isOpen" @hide="close" ref="dialogRef">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="onDialogOK"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
<script setup>
import {computed} from 'vue'
    import {useEditorStore} from '@/store/editor';
    const store = useEditorStore();
    const isOpen = computed(() => store.game)

    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

    const close = () => {
        onDialogHide();
        store.toggleDialog('game', false);
    }
</script>