<template>
  <q-select
    :loading="loading"
    :label="item.displayName"
    :name="props.name"
    :options="items"
    :option-value="foreignKey && foreignKey.field || 'value'"
    :option-label="formatter"
    v-model="selection"
    :rules="[VALIDATION_RULES.REQUIRED]"
  />
</template>
<script setup>
import {VALIDATION_RULES} from "@/constants/validation";
import {computed, onMounted, ref} from "vue";
const props = defineProps({
  item: Object,
  name: String,
});
const loading = ref(false);
const selection = ref(null);
const items = ref([]);
const foreignKey = computed(() => props?.item?.foreignKey);
const isForeignKey = computed(() => !!foreignKey?.value);

const formatter = computed(() => {
    if (!props.item?.format) return 'label'
    return props.item.format
});

onMounted(async () => {
  if (isForeignKey.value) {
    loading.value = true;
    const client = useSupabaseClient();
    const {data} = await client
      .from(foreignKey.value.tableName)
      .select(`${foreignKey.value.field}, ${[...foreignKey.value.displayFields].join(', ')}`);
    items.value = data ?? [];
    loading.value = false;
  } else if (props.item.options) {
    console.log(props.item.options)
    items.value = [...props.item.options]
  }
});
const getOptionValue = (option) => {
  console.log("OPTION: ", option.id);
  return option.id;
};
</script>
