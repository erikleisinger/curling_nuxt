<template>
     <DialogPlayerEditor/>
  <q-scroll-area class="col-grow" ref="tableArea">
    <q-inner-loading
      :showing="loading"
      label="Please wait..."
      color="primary"
    />
     <q-list bordered separator >
      <q-item clickable @click="togglePlayerDialog">
        <q-item-section >
          <div class="row items-center">
          <q-icon name="add" size="sm" class="q-mr-xs"/><div>Add new player</div>
          </div>
        </q-item-section>
      </q-item>
          <q-item  clickable v-ripple v-for="player in players" :key="player.id">
            <q-item-section>
         <q-item-label>{{player.name}}</q-item-label>
         <q-item-label caption>
      
         </q-item-label>
            </q-item-section> 
      </q-item>
     </q-list>
  </q-scroll-area>
</template>
<script setup>
import {ref, onMounted} from "vue";
import {useDataStore} from '@/store/data'
import {useEditorStore} from '@/store/editor'
import {useSwipe} from '@vueuse/core'
  const dataStore = useDataStore()

  const players = computed(() => dataStore.players)
  const loading = ref(false)

const loadPlayers = async (force) => {
  loading.value = true;
await dataStore.fetchPlayers(force);
loading.value = false;
}
onMounted(async () => {
loadPlayers();
});

const {togglePlayerDialog} = useEditorStore();

const tableArea = ref(null)
const {direction} = useSwipe(tableArea, {threshold: 200, onSwipeEnd: (e) => {
  console.log(direction.value)
  if (direction.value !== 'down') return;
  loadPlayers(true);
}})
</script>