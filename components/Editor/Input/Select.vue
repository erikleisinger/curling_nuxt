<template>
     <q-select :loading="loading"  :label="props.name" :name="props.name" :options="items" :option-value="foreignKey.field" :option-label="foreignKey.displayField" v-model="selection" :rules="[VALIDATION_RULES.REQUIRED]" />
</template>
<script setup>
import {VALIDATION_RULES } from '@/constants/validation'
import {computed, onMounted, ref, watch} from 'vue'
        const props = defineProps({
            item: Object,
            name: String,

        })
    const loading = ref(false)
    const selection = ref(null)
    const items = ref([])
    const foreignKey = computed(() => props?.item?.foreignKey)
    const isForeignKey = computed(() => !!foreignKey?.value)

    watch(selection, (val) => {
        console.log('SELECTION: ', val)
    })

    onMounted(async () => {
        if (isForeignKey) {
            loading.value = true;
             const client = useSupabaseClient();
             const {data} = await client.from(foreignKey.value.tableName).select(`${foreignKey.value.field}, ${foreignKey.value.displayField}`)
             items.value = data ?? [];
             console.log('items: ', items.value);
loading.value = false;
        }
    })
    const getOptionValue = (option) => {
        console.log('OPTION: ', option.id);
        return option.id
    }
</script>