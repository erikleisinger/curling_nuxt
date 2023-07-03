<template>
  <q-table
    :columns="columns"
    :rows="rows"
    row-key="id"
    :title="tableName"
    virtual-scroll
    class="data-table"
    :loading="loading"
  >
    <template v-slot:top-right>
      <q-btn icon="add" flat round @click="openEditor" />
    </template>
  </q-table>
</template>
<style lang="scss">
.data-table {
  max-height: 300px;
}
</style>
<script setup>
import {storeToRefs} from "pinia";
import {useEditorStore} from "@/store/editor";
import {computed, ref, watch} from "vue";
const props = defineProps({
  loading: Boolean,
  setLoading: Function,
  tableName: String,
});

const {getSchema, getQuery} = useDatabase();
const columns = ref([]);
const rows = ref([]);

const store = useEditorStore();
const openEditor = () => {
  store.init(props.tableName, true);
};
const client = useSupabaseAuthClient();

const getTable = async () => {
  rows.value = []
  columns.value = [];
  const schema = getSchema(props.tableName);
  const query = getQuery(props.tableName)
  if (!schema || !query) return;
  setColumns(schema);
  props.setLoading(true);
  const user = useSupabaseUser();
  const {id = '0'} = user.value || {};
  console.log('SUPABASE USER: ', user.value.id)
  const data = await client.from(props.tableName).select(query).eq('profile_id', id)
  rows.value = data.data;
  props.setLoading(false);
};

const setColumns = (schema) => {
  columns.value = Object.entries(schema).reduce((all, [name, val]) => {
    if (!val.visible) return all;
    const defaultFormat = (val, row) => row[name] || 'N/A'
    const getFormatFunction = (callback) => {
   
      return (val, row) => {

        return callback(row[name])
      }
    }
    return [
      ...all,
      {
        name,
        label: val.displayName,
        align: "left",
        field: (row) => row.name,
        format: val.format ? getFormatFunction(val.format) : defaultFormat,
      },
    ];
  }, []);

};

const tableName = computed(() => props.tableName);
watch(
  tableName,
  () => {
    getTable();
  },
  {immediate: true}
);
</script>
