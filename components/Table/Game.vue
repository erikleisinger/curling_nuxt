<template>
     <DialogGameEditor/>
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
          <q-item  clickable v-ripple v-for="game in games" :key="game.id" @click="selectGame(game)">
            <q-item-section>
            <q-item-label overline>{{game.start_time}}</q-item-label>
         <q-item-label>{{game.name}}</q-item-label>
         <q-item-label caption>
                 <div class="row"> <RockIcon :color="game.home_color"/>{{game.home.name}}</div>
            <div class="row"> <RockIcon :color="game.away_color"/>{{game.away.name}}</div>
      
         </q-item-label>
            </q-item-section>
            <q-space/>
            <q-item-section side >
                <q-item-label >
                    {{game.ends}} ends
                </q-item-label>
            </q-item-section>
            <q-item-section side>
          <div class="text-grey-8 ">
            <q-btn  size="12px" flat dense round icon="edit" @click.stop="edit(game)"></q-btn>
          </div>
        </q-item-section>
            
      </q-item>
     </q-list>
  </q-scroll-area>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {useGameStore} from '@/store/game'
import { useEditorStore } from '@/store/editor'
import {useDataStore} from '@/store/data'
import {TABLE_NAMES} from "@/constants/tables";
  const loading = ref(true);



const store = useGameStore();
  const dataStore = useDataStore()

  const games = computed(() => dataStore.games)

onMounted(async () => {

loading.value = true;
await dataStore.getGames();
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
const edit = (game) => {
  const {formatDate} = useFormat();
 const editorStore = useEditorStore();
    editorStore.toggleGameDialog({
        ...game,
        home: game.home.id,
        away: game.away.id,
        start_time: formatDate(game.start_time, 'YYYY/MM/DD', null),
      })
}
</script>