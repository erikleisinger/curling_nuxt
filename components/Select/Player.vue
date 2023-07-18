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
<script setup lang="ts">
import {usePlayerStore} from "@/store/players";
import type Player from "@/types/player";
type FilterFunction = (arg:Player) => boolean
const props = defineProps<{
  modelValue: number | null,
  filter: FilterFunction
}>();
const emit = defineEmits(["update:modelValue"]);
const editedPlayer = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});
const store = usePlayerStore();
const loadingPlayers = ref(false);
const {fetchPlayers} = store;
const getPlayers = async (force: boolean) => {
  loadingPlayers.value = true;
  await fetchPlayers(force);
  loadingPlayers.value = false;
};

const {formatPlayerForSelection} = useFormat();
const playerOptions = computed(() => {
  let players = [...store.players];
  if (props.filter) {
    players = players.filter(props.filter);
  }
  return players.map((d) => formatPlayerForSelection(d));
});
const {globalLoading} = useLoading();
</script>
