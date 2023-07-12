<template>
  <Dialog v-slot="{onDialogOK, onDialogCancel}">
            <q-form @submit="onSave($event, onDialogOK)">
    <q-card>
      <q-card-section class="row wrap flex-break">

        <GameColorSelect
          v-model="editedGame.home_color"
          class="col-3 q-pr-sm"
          name="home_color"
            :rules="[VALIDATION_RULES.REQUIRED]"
        />
        <q-select
          rounded
          outlined
          class="col-9 q-pl-sm q-pb-md"
          v-model.number="editedGame.home"
          label="Home"
          :options="teamOptions"
          emit-value
          map-options
          name="home"
          aria-required="true"
           :rules="[VALIDATION_RULES.REQUIRED]"
        />
        <GameColorSelect
          v-model="editedGame.away_color"
          class="col-3 q-pr-sm"
          name="away_color"
            :rules="[VALIDATION_RULES.REQUIRED]"
        />
        <q-select
          rounded
          outlined
          class="col-9 q-pl-sm q-pb-md"
          v-model.number="editedGame.away"
          label="Away"
          :options="teamOptions"
          emit-value
          map-options
          name="away"
        :rules="[VALIDATION_RULES.REQUIRED]"
        />
        <q-select
          rounded
          outlined
          class="col-12 "
          v-model.number="editedGame.hammer_first_end"
          label="Hammer first end"
          :options="hammerTeamOptions"
          emit-value
          map-options
          name="hammer_first_end"
        :rules="[VALIDATION_RULES.REQUIRED]"
        />
        <EditorInputDate v-model="editedGame.start_time" class="col-12 q-pb-md" label="Date" name="start_time" />
        <q-input class="col-12" v-model="editedGame.name" label="Name (optional)" outlined rounded name="name"/>
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

const editedGame = ref({
  id: null,
  home: null,
  away: null,
  name: null,
  home_color: "red",
  away_color: "yellow",
  start_time: null,
  hammer_first_end: null,
});
const teamOptions = computed(() => {
  return store.teams.map((t) => {
    return {
      label: t.name || 'Unnamed team',
      value: t.id,
    };
  });
});
const hammerTeamOptions = computed(() => {
  return teamOptions.value.filter((t) => t.value === editedGame.value.home || t.value === editedGame.value.away)
})
onMounted(() => {
  store.getTeams();
  if (props.edited) {
    Object.assign(editedGame.value, props.edited)
  }
});

const onSave = async (e, callback) => {
     const formData = new FormData(e.target);
     
        const data = [...formData.entries()].reduce((all, [key, value]) => {
            return {...all, [key]: value}
        }, {})
        console.log('save: ', {...data, id: editedGame.value.id})
    store.insertGame({...data, id: editedGame.value.id})
    callback();

}
</script>
