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
    onlyThrowing: Boolean,
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

/**
 * FILTER PLAYERS BY THOSE ON THE CURRENTLY THROWING TEAM
 * IF: props.onlyThrowing = true;
 */

const gameStore = useGameStore();

const throwingTeam = computed(() => gameStore.getThrowingTeamId(gameStore.shot))

const isPlayerOnCurrentTeam = (player, currentThrowingTeam) => {
  const {id} = player;
  const {lead_player_id, second_player_id, third_player_id, fourth_player_id, fifth_player_id, sixth_player_id, seventh_player_id} = currentThrowingTeam;
  return [lead_player_id, second_player_id, third_player_id, fourth_player_id, fifth_player_id, sixth_player_id, seventh_player_id].some((p) => p?.id === id)

}

const playerOptions = computed(() => {
  let players = [...store.players];
  if (props.onlyThrowing) {
      const currentThrowingTeam = store.teams.find((t) => t.id === throwingTeam.value)
    players = players.filter((p) => isPlayerOnCurrentTeam(p, currentThrowingTeam))
  }
  const {formatPlayerForSelection} = useFormat();
  return players.map((d) => formatPlayerForSelection(d));
});
const {globalLoading} = useLoading();


</script>