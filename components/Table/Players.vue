<template>
     <DialogPlayerEditor/>
  <q-scroll-area class="col-grow">
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
  const dataStore = useDataStore()

  const players = computed(() => dataStore.players)
  const loading = ref(false)

onMounted(async () => {

loading.value = true;
await dataStore.fetchPlayers();
loading.value = false;
});

const {togglePlayerDialog} = useEditorStore();
</script>