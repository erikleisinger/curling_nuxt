<template>
  <Dialog v-slot="{onDialogOK, onDialogCancel}">
            <q-form @submit="onSave($event, onDialogOK)">
    <q-card>
      <q-card-section class="row wrap flex-break">
<q-input class="col-12" v-model="editedPlayer.name" label="Player name" outlined rounded name="name"  aria-required="true"
           :rules="[VALIDATION_RULES.REQUIRED]"/>
     
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
const store = useDataStore();

const props = defineProps({
    edited: Object,
})

const editedPlayer = ref({
  id: null,
  home: null,
  away: null,
  name: null,
  home_color: "red",
  away_color: "yellow",
  start_time: null,
});
const teamOptions = computed(() => {
  return store.teams.map((t) => {
    return {
      label: t.name,
      value: t.id,
    };
  });
});
onMounted(() => {
  store.getTeams();
  if (props.edited) {
    Object.assign(editedPlayer.value, props.edited)
  }
});

const onSave = async (e, callback) => {
     const formData = new FormData(e.target);
     
        const data = [...formData.entries()].reduce((all, [key, value]) => {
            return {...all, [key]: value}
        }, {})
        const newPlayer = {...data};
        if (editedPlayer.value.id) {
          newPlayer.id = editedPlayer.value.id
        }
    store.insertPlayer(newPlayer)
    callback();

}
</script>
