<template>
  <Dialog v-slot="{onDialogOK, onDialogCancel}">
    <q-form @submit="onSave($event, onDialogOK)">
      <q-card>
        <q-card-section class="row wrap flex-break">
          <q-input
            class="col-12"
            v-model="editedPlayer.name"
            label="Player name"
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
import {useDataStore} from "@/store/data";
import {usePlayerStore} from "@/store/players";
import {extractFormData} from "@/utils/form";
import type Team from '@/types/team'
import type Player from '@/types/player'
const store = useDataStore();

const props = defineProps({
  edited: Object,
});

const editedPlayer = ref<Player>({
  id: null,
  name: null,
  profile_id: null,
});
const teamOptions = computed(() => {
  return store.teams.map((t:Team) => {
    return {
      label: t.name,
      value: t.id,
    };
  });
});
onMounted(() => {
  store.getTeams();
  if (props.edited) {
    Object.assign(editedPlayer.value, props.edited);
    
  }
});

const playerStore = usePlayerStore();
const onSave = async (e: SubmitEvent, callback: Function) => {
  const newPlayer = {...editedPlayer.value}
  if (!editedPlayer.value.id) {
    delete newPlayer.id;
  }
  playerStore.insertPlayer(newPlayer);
  callback();
};
</script>
