<template>
  <Dialog v-slot="{onDialogOK, onDialogCancel}">
            <q-form @submit="onSave($event, onDialogOK)">
    <q-card>
      <q-card-section class="row wrap flex-break">
<q-input class="col-12" v-model="editedShotType.name" label="Name" outlined rounded name="name"  aria-required="true"
           :rules="[VALIDATION_RULES.REQUIRED, reservedNameCheck]"/>
           <q-select class="col-12" :options="shotTypeOptions" name="shot_type" aria-required="true" v-model="editedShotType.shot_type"  outlined rounded label="Category"/>
     
      </q-card-section>
      <q-card-actions>
        <q-btn color="primary" label="Save" type="submit" />
        <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
    </q-form>
  </Dialog>
</template>
<script setup>
import {VALIDATION_RULES} from "@/constants/validation";
import {TABLE_NAMES} from '@/constants/tables'
import {useDataStore} from "@/store/data";
import {RESERVED_NAMES} from '@/constants/shot-types'
const store = useDataStore();

const props = defineProps({
    edited: Object,
})

const editedShotType = ref({
  name: null,
  shot_type: 'Draw',
});
const {formatShotTypeForSelection} = useFormat();
const shotTypeOptions = ref([
    'Draw', 
    'Hit'
])
onMounted(() => {
  store.fetchShotTypes();
  if (props.edited) {
    Object.assign(editedShotType.value, props.edited)
  }
});

const onSave = async (e, callback) => {
     const formData = new FormData(e.target);
     
        const data = [...formData.entries()].reduce((all, [key, value]) => {
            return {...all, [key]: value}
        }, {})
      const newShotType = {...data};
        if (editedShotType.value.id) {
         newShotType.id = editedShotType.value.id
        }
    store.insertShotType(newShotType)
    callback();

}

const reservedNameCheck = (val) => {
  console.log('VAL: ', val)
  return !RESERVED_NAMES.includes(val) || `${val} is a reserved name`
}
</script>
