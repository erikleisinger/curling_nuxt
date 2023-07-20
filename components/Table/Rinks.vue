<template>
  <!-- <rinkEditor /> -->
  <q-scroll-area class="col-grow" ref="tableArea">
    <q-inner-loading
      :showing="loading"
      label="Please wait..."
      color="primary"
    />
    <q-list bordered separator>
      <q-item clickable @click="toggleRinkDialog(null)" >
        <q-item-section>
          <div class="row items-center">
            <q-icon name="add" size="sm" class="q-mr-xs" />
            <div>Add new rink</div>
          </div>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple v-for="rink in rinks" :key="rink.id">
        <q-item-section>
          <q-item-label>{{ rink.name }}</q-item-label>
          <q-item-label caption> </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="text-grey-8">
            <q-btn
              size="12px"
              flat
              dense
              round
              icon="edit"
              @click.stop="edit(rink)"
            ></q-btn>
            <q-btn
              size="12px"
              flat
              dense
              round
              icon="delete"
              @click.stop="itemToDelete = rink"
            ></q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
  <DialogConfirmation
    v-if="itemToDelete"
    @close="itemToDelete = null"
    @confirm="deleteRink(itemToDelete)"
  >
    Are you sure you want to delete rink "{{ itemToDelete.name ?? "N/A" }}"
  </DialogConfirmation>
</template>
<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useEditorStore} from "@/store/editor";
import {useRinkStore} from "@/store/rinks";
import {useSwipe} from "@vueuse/core";
import {TABLE_NAMES} from "@/constants/tables";
import type Rink from "@/types/rink";
const store = useRinkStore();

const rinks = computed<Rink[]>(() => store.rinks);
const loading = ref<boolean>(false);

const loadRinks = async (force: boolean = false) => {
  loading.value = true;
  await store.fetchRinks(force);
  loading.value = false;
};
onMounted(async () => {
  loadRinks();
});

const {toggleRinkDialog} = useEditorStore();

const tableArea = ref(null);
const {direction} = useSwipe(tableArea, {
  threshold: 200,
  onSwipeEnd: (e) => {
    if (direction.value !== "down") return;
    loadRinks(true);
  },
});

const edit = (rink: Rink) => {
  toggleRinkDialog(rink);
};

const itemToDelete = ref<Rink| null>(null);
const deleteRink = async (rink: Rink) => {
  const {id = null} = rink;
  
  await store.deleteRink(id);
  itemToDelete.value = null;
};
</script>
