<template>
  <Dialog v-slot="{onDialogOK, onDialogCancel}" style="width: 90vw">
    <q-form @submit="onSave(onDialogOK)" ref="form" style="width: 90vw">
      <q-card style="width: 90vw">
        <q-card-section>
            <q-card-label>
                <h1>{{teamName}}</h1>
            </q-card-label>
        </q-card-section>
        <q-card-section class="row wrap flex-break">
           <SelectTeamPlayers v-model="players" color="deepPurple"/>
          
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
<script setup lang="ts">
import {VALIDATION_RULES} from "@/constants/validation";
import {TABLE_NAMES} from "@/constants/tables";
import {useTeamStore} from "@/store/teams";
import type Team from '@/types/team'
import type {TeamPlayerPosition} from '@/types/team'
import type PlayerId from '@/types/player'
const store = useTeamStore();

const props = defineProps({
  edited: Object,
});

/**
 * BEGIN VALIDATION
 */
const checkForExistingPlayer = (val:PlayerId, field:TeamPlayerPosition) => {
  if (!val) return true;
  return !Object.entries(editedTeam.value).some(([key, value]) => {
    if (key === "id" || key === "name" || key === field) return false;
    return `${value}` === `${val}`;
  });
};
const playerRules = (field:TeamPlayerPosition) => {
  return (val:PlayerId) =>
    checkForExistingPlayer(val, field) || "Player already selected";
};

/**
 * END VALIDATION
 */

const editedTeam = ref<Team>({
  id: undefined,
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
const teamName = ref('')

const setName = (isEdited) => {
    if (isEdited && editedTeam.value.name) {
        teamName.value = editedTeam.value.name
    } else if (isEdited) {
        teamName.value = 'Edit team'
    } else {
        teamName.value = 'New team'
    }
}


onMounted(() => {
  store.fetchTeams();
  if (props.edited) {
    Object.assign(editedTeam.value, props.edited);
    setName(true)
  }
});

const onSave = async (callback: Function) => {
  const newTeam = {...editedTeam.value};
  if (!editedTeam.value.id) {
    delete newTeam.id
  }
  store.insertTeam(newTeam);
  callback();
};

const players = ref({})
</script>
