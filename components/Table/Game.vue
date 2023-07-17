<template>
  <DialogGameEditor />
  <q-scroll-area class="col-grow" ref="tableArea">
    <q-inner-loading
      :showing="loading"
      label="Please wait..."
      color="primary"
    />

    <q-list bordered separator>
      <q-item clickable @click="toggleGameDialog">
        <q-item-section>
          <div class="row items-center">
            <q-icon name="add" size="sm" class="q-mr-xs" />
            <div>Add new game</div>
          </div>
        </q-item-section>
      </q-item>
      <q-item
        v-for="game in games"
        :key="game.id"

      >
       <q-item-section avatar>
         <q-btn flat round  @click.stop="selectGame(game)"> <q-icon color="primary" name="launch"></q-icon></q-btn>
        </q-item-section>
        <q-item-section>
          <q-item-label overline>{{ game.start_time }}</q-item-label>
          <q-item-label>{{ game.name }}</q-item-label>
          <q-item-label caption>
            <div class="row">
              <RockIcon :color="game.home_color" class="q-mr-xs" />{{ game.home.name }}
            </div>
            <div class="row">
              <RockIcon :color="game.away_color" class="q-mr-xs"/>{{ game.away.name }}
            </div>
          </q-item-label>
        </q-item-section>
        <q-space />
        <q-item-section side>
          <q-item-label> {{ game.ends }} ends </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="text-grey-8 row">
            <q-btn
              size="12px"
              flat
              dense
              round
              icon="edit"
              @click.stop="edit(game)"
            ></q-btn>
              <q-btn
                size="12px"
                flat
                dense
                round
                icon="delete"
                @click.stop="itemToDelete = game"
              ></q-btn>
          </div>
          
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
  <DialogConfirmation v-if="itemToDelete" @close="itemToDelete = null" @confirm="deleteGame(itemToDelete)">
    Are you sure you want to delete the game "{{itemToDelete.name ?? 'Unnamed game'}}"
  </DialogConfirmation>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useGameStore} from "@/store/game";
import {useEditorStore} from "@/store/editor";
import {useDataStore} from "@/store/data";
import {TABLE_NAMES} from "@/constants/tables";
import {useSwipe} from "@vueuse/core";
import type Game from '@/types/game'
const props = defineProps({
  edited: Object,
})
const loading = ref(false);
const itemToDelete = ref(null)
const store = useGameStore();
const dataStore = useDataStore();

const games = computed(() => dataStore.games);

const loadGames = async (force:boolean) => {
  loading.value = true;
  await dataStore.getGames(force);
  loading.value = false;
};

const selectGame = (game:Game) => {
  store.setGame(game);
  navigateTo("/");
};

const edit = (game:Game) => {
  const {formatDate} = useFormat();
  const editorStore = useEditorStore();
  editorStore.toggleGameDialog({
    ...game,
    home: game.home.id,
    away: game.away.id,
    hammer_first_end: game.hammer_first_end?.id,
    start_time: formatDate(game.start_time, "YYYY/MM/DD", ""),
  });
};

const deleteGame = async (game:Game) => {
  const {id} = game;
  if (!id) return;
  // TODO: Error handling if no game id
  await dataStore.deleteItem(id, TABLE_NAMES.GAMES)
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
