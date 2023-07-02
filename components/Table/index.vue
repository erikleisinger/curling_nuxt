<template>
  <q-table
    :columns="columnsComputed"
    :rows="rows"
    row-key="id"
    :title="tableName"
    virtual-scroll
    class="data-table"
  >
  <template v-slot:top-right>
    <q-btn icon="add" flat round @click="openEditor"/>
  </template>
  </q-table>
</template>
<style lang="scss">
  .data-table {
    max-height: 300px;
  }
</style>
<script setup>
import { useEditorStore } from '@/store/editor'
import {computed} from "vue";
const props = defineProps({
  columns: {
    type: Array,
    default() {
      return [];
    },
  },
  rows: {
    type: Array,
    default() {
      return [];
    },
  },
  tableName: String,
});

const store = useEditorStore()

const columnsComputed = computed(() => {
  if (!props?.columns?.length) return [];
  return props.columns.map((name) => {
    return {
      name,
      label: name,
      align: "left",
      field: (row) => row.name,
      format: (val, row) => row[name],
    };
  });
});

const openEditor = () => {
  store.init(props.tableName, true)
}
</script>
