<template>
  <q-select
    rounded
    outlined
    v-model="editedValue"
    :options="colorOptions"
    emit-value
    map-options
    standout
    hide-dropdown-icon
  >
    <template v-slot:option="{opt, toggleOption}">
      <q-item clickable @click="toggleOption(opt.value)">
        <q-item-section avatar>
          <RockIcon :color="opt.value" style="height:20px; width:20px;" :draggable="false" />
        </q-item-section>
        <q-item-section>
          {{ opt.label }}
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:selected-item="{opt}">
      <RockIcon :color="opt.value" size="sm" style="height:20px; width:20px" :draggable="false" />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(["update:modelValue"]);

const editedValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});
const colorOptions = ref([
  {
    value: "red",
    label: "Red",
  },
  {
    value: "yellow",
    label: "Yellow",
  },
    {
    value: "blue",
    label: "Blue",
  },
]);
</script>
