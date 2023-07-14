<template>
  <q-toolbar class="bg-primary text-white row justify-between">
    <q-btn round flat @click="goPrev" :disabled="globalLoading"
      ><q-icon name="chevron_left"
    /></q-btn>
    <div>End {{ end }} Shot {{ shot }} 
      </div>
    <q-btn round flat @click="goNext" :disabled="globalLoading"
      ><q-icon name="chevron_right"
    /></q-btn>
  </q-toolbar>
</template>
<script setup>
import {computed, inject} from "vue";
import {useGameStore} from "@/store/game";
const store = useGameStore();
const shot = computed(() => store.shot);
const end = computed(() => store.end);

const editedShot = inject("editedShot");

const {prevShot, nextShot} = store;

const {globalLoading} = useLoading();

const goNext = async () => {
  nextShot(editedShot.value);
};
const goPrev = async () => {
  prevShot(editedShot.value);
};
</script>
