<template>
<div class="window-height window-width column">
    <q-toolbar class="bg-purple text-white">
        <q-space/>
         <q-btn flat round dense @click="logout"> 
        <q-icon name="logout"></q-icon>
      </q-btn>
    </q-toolbar>
    <q-toolbar class="bg-purple text-white" v-if="$q.screen.lt.md">
        <q-tabs>
            <q-tab label="Rings"/>
             <q-tab label="Score"/>
        </q-tabs>
    </q-toolbar>
<div class="row  col-grow items-center" style="max-width:100vw">
<div class="col-lg-6 col-12 row justify-center curling-rings__wrap" >
    <CurlingRings />
</div>
<!-- <div class="col-md-6 col-12 row justify-center" >
    OTHER COLUMN
</div> -->
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
.curling-rings__wrap {
    height: 100%!important;
}

@media all and (min-width: 1000px) {
.curling-rings__wrap {
    max-height: calc(100vh - 50px);
}
}
@media all and (max-width: 1000px) {
.curling-rings__wrap {
    max-height: calc(100vh - 100px);
}
}
</style>
<script setup>

import { ref, computed, watch } from 'vue'

definePageMeta({
    middleware: 'game'
})

    const $q = useQuasar()

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