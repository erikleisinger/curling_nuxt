<template>
  <DialogPlayerEditor />
  <q-scroll-area class="col-grow" ref="tableArea">
    <q-inner-loading
      :showing="loading"
      label="Please wait..."
      color="primary"
    />
    <q-list bordered separator>
      <q-item clickable @click="toggleShotTypeDialog">
        <q-item-section>
          <div class="row items-center">
            <q-icon name="add" size="sm" class="q-mr-xs" />
            <div>Add new shot type</div>
          </div>
        </q-item-section>
      </q-item>
      <q-item
        v-ripple
        v-for="shotType in shotTypes"
        :key="shotType.id"
      >
        <q-item-section>
          <q-item-label>{{ shotType.name }}</q-item-label>
            <q-item-label caption>
            Category: {{ shotType.shot_type }}
          </q-item-label>
        </q-item-section>
      
         <q-item-section side v-if="!RESERVED_NAMES.includes(shotType.name)">
          <div class="text-grey-8">
            <q-btn
              size="12px"
              flat
              dense
              round
              icon="edit"
              @click.stop="edit(shotType)"
            ></q-btn>
                          <q-btn
              size="12px"
              flat
              dense
              round
              icon="delete"
              @click.stop="itemToDelete = shotType"
            ></q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
      <DialogConfirmation v-if="itemToDelete" @close="itemToDelete = null" @confirm="deleteShotType(itemToDelete)">
    Are you sure you want to delete shot type "{{itemToDelete.name ?? 'N/A'}}"
  </DialogConfirmation>
</template>
<script setup>
import {ref, onMounted} from "vue";
import {useDataStore} from "@/store/data";
import {useEditorStore} from "@/store/editor";
import {useSwipe} from "@vueuse/core";
import {RESERVED_NAMES} from '@/constants/shot-types'
const dataStore = useDataStore();

const {sortNameAlphabetically} = useSort()
const shotTypes = computed(() => [...dataStore.shotTypes].sort(sortNameAlphabetically));
const loading = ref(false);

const getShotTypes = async (force) => {
  loading.value = true;
  await dataStore.fetchShotTypes(force);
  loading.value = false;
};
onMounted(async () => {
  getShotTypes();
});

const {toggleShotTypeDialog} = useEditorStore();

const tableArea = ref(null);
const {direction} = useSwipe(tableArea, {
  threshold: 200,
  onSwipeEnd: (e) => {
    if (direction.value !== "down") return;
    getShotTypes(true);
  },
});

const edit = (shotType) => {
    toggleShotTypeDialog(shotType)
}

const itemToDelete = ref(null)
const deleteShotType = async ({id}) => {
  await dataStore.deleteItem(id, 'shotTypes')
  itemToDelete.value = null
}
</script>
