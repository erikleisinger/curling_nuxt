<template>
<div class="full-screen-div ">
    <q-toolbar class="bg-purple text-white">
        <q-space/>
         <q-btn flat round dense @click="logout"> 
        <q-icon name="logout"></q-icon>
      </q-btn>
    </q-toolbar>
<div class="row no-wrap">
<div style="height:inherit">
    <CurlingRings/>
</div>
    <div class="column" >
        <!-- <div >
            <Editor :schema="schema"/>
        </div> -->
        <div class="col-grow">
    <TableSelect :modelValue="selection" @update:modelValue="updateValue" :loading="loading"/>
    <Table v-if="selection" :tableName="selection" :setLoading="setLoading" :loading="loading"/>
    </div>
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

    const setLoading = (bool) => {
        loading.value = bool;
    }

    const updateValue = (table) => {   
    selection.value = table;
    }

    const logout = async () => {
        const client = useSupabaseAuthClient();
        await client.auth.signOut();
        return navigateTo('/login')
    }

    
</script>