<template>
<NuxtLayout>
  <q-scroll-area class="col-grow game-table__container" ref="tableArea" >
    <q-list bordered separator>
      <q-item clickable @click="toggleGameDialog(null)">
        <q-item-section>
          <div class="row items-center">
            <q-icon name="add" size="sm" class="q-mr-xs" />
            <div>Add new game</div>
          </div>
        </q-item-section>
      </q-item>
      <TableGameItem  v-for="game in games" :key="game.id" :game="game" @select="selectGame" @delete="itemToDelete = $event" @edit="edit" class="q-mt-xl"/>
    </q-list>
  </q-scroll-area>
  <DialogConfirmation v-if="itemToDelete" @close="itemToDelete = null" @confirm="deleteGame(itemToDelete)">
    Are you sure you want to delete the game "{{itemToDelete.name ?? 'Unnamed game'}}"
  </DialogConfirmation>
</NuxtLayout>
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
const {toTimezone} = useTime();


const loading = ref(false);
const itemToDelete = ref(null)
const store = useSessionStore();
const gameStore = useGameStore();

const games = computed(() => gameStore.games);

const loadGames = async (force:boolean) => {
  loading.value = true;

  await useGameStore().fetchGames(force);
  loading.value = false;
};

const selectGame = async (game:Game) => {
  navigateTo(`/game?id=${game.id}`);
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

onBeforeMount(async () => {
    const {setLoading} = useLoading();
    setLoading(true)
    await loadGames(true)
    console.log(games.value)
    setLoading(false)
})


</script>
