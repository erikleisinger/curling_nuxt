<template>
  <Dialog v-slot="{onDialogOK, onDialogCancel}">
            <q-form @submit="onSave($event, onDialogOK)">
    <q-card>
      <q-card-section class="row wrap flex-break">
        <!-- rules="[VALIDATION_RULES.REQUIRED]"   aria-required="true" -->
             <q-input class="col-12" v-model="editedTeam.name" label="Team name (optional)" outlined rounded name="name" />
        <SelectPlayer v-model.number="editedTeam.lead_player_id" label="Lead" name="lead_player_id"/>
         <SelectPlayer v-model.number="editedTeam.second_player_id" label="Second" name="second_player_id"/>
          <SelectPlayer v-model.number="editedTeam.third_player_id" label="Third"  name="third_player_id"/>
           <SelectPlayer v-model.number="editedTeam.fourth_player_id" label="Fourth"  name="fourth_player_id"/>
            <SelectPlayer v-model.number="editedTeam.fifth_player_id" label="Fifth"  name="fifth_player_id"/>
             <!-- <SelectPlayer v-model.number="editedTeam.sixth_player_id" label="Sixth" name="sixth_player_id"/>
              <SelectPlayer v-model.number="editedTeam.seventh_player_id" label="Seventh" name="seventh_player_id"/> -->
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

const editedTeam = ref({
  id: null,
  name: null,
  lead_player_id: null,
  second_player_id: null,
  third_player_id: null,
  fourth_player_id: null,
  fifth_player_id: null,
  sixth_player_id: null,
  seventh_player_id: null,
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
    Object.assign(editedTeam.value, props.edited)
  }
});

const onSave = async (e, callback) => {
     const formData = new FormData(e.target);
     
        const data = [...formData.entries()].reduce((all, [key, value]) => {
            return {...all, [key]: value}
        }, {})
       const newTeam = {...data};
        if (editedTeam.value.id) {
          newTeam.id = editedTeam.value.id
        }
    store.insertTeam(newTeam)
    callback();

}
</script>
