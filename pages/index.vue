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
<script setup>
import {computed, onMounted, provide, ref, watch} from "vue";
import {useGameStore} from '@/store/game'
import {useAuthStore} from '@/store/auth'
definePageMeta({
  middleware: "game",
});

const tab = ref("rings");

provide('tab', tab)

const $q = useQuasar();

// Global loading
const {globalLoading} = useLoading()

/* Edited Shot */

//  Edited shot provided to all children
//  GameNavigation, InputScore, RockController

const editedShot = ref({});
provide('editedShot', editedShot);

const store = useGameStore();
const shot = computed(() => store.currentShot)
const {shotEdited} = useModel();
watch(shot, (val) => {
  editedShot.value = shotEdited({...val})
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
