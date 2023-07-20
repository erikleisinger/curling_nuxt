<template>
  <DialogSheetEditor />
  <q-scroll-area class="col-grow" ref="tableArea">
    <q-inner-loading
      :showing="loading"
      label="Please wait..."
      color="primary"
    />
    <q-list bordered separator>
      <q-item clickable @click="toggleSheetDialog(null)" >
        <q-item-section>
          <div class="row items-center">
            <q-icon name="add" size="sm" class="q-mr-xs" />
            <div>Add new sheet</div>
          </div>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple v-for="sheet in sheets" :key="sheet.id">
        <q-item-section>
          <q-item-label>{{ sheet.name }}</q-item-label>
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
              @click.stop="edit(sheet)"
            ></q-btn>
            <q-btn
              size="12px"
              flat
              dense
              round
              icon="delete"
              @click.stop="itemToDelete = sheet"
            ></q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
  <DialogConfirmation
    v-if="itemToDelete"
    @close="itemToDelete = null"
    @confirm="deleteSheet(itemToDelete)"
  >
    Are you sure you want to delete sheet "{{ itemToDelete.name ?? "N/A" }}"
  </DialogConfirmation>
</template>
<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useEditorStore} from "@/store/editor";
import {useSheetStore} from "@/store/sheets";
import {useSwipe} from "@vueuse/core";
import {TABLE_NAMES} from "@/constants/tables";
import type Sheet from "@/types/sheet";
const store = useSheetStore();

const sheets = computed<Sheet[]>(() => store.sheets);
const loading = ref<boolean>(false);

const loadSheets = async (force: boolean = false) => {
  loading.value = true;
  await store.fetchSheets(force);
  loading.value = false;
};
onMounted(async () => {
  loadSheets();
});

const {toggleSheetDialog} = useEditorStore();

const tableArea = ref(null);
const {direction} = useSwipe(tableArea, {
  threshold: 200,
  onSwipeEnd: (e) => {
    if (direction.value !== "down") return;
    loadSheets(true);
  },
});

const edit = (sheet: Sheet) => {
  toggleSheetDialog(sheet);
};

const itemToDelete = ref<Sheet| null>(null);
const deleteSheet = async (sheet: Sheet) => {
  const {id = null} = sheet;
  
  await store.deleteSheet(id);
  itemToDelete.value = null;
};
</script>
