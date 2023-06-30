<template>
<div style="display:flex" class="full-screen-div">
<div style=" height:inherit">
    <CurlingRings/>
</div>
    <div style="flex-grow: 1">
    <TableSelect :modelValue="selection" @update:modelValue="updateValue" :loading="loading.value"/>
    <Table :columns="columns" :rows="tableData" v-if="tableData" :tableName="selection"/>
    </div>
    </div>
</template>
<style lang="scss">
    body, html {
  height: 100%;
  width: 100%;
  margin: 0;
}
#__nuxt {
    height: inherit;
}
.full-screen-div {
    width: 100vw;
    height: 100%;
    min-height: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: hidden;
}
</style>
<script setup>
import { ref } from 'vue'
    const selection = ref(null)
    const loading = ref(false)
    const tableData = ref([])
    const columns = ref([])

    const client = useSupabaseClient();
    const updateValue = async (table) => {   
        selection.value = table;
        loading.value = true;
        const data = await client.from(selection.value).select();
        const [firstItem] = data.data;
        columns.value = Object.keys(firstItem)
        tableData.value = data.data
        loading.value = false;
    }
    
</script>