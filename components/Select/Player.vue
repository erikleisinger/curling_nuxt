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
const props = defineProps({
    player: String,
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
const playerOptions = computed(() => {
  const {formatPlayerForSelection} = useFormat();
  return [...store.players].map((d) => formatPlayerForSelection(d));
});
const {globalLoading} = useLoading();
</script>