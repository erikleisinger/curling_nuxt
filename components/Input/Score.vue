<template>
  <section class="score-inputs__wrap">
    <section class="row q-px-lg" style="">
      <q-select class="col-12 q-pt-lg" outlined rounded label="Player" :options="playerOptions"  v-model="editedShot.player_id" emit-value map-options :disable="saving">
          <template v-slot:append>
          <q-btn flat round @click.stop="fetchPlayers" :loading="loadingPlayers">
            <q-icon name="refresh" />
          </q-btn>
          </template>
      </q-select>
      <q-input class="col-6 q-pt-lg q-pr-sm" outlined rounded label="Score" v-model="editedShot.score" :disable="saving"/>
      <q-select class="col-6 q-pt-lg q-pl-sm" outlined rounded label="Turn" :disable="saving" v-model="editedShot.turn" :options="turnOptions" emit-value
        map-options />
      <q-select
        class="col-6 q-pt-lg q-pr-sm"
        outlined
        rounded
        label="Line"
        :options="lineOptions"
        v-model="editedShot.line"
        emit-value
        map-options
        :disable="saving"
      />
      <q-select
        class="col-6 q-pt-lg q-pl-sm"
        outlined
        rounded
        label="Shot type"
        :options="shotTypeOptions"
        v-model="editedShot.type_id"
        emit-value
        map-options
        :disable="saving"
      >
<template v-slot:append>
          <q-btn flat round @click.stop="fetchShotTypes" :loading="loadingShotTypes">
            <q-icon name="refresh" />
          </q-btn>
          </template>
      </q-select>
      <q-input
        class="col-12 q-pt-lg"
        type="textarea"
        outlined
        rounded
        label="Notes"
        :disable="saving"
        v-model="editedShot.notes"
      />
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
import Turn from '@/types/turn'
import { useDataStore } from '@/store/data'
import { useGameStore } from '@/store/game'
import { TABLE_NAMES} from '@/constants/tables'

const saving = ref(false)
const editedShot = inject('editedShot')
const store = useDataStore();
const loadingPlayers = ref(false)
const loadingShotTypes = ref(false)
const { enumToSelectionOptions } = useDatabase();
const lineOptions = enumToSelectionOptions(Line);
const turnOptions = enumToSelectionOptions(Turn)



const {getPlayers, getShotTypes} = store;
const fetchPlayers = async () => {
    loadingPlayers.value = true;
    await getPlayers()
    loadingPlayers.value = false;
}

const fetchShotTypes = async () => {
    loadingShotTypes.value = true;
    await getShotTypes()
    loadingShotTypes.value = false;
}
const playerOptions = computed(() => {
    return store.players;
})
const shotTypeOptions = computed(() => {
  return store.shotTypes;
})



onMounted(() => {
 fetchShotTypes();
 fetchPlayers();
})

</script>

