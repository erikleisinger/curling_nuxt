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
             <q-item-section side >
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
    <DialogDeleteConfirmation v-if="itemToDelete" @close="itemToDelete = null" @confirm="deletePlayer(itemToDelete)">
    Are you sure you want to delete player "{{itemToDelete.name ?? 'N/A'}}"
  </DialogDeleteConfirmation>
</template>
<script setup>
import {ref, onMounted} from "vue";
import {useDataStore} from '@/store/data'
import {useEditorStore} from '@/store/editor'
import {useSwipe} from '@vueuse/core'
import {TABLE_NAMES} from '@/constants/tables'
  const dataStore = useDataStore()

const {sortNameAlphabetically} = useSort()
  const players = computed(() => [...dataStore.players].sort(sortNameAlphabetically))
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
  if (direction.value !== 'down') return;
  loadPlayers(true);
}})
const edit = (player) => {
  togglePlayerDialog(player)
}

const itemToDelete = ref(null)
const deletePlayer = async ({id}) => {
  await dataStore.deleteItem(id, TABLE_NAMES.PLAYERS)
  itemToDelete.value = null
}
</script>