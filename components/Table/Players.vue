<template>
  <DialogPlayerEditor />
  <q-scroll-area class="col-grow" ref="tableArea">
    <q-inner-loading
      :showing="loading"
      label="Please wait..."
      color="primary"
    />
    <q-list bordered separator>
      <q-item clickable @click="togglePlayerDialog(null)">
        <q-item-section>
          <div class="row items-center">
            <q-icon name="add" size="sm" class="q-mr-xs" />
            <div>Add new player</div>
          </div>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple v-for="player in players" :key="player.id">
        <q-item-section>
          <q-item-label>{{ player.name }}</q-item-label>
          <q-item-label caption> </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="text-grey-8">
            <q-btn
              size="12px"
              flat
              dense
              round
              icon="edit"
              @click.stop="edit(player)"
            ></q-btn>
            <q-btn
              size="12px"
              flat
              dense
              round
              icon="delete"
              @click.stop="itemToDelete = player"
            ></q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
  <DialogConfirmation
    v-if="itemToDelete"
    @close="itemToDelete = null"
    @confirm="deletePlayer(itemToDelete)"
  >
    Are you sure you want to delete player "{{ itemToDelete.name ?? "N/A" }}"
  </DialogConfirmation>
</template>
<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useEditorStore} from "@/store/editor";
import {usePlayerStore} from "@/store/players";
import {useSwipe} from "@vueuse/core";
import {TABLE_NAMES} from "@/constants/tables";
import type Player from "@/types/player";
const store = usePlayerStore();

const players = computed<Player[]>(() => store.players);
const loading = ref<boolean>(false);

const loadPlayers = async (force: boolean = false) => {
  loading.value = true;
  await store.fetchPlayers(force);
  loading.value = false;
};
onMounted(async () => {
  loadPlayers();
});

const {togglePlayerDialog} = useEditorStore();

const tableArea = ref(null);
const {direction} = useSwipe(tableArea, {
  threshold: 200,
  onSwipeEnd: (e) => {
    if (direction.value !== "down") return;
    loadPlayers(true);
  },
});

const edit = (player: Player) => {
  togglePlayerDialog(player);
};

const itemToDelete = ref<Player | null>(null);
const deletePlayer = async (player: Player) => {
  const {id = null} = player;
  
  await store.deletePlayer(id);
  itemToDelete.value = null;
};
</script>
