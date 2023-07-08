<template>
<section class="row">
  <EditorGame/>
  <q-scroll-area class="col-grow">
    <q-inner-loading
      :showing="loading"
      label="Please wait..."
      color="primary"
    />
     <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title>Select a game</q-toolbar-title>
    <q-space/>
      <q-btn flat round dense icon="add" @click="openEditor"></q-btn>
    </q-toolbar>
     <q-list bordered separator >
          <q-item clickable v-ripple v-for="game in games" :key="game.id" @click="selectGame(game)">
            <q-item-section>
            <q-item-label overline>{{game.start_time}}</q-item-label>
         <q-item-label>{{game.name}}</q-item-label>
         <q-item-label caption>
            <div class="row"> <q-icon name="remove_circle" class="rotate-45 rock__icon" color="red"/>{{game.away.name}}</div>
             <div class="row"> <q-icon name="remove_circle" class="rotate-45 rock__icon" color="yellow"/>{{game.home.name}}</div>
         </q-item-label>
            </q-item-section>
            <q-space/>
            <q-item-section side >
                <q-item-label >
                    {{game.ends}} ends
                </q-item-label>
            </q-item-section>
      </q-item>
     </q-list>
  </q-scroll-area>
</section>
</template>
<style lang="scss">
    .rock__icon {
        position: relative;
        &:after {
                content: "";
    height: 50%;
    width: 50%;
    background-color: rgba(0,0,0,0.6);
    position: absolute;
    z-index: -1;
    border-radius: 50%;
        }
    }
</style>
<script setup>
import {ref, onMounted} from "vue";
import {useGameStore} from '@/store/game'
import { useEditorStore } from '@/store/editor'
import {TABLE_NAMES} from "@/constants/tables";

definePageMeta({
  layout: 'main',
})

const loading = ref(true);
const games = ref([]);

const store = useGameStore();

onMounted(async () => {
    loading.value = true;
  const {getClient, getQuery, getUser} = useDatabase();
  const {id} = getUser() ?? {};
  const client = getClient();
  const {data, error} = await client
    .from(TABLE_NAMES.GAMES)
    .select(getQuery(TABLE_NAMES.GAMES))
    .eq("profile_id", id);
    console.log('GOT GAMES: ', data)
  if (error) return;
  const gamesRaw = data ?? [];
  const {gameModel} = useModel();
  games.value = gamesRaw.map((g) => gameModel(g))
  loading.value = false;
});

const selectGame = (game) => {
    store.setGame(game);
    navigateTo('/')
}

const openEditor = () => {
    const editorStore = useEditorStore();
    editorStore.toggleGameDialog()
};
</script>
