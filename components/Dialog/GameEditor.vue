<template>
  <Dialog v-slot="{onDialogOK, onDialogCancel}">
    <q-form @submit="onSave($event, onDialogOK)">
      <q-card>
        <q-card-section class="row wrap flex-break">
          <SelectColor
            v-model="editedGame.home_color"
            class="col-3 q-pr-sm"
            name="home_color"
            :rules="[VALIDATION_RULES.REQUIRED]"
          />
          <SelectTeam v-model="editedGame.home"/>
          <SelectColor
            v-model="editedGame.away_color"
            class="col-3 q-pr-sm"
            name="away_color"
            :rules="[VALIDATION_RULES.REQUIRED]"
          />
            <SelectTeam v-model="editedGame.away"/>
          <q-select
            rounded
            outlined
            class="col-12"
            v-model.number="editedGame.hammer_first_end"
            label="Hammer first end"
            :options="hammerTeamOptions"
            emit-value
            map-options
            name="hammer_first_end"
            :rules="[VALIDATION_RULES.REQUIRED, isSelectedTeam]"
            reactive-rules
          />
          <InputDate
            v-model="editedGame.start_time"
            class="col-12 q-pb-md"
            label="Date"
            name="start_time"
          />
          <q-input
            class="col-12"
            v-model="editedGame.name"
            label="Name (optional)"
            outlined
            rounded
            name="name"
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
<script setup>
import {VALIDATION_RULES} from "@/constants/validation";
import {TABLE_NAMES} from "@/constants/tables";
import {useGameStore} from "@/store/games";
import {useTeamStore} from "@/store/teams";


const props = defineProps({
  edited: Object,
});

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
    const teamStore = useTeamStore();
const teamOptions = computed(() => {
  return teamStore.teams.map((t) => {
    return {
      label: t.name || "Unnamed team",
      value: t.id,
    };
  });
});
const hammerTeamOptions = computed(() => {
  return teamOptions.value.filter(
    (t) =>
      t.value === editedGame.value.home || t.value === editedGame.value.away
  );
});
onMounted(() => {
  if (props.edited) {
    Object.assign(editedGame.value, props.edited);
  }
});

const gameStore = useGameStore();
const onSave = async (e, callback) => {
  const newGame = {...editedGame.value};
  if (!editedGame.value.id) {
    delete newGame.id;
  }
  if (newGame.ends) {
    delete newGame.ends
  }
  const {toUTC} = useTime();
  newGame.start_time =  toUTC(editedGame.value.start_time, null, true)
  gameStore.insertGame(newGame);
  callback();
};

// Validate that hammer_first_end team is one of the teams selected

const isSelectedTeam = (val) => {
  return (
    val === editedGame.value.home ||
    val === editedGame.value.away ||
    "Team is not playing in this game."
  );
};


</script>
