<template>
<NuxtLayout name="main">
  <template v-slot:header>
       <q-toolbar class="bg-primary text-white q-px-none" v-if="$q.screen.lt.md" role="navigation">
      <q-tabs v-model="tab" inline-label
        outside-arrows
        mobile-arrows
        class="col-grow">
        <q-tab label="Rings" name="rings" aria-controls="rings" tabindex="0" />
        <q-tab label="Score" name="score" aria-controls="score" tabindex="0" />
      </q-tabs>
     
    </q-toolbar>
    <q-toolbar class="bg-primary text-white" v-else>
      <q-space />
      <q-btn flat round dense @click="logout">
        <q-icon name="logout"></q-icon>
      </q-btn>
    </q-toolbar>
    
  </template>
    <GameController/>
    <q-inner-loading :showing="globalLoading"/>
    <template v-slot:footer>
      <GameNavigation/>

    </template>
</NuxtLayout>
</template>
<style lang="scss">
body,
html {
  height: 100%;
  width: 100%;
  margin: 0;
}
#__nuxt {
  height: inherit;
}
</style>
<script setup lang="ts">
import {computed, onMounted, provide, ref, watch, InjectionKey} from "vue";
import {useSessionStore} from '@/store/session'
import {useAuthStore} from '@/store/auth'
import type Shot from '@/types/shot'
const tab = ref("rings");

provide('tab', tab)

const $q = useQuasar();

// Global loading
const {globalLoading} = useLoading()

/* Edited Shot */

//  Edited shot provided to all children
//  GameNavigation, InputScore, RockController
const editedShotKey: InjectionKey<Ref<Shot>> = Symbol('editedShot')
const editedShot = ref({
   end_id: null,
    player_id: null,
    shot_no: null,
    turn: null,
    line: null,
    score: null,
    type_id: null,
    notes: null,
    rock_positions: {}
});

provide('editedShot', editedShot);

const store = useSessionStore();
const shot = computed(() => store.currentShot)
watch(shot, (val) => {
  if (!val) return;
  Object.assign(editedShot.value, val)
}, {deep: true, immediate: true})

/* End edited shot */

// Logout
const authStore = useAuthStore();
const logout = async () => {
  const client = useSupabaseAuthClient();
  await client.auth.signOut();
  authStore.setLoggedIn(false)
  return navigateTo("/login");
};



</script>
