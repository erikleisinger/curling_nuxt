<template>
     <q-layout class="column">
      <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar class="bg-primary text-white q-px-none" v-if="$q.screen.lt.md">
      <q-tabs v-model="tab" inline-label
        outside-arrows
        mobile-arrows
        class="col-grow">
        <q-tab label="Rings" name="rings" />
        <q-tab label="Score" name="score" />
      </q-tabs>
    </q-toolbar>
   
     <q-toolbar class="bg-primary text-white" v-else>
      <q-space />
      <q-btn flat round dense @click="logout">
        <q-icon name="logout"></q-icon>
      </q-btn>
    </q-toolbar>
   
      </q-header>
    <q-page-container class="col-grow wrapper" role="main">
        <slot :tab="tab"/>
    </q-page-container>
    <q-footer elevated  v-if="$q.screen.lt.md">
        <slot name="footer"/>
    </q-footer>
    </q-layout>
</template>
<script setup>
import {ref, provide} from "vue";

const $q = useQuasar();
const tab = ref("rings");

provide('tab', tab)

const logout = async () => {
  const client = useSupabaseAuthClient();
  await client.auth.signOut();
  return navigateTo("/login");
};
</script>
