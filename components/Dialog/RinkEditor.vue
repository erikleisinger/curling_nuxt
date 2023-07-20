<template>
  <Dialog v-slot="{onDialogOK, onDialogCancel}">
    <q-form @submit="onSave($event, onDialogOK)">
      <q-card>
        <q-card-section class="row wrap flex-break">
          <q-input
            class="col-12"
            v-model="editedRink.name"
            label="Rink name"
            outlined
            rounded
            name="name"
            aria-required="true"
            :rules="[VALIDATION_RULES.REQUIRED]"
          />
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
import {useRinkStore} from "@/store/rinks";
import type Team from '@/types/team'
import type Rink from '@/types/rink'

const props = defineProps({
  edited: Object,
});
const editedRink = ref<Rink>({
  id: null,
  name: null,
});
onMounted(() => {
  if (props.edited) {
    Object.assign(editedRink.value, props.edited);
    
  }
});
const rinkStore = useRinkStore();
const onSave = async (e: SubmitEvent, callback: Function) => {
  const newRink = {...editedRink.value}
  if (!editedRink.value.id) {
    delete newRink.id;
  }
  rinkStore.insertRink(newRink);
  callback();
};
</script>
