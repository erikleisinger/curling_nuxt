<template>

  <q-scroll-area class="col-grow game-table__container " ref="tableArea" >
    <q-inner-loading
      :showing="loading"
      label="Please wait..."
      color="primary"
    />

    <q-list bordered separator>
      <q-item clickable @click="toggleGameDialog(null)">
        <q-item-section>
          <div class="row items-center">
            <q-icon name="add" size="sm" class="q-mr-xs" />
            <div>Add new game</div>
          </div>
        </q-item-section>
      </q-item>
      <TableGameItem  v-for="game in games" :key="game.id" :game="game" @select="selectGame" @delete="itemToDelete = $event" @edit="edit"/>
    </q-list>
  </q-scroll-area>
  <DialogConfirmation v-if="itemToDelete" @close="itemToDelete = null" @confirm="deleteGame(itemToDelete)">
    Are you sure you want to delete the game "{{itemToDelete.name ?? 'Unnamed game'}}"
  </DialogConfirmation>
</template>
<style lang="scss">
    .game-table__container {
    //     background-color:rgba(246, 247, 252, 0.1);
    // color:rgba(246, 247, 252, 1);
    }
</style>
<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useSessionStore} from "@/store/session";
import {useEditorStore} from "@/store/editor";
import {useGameStore} from "@/store/games";
import {TABLE_NAMES} from "@/constants/tables";
import {useSwipe} from "@vueuse/core";
import type Game from '@/types/game'

const props = defineProps({
  edited: Object,
})
const {toTimezone} = useTime();

const loading = ref(false);
const itemToDelete = ref(null)
const store = useSessionStore();
const gameStore = useGameStore();

const games = computed(() => gameStore.games);

const loadGames = async (force:boolean) => {
  loading.value = true;
  await gameStore.fetchGames(force);
  loading.value = false;
};

const selectGame = async (game:Game) => {
  loading.value = true;
  store.setGame(game);
  await store.initGame()
  navigateTo("/game");
    loading.value = false;
};

const edit = (game:Game) => {
  const editorStore = useEditorStore();
  editorStore.toggleGameDialog({
    ...game,
    home: game.home.id,
    away: game.away.id,
    hammer_first_end: game.hammer_first_end?.id,
    start_time: toTimezone(game.start_time, "YYYY/MM/DD HH:mm"),
  });
};

const deleteGame = async (game:Game) => {
  const {id} = game;
  if (!id) return;
  // TODO: Error handling if no game id
  await gameStore.deleteGame(id)
  itemToDelete.value = null
}

const {toggleGameDialog} = useEditorStore();

const tableArea = ref(null);
const {direction} = useSwipe(tableArea, {
  threshold: 200,
  onSwipeEnd: (e) => {
    if (direction.value !== "down") return;
    loadGames(true);
  },
});


</script>
