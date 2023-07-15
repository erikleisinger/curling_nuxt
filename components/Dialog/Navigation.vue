<template>
    <q-dialog v-model="props.modelValue" @hide="emit('cancel')">
        <q-card>
            <q-card-section>
                
                <q-input v-model.number="shot" type="number" label="Shot"  :rules="[(val) => (val < 17  && val > 0) || 'Select a shot between 1 - 16']" ref="shotInput"/>
                    <q-input v-model.number="end" type="number" label="End" :rules="[(val) => (val < 12  && val > 0) || 'Select an end between 1 - 12']" ref="endInput"/>
            </q-card-section>
            <q-card-actions align="right" class="row justify-between">  
                  <q-btn flat :label="props.cancelButtonText"  @click="emit('cancel')"  v-close-popup>Cancel</q-btn>
          <q-btn flat :label="props.cancelButtonText" color="primary" @click="emit('go', {shot, end})" :disable="disabled" v-close-popup>Go</q-btn>
        </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script setup>
    const props = defineProps({
        modelValue: Boolean,

    })
    const emit = defineEmits(['cancel', 'go'])
    const shot = ref(1);
    const end = ref(1);

    const shotInput = ref(null);
    const endInput = ref(null)

    const disabled = computed(() => shotInput.value?.hasError || endInput.value?.hasError)
</script>