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
          <q-item-label overline>{{ formatDate(game.start_time) }}</q-item-label>
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
          <q-item-label> {{ endCount(game) }} ends </q-item-label>
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
import {useSessionStore} from "@/store/session";
import {useEditorStore} from "@/store/editor";
import {useGameStore} from "@/store/games";
import {TABLE_NAMES} from "@/constants/tables";
import {useSwipe} from "@vueuse/core";
import type Game from '@/types/game'
const props = defineProps({
  edited: Object,
})
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

const {formatDate} = useFormat()

const endCount = (game:Game) => {
  const [end] = game.ends;
  const {count} = end;
  return count;
}
</script>
