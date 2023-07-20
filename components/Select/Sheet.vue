<template>
       <q-select
            rounded
            outlined
            :options="sheetOptions"
            v-model="selectedSheet"
            emit-value
            map-options
            aria-required="true"
            :rules="[VALIDATION_RULES.REQUIRED]"
          >
          <template v-slot:selected-item="{opt}">
            <div class="truncate-text">{{opt.label}}</div>
          </template>
   <template v-slot:append>
      <q-btn
        flat
        round
        @click.stop="toggleSheetDialog(null)"
    
      >
        <q-icon name="add_circle_outline" />
      </q-btn>
    </template>
          </q-select>
</template>
<script setup>
import {VALIDATION_RULES} from "@/constants/validation";
import { useEditorStore } from "@/store/editor";
import {useSheetStore} from "@/store/sheets";

const props = defineProps({
    modelValue: Number,
})
const emit = defineEmits(['update:modelValue'])
const selectedSheet = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})
    const sheetStore = useSheetStore();
const sheetOptions = computed(() => {
  return sheetStore.sheets.map((t) => {
    return {
      label: t.name || "Unnamed sheet",
      value: t.id,
    };
  });
});

const {toggleSheetDialog} = useEditorStore();
</script>