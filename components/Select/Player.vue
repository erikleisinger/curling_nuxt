<template>
<div class="row justify-between">
    <div v-for="player in playerOptions" :key="player.id" class="player__wrap" >
    </div>
</div>
  <!-- <q-select
    outlined
    rounded
    label="Player"
    :options="playerOptions"
    v-model.number="editedPlayer"
    emit-value
    map-options
    :disable="globalLoading"
    use-input
    input-debounce="0"
    @input-value="onInput"
    ref="playerSelect"
  >
  <template v-slot:selected v-if="!editedPlayer  && input">
       <q-chip class="glossy" color="positive" text-color="white" icon-right="add_circle_outline" style="order:1" @click="addPlayer" :clickable="!inserting">
        {{input}}
      </q-chip>
  </template>
  <template v-slot:before-options>
    <q-item>
        <q-item-section>
        <q-item-label>Type a name to search for them, or tap to create a new player.</q-item-label>
        </q-item-section>
    </q-item>
  </template>   
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
  </q-select> -->
</template>
<style lang="scss">
    .player__wrap {
        border-radius: 50%;
        border: 1px solid black;
        height: 50px;
        width: 50px;
        &:hover {
            background-color: seashell;
        }
    }
</style>
<script setup lang="ts">
import {usePlayerStore} from "@/store/players";
import type Player from "@/types/player";
type FilterFunction = (arg:Player) => boolean
const props = defineProps<{
  modelValue: number | null | undefined,
  filter?: FilterFunction,
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
  return players
});
const {globalLoading} = useLoading();

const input = ref('')
const onInput = (e:string) => {
    input.value = e;
}

const playerSelect = ref(null)
const inserting = ref(false)
const addPlayer = async () => {
    inserting.value = true;
  const newPlayer = {
    name: input.value
  }
  const player = await store.insertPlayer(newPlayer);
  editedPlayer.value = player?.id;
  
  inserting.value = false
  nextTick(() => {
 playerSelect.value.blur();
  playerSelect.hidePopup();
  })
 

}
</script>
