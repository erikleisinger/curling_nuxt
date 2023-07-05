<template>
  <section class="score-inputs__wrap">
    <section class="row q-px-lg" style="">
      <q-select class="col-12 q-pt-lg" outlined rounded label="Player" :options="playerOptions"  v-model="shot.player_id" emit-value map-options>
          <template v-slot:append>
          <q-btn flat round @click="fetchPlayers" :loading="loadingPlayers">
            <q-icon name="refresh" />
          </q-btn>
          </template>
      </q-select>
      <q-input class="col-6 q-pt-lg q-pr-sm" outlined rounded label="Score" />
      <q-select class="col-6 q-pt-lg q-pl-sm" outlined rounded label="Turn" />
      <q-select
        class="col-6 q-pt-lg q-pr-sm"
        outlined
        rounded
        label="Line"
        :options="lineOptions"
        v-model="shot.line"
        emit-value
        map-options
      />
      <q-select
        class="col-6 q-pt-lg q-pl-sm"
        outlined
        rounded
        label="Shot type"
      />
      <q-input
        class="col-12 q-pt-lg"
        type="textarea"
        outlined
        rounded
        label="Notes"
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
import {computed, ref} from "vue";
import Shot from "@/types/shot";
import Line from "@/types/line";
import { useDataStore } from '@/store/data'
const shot = ref<Shot>(new Shot());

const store = useDataStore();
const loadingPlayers = ref(false)

const { enumToSelectionOptions } = useDatabase();
const lineOptions = enumToSelectionOptions(Line);



const {getPlayers} = store;
const fetchPlayers = async () => {
    loadingPlayers.value = true;
    await getPlayers()
    loadingPlayers.value = false;
}
const playerOptions = computed(() => {
    return store.players;
})

</script>

