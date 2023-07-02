<template>
<div class="full-screen-div row no-wrap">
<div style="height:inherit">
    <CurlingRings/>
</div>
    <div class="column" >
        <!-- <div >
            <Editor :schema="schema"/>
        </div> -->
        <div class="col-grow">
    <TableSelect :modelValue="selection" @update:modelValue="updateValue" :loading="loading"/>
    <Table :columns="columns" :rows="tableData" v-if="tableData" :tableName="selection"/>
    </div>
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

import { ref, computed, watch } from 'vue'
    const selection = ref(null)
    const loading = ref(false)
    const tableData = ref([])
    const columns = ref([])
    const schema = ref([])

    const client = useSupabaseClient();

    const getSchema = async (tablename) => {
            try {
    const {data, error} = await client.rpc('get_table_info', {tablename})
        schema.value = data
    } catch(e) {
        console.log('GET TABLE INFO ERROR: ', e)
    }
    }

    const updateTable = async (table) => {
         loading.value = true;
        const data = await client.from(selection.value).select();
        const [firstItem] = data.data;
        columns.value = Object.keys(firstItem)
        tableData.value = data.data
        loading.value = false;
    }

    const updateValue = (table) => {   
    selection.value = table;
    }

    watch(selection, (val) => {
        updateTable(val);
        getSchema(val)

    })
    
</script>