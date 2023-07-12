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
        clickable
        v-ripple
        v-for="game in games"
        :key="game.id"
        @click="selectGame(game)"
      >
        <q-item-section>
          <q-item-label overline>{{ game.start_time }}</q-item-label>
          <q-item-label>{{ game.name }}</q-item-label>
          <q-item-label caption>
            <div class="row">
              <RockIcon :color="game.home_color" />{{ game.home.name }}
            </div>
            <div class="row">
              <RockIcon :color="game.away_color" />{{ game.away.name }}
            </div>
          </q-item-label>
        </q-item-section>
        <q-space />
        <q-item-section side>
          <q-item-label> {{ game.ends }} ends </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="text-grey-8">
            <q-btn
              size="12px"
              flat
              dense
              round
              icon="edit"
              @click.stop="edit(game)"
            ></q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {useGameStore} from "@/store/game";
import {useEditorStore} from "@/store/editor";
import {useDataStore} from "@/store/data";
import {TABLE_NAMES} from "@/constants/tables";
import {useSwipe} from "@vueuse/core";
const loading = ref(true);

const store = useGameStore();
const dataStore = useDataStore();

const games = computed(() => dataStore.games);

const loadGames = async (force) => {
  loading.value = true;
  await dataStore.getGames(force);
  loading.value = false;
};

onMounted(() => {
  loadGames();
});

const selectGame = (game) => {
  store.setGame(game);
  navigateTo("/");
};

const edit = (game) => {
  const {formatDate} = useFormat();
  const editorStore = useEditorStore();
  editorStore.toggleGameDialog({
    ...game,
    home: game.home.id,
    away: game.away.id,
    start_time: formatDate(game.start_time, "YYYY/MM/DD", null),
  });
};

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
