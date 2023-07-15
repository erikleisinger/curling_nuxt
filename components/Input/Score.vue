<template>
  <section class="score-inputs__wrap col-grow">
    <section class="row q-px-lg">
       <SelectPlayer v-model="editedShot.player_id" class="col-12 q-pt-lg q-pr-sm" />
      <q-input
        class="col-6 q-pt-lg q-pr-sm"
        outlined
        rounded
        label="Score"
        v-model="editedShot.score"
        :disable="globalLoading"
      />
      <q-select
        class="col-6 q-pt-lg q-pl-sm"
        outlined
        rounded
        label="Turn"
        :disable="globalLoading"
        v-model="editedShot.turn"
        :options="turnOptions"
        emit-value
        map-options
      />
      <q-select
        class="col-6 q-pt-lg q-pr-sm"
        outlined
        rounded
        label="Line"
        :options="lineOptions"
        v-model="editedShot.line"
        emit-value
        map-options
        :disable="globalLoading"
      />
     <SelectShotType v-model="editedShot.type_id"/>
      <q-input
        class="col-12 q-pt-lg"
        type="textarea"
        outlined
        rounded
        label="Notes"
        :disable="globalLoading"
        v-model="editedShot.notes"
      />
          <section class="row justify-center col-12 q-pt-lg">
          <q-btn @click="save"  color="primary"
        >Save changes</q-btn>
    </section> 
    </section>
 
  </section>
</template>
<style lang="scss">
.score-inputs__wrap {
  overflow: auto;
  section {
    height: 0px;
  }
}
</style>
<script setup lang="ts">
import {computed, inject, onMounted, ref, watch} from "vue";
import Line from "@/types/line";
import Turn from "@/types/turn";
import {useDataStore} from "@/store/data";
import {useGameStore} from "@/store/game";
import {TABLE_NAMES} from "@/constants/tables";
import {toValue} from '@vueuse/core'

const editedShot = inject("editedShot");
const store = useDataStore();

// Selection options

// Enums

const {enumToSelectionOptions} = useDatabase();
const lineOptions = enumToSelectionOptions(Line);
const turnOptions = enumToSelectionOptions(Turn);

// Shot types
const { fetchShotTypes} = store;
const loadingShotTypes = ref(false);
const getShotTypes = async (force: any) => {
  loadingShotTypes.value = true;
  await fetchShotTypes(force);
  loadingShotTypes.value = false;
};
const shotTypeOptions = computed(() => {
   const {formatShotTypeForSelection} = useFormat();
  return [...store.shotTypes].map((st) => formatShotTypeForSelection(st))
});

onMounted(() => {
  fetchShotTypes();
});

// Disabled/loading state

const {globalLoading} = useLoading();

// Save shot 

const gameStore = useGameStore();
const save = () => {
  gameStore.saveShot(toValue(editedShot))
}
</script>
