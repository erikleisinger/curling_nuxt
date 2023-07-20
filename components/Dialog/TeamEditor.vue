<template>
  <Dialog v-slot="{onDialogOK, onDialogCancel}">
    <q-form @submit="onSave(onDialogOK)" ref="form">
      <q-card>
        <q-card-section class="row wrap flex-break">
          <q-input
            class="col-12 q-field--with-bottom"
            v-model="editedTeam.name"
            label="Team name (optional)"
            outlined
            rounded
            name="name"
          />
          <SelectPlayer
            v-model.number="editedTeam.lead_player_id"
            label="Lead"
            name="lead_player_id"
            :rules="[playerRules('lead_player_id')]"
            reactive-rules
            class="col-12"
          />
          <SelectPlayer
            v-model.number="editedTeam.second_player_id"
            label="Second"
            name="second_player_id"
            :rules="[playerRules('second_player_id')]"
            reactive-rules
            class="col-12"
          />
          <SelectPlayer
            v-model.number="editedTeam.third_player_id"
            label="Third"
            name="third_player_id"
            :rules="[playerRules('third_player_id')]"
            reactive-rules
            class="col-12"
          />
          <SelectPlayer
            v-model.number="editedTeam.fourth_player_id"
            label="Fourth"
            name="fourth_player_id"
            :rules="[playerRules('fourth_player_id')]"
            reactive-rules
            class="col-12"
          />
          <SelectPlayer
            v-model.number="editedTeam.fifth_player_id"
            label="Fifth"
            name="fifth_player_id"
            :rules="[playerRules('fifth_player_id')]"
            reactive-rules
            class="col-12"
          />
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
import type {TeamPlayers} from '@/types/team'
import type PlayerId from '@/types/player'
const store = useTeamStore();

const props = defineProps({
  edited: Object,
});

/**
 * BEGIN VALIDATION
 */
const checkForExistingPlayer = (val:PlayerId, field:TeamPlayers) => {
  if (!val) return true;
  return !Object.entries(editedTeam.value).some(([key, value]) => {
    if (key === "id" || key === "name" || key === field) return false;
    return `${value}` === `${val}`;
  });
};
const playerRules = (field:TeamPlayers) => {
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
onMounted(() => {
  store.fetchTeams();
  if (props.edited) {
    Object.assign(editedTeam.value, props.edited);
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
</script>
