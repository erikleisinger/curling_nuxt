<template>
  <Dialog v-slot="{onDialogOK, onDialogCancel}">
    <q-form @submit="onSave($event, onDialogOK)">
      <q-card>
        <q-card-section class="row wrap flex-break">
          <q-input
            class="col-12"
            v-model="editedSheet.name"
            label="Sheet name"
            outlined
            rounded
            name="name"
            aria-required="true"
            :rules="[VALIDATION_RULES.REQUIRED]"
          />
          <SelectRink v-model="editedSheet.rink_id" class="col-12" label="Rink"/>
        </q-card-section>
        <q-card-actions>
          <q-btn color="primary" label="Save" type="submit" />
          <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
        </q-card-actions>
      </q-card>
    </q-form>
  </Dialog>
</template>
<script setup lang="ts">
import {VALIDATION_RULES} from "@/constants/validation";
import {TABLE_NAMES} from "@/constants/tables";
import {useSheetStore} from "@/store/sheets";
import type Team from '@/types/team'
import type Sheet from '@/types/sheet'

const props = defineProps({
  edited: Object,
});
const editedSheet = ref<Sheet>({
  id: null,
  name: null,
  rink_id: null
});
onMounted(() => {
  if (props.edited) {
    Object.assign(editedSheet.value, props.edited);
    
  }
});
const sheetStore = useSheetStore();
const onSave = async (e: SubmitEvent, callback: Function) => {
  const newSheet = {...editedSheet.value}
  if (!editedSheet.value.id) {
    delete newSheet.id;
  }
  sheetStore.insertSheet(newSheet);
  callback();
};
</script>
