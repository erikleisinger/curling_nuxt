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
import {usePlayerStore} from "@/store/players";
import {useGameStore } from '@/store/game'
const props = defineProps({
    player: String,
    filter: Function,
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
const store = usePlayerStore();
const loadingPlayers = ref(false);
const {fetchPlayers} = store;
const getPlayers = async (force) => {
  loadingPlayers.value = true;
  await fetchPlayers(force);
  loadingPlayers.value = false;
};

const {formatPlayerForSelection} = useFormat();
const playerOptions = computed(() => {
  let players = [...store.players];
  if (props.filter) {
    players = players.filter(props.filter)
  }
  return players.map((d) => formatPlayerForSelection(d))
});
const {globalLoading} = useLoading();


</script>