<template>
     <q-select
        outlined
        rounded
        label="Shot type"
        :options="shotTypeOptions"
        v-model="editedShotType"
        emit-value
        map-options
        :disable="globalLoading"
      >
        <template v-slot:append>
          <q-btn
            flat
            round
            @click.stop="getShotTypes(true)"
            :loading="loadingShotTypes"
          >
            <q-icon name="refresh" />
          </q-btn>
        </template>
      </q-select>
</template>
<script setup>
import {useShotTypeStore} from '@/store/shotTypes'
const props = defineProps({
    modelValue: [Number, String],
})
const emit = defineEmits(['update:modelValue'])
const editedShotType = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})
const store = useShotTypeStore();
const loadingShotTypes = ref(false);
const getShotTypes = async (force) => {
  loadingShotTypes.value = true;
  await store.fetchShotTypes(force);
  loadingShotTypes.value = false;
};
const shotTypeOptions = computed(() => {
  const {formatShotTypeForSelection} = useFormat();
  return [...store.shotTypes].map((d) => formatShotTypeForSelection(d));
});
const {globalLoading} = useLoading();
</script>