<template>
  <q-table
    :columns="columnsComputed"
    :rows="rows"
    row-key="id"
    :title="tableName"
  />
</template>

<script setup>
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
</script>
