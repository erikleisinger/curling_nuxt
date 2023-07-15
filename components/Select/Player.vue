<template>
    <q-select
        outlined
        rounded
        label="Player"
        :options="playerOptions"
        v-model.number="editedPlayer"
        emit-value
        map-options
        :disable="globalLoading"
      >
        <template v-slot:append>
          <q-btn
            flat
            round
            @click.stop="getPlayers(true)"
            :loading="loadingPlayers"
          >
            <q-icon name="refresh" />
          </q-btn>
        </template>
      </q-select>
</template>
<script setup>
import {useDataStore} from "@/store/data";
import {useGameStore } from '@/store/game'
const props = defineProps({
    player: String,
    filter: Boolean,
})
const emit = defineEmits(['update:modelValue'])
const editedPlayer = computed({
    get() {
        return props.player
    },
    set(val) {
        emit('update:modelValue', val)
    }
})
const store = useDataStore();
const loadingPlayers = ref(false);
const {fetchPlayers, getShotTypes} = store;
const getPlayers = async (force) => {
  loadingPlayers.value = true;
  await fetchPlayers(force);
  loadingPlayers.value = false;
};

const {sortAlphabetically} = useSort();
const playerOptions = computed(() => {
  let players = [...store.players];
  if (props.filter) {
    players.filter(props.filter)
  }
  const {formatPlayerForSelection} = useFormat();
  return players.map((d) => formatPlayerForSelection(d)).sort((a,b) => sortAlphabetically(a.label, b.label))
});
const {globalLoading} = useLoading();


</script>