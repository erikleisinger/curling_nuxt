<template>
  <q-select
    :loading="loading"
    :label="item.displayName"
    :name="props.name"
    :options="items"
    :option-value="(foreignKey && foreignKey.field) || 'value'"
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

// Refs
const loading = ref(false);
const selection = ref(null);
const items = ref([]);

// Computed
const foreignKey = computed(() => props?.item?.foreignKey);
const isForeignKey = computed(() => !!foreignKey?.value);
const formatter = computed(() => props.item?.format ?? "label");

// Methods
const getOptionValue = ({id}) => id;

onMounted(async () => {
  loading.value = true;
  if (isForeignKey.value) {
    const client = useSupabaseClient();
    const {data} = await client
      .from(foreignKey.value.tableName)
      .select(
        `${foreignKey.value.field}, ${[...foreignKey.value.displayFields].join(
          ", "
        )}`
      );
    items.value = data ?? [];
  } else if (props.item.options) {
    items.value = [...props.item.options];
  }
  loading.value = false;
});
</script>
