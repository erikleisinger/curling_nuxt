<template>
  <q-toolbar class="bg-primary text-white row justify-between">
    <q-btn round flat @click="goPrev(false)" :disabled="globalLoading"
      ><q-icon name="chevron_left"
    /></q-btn>
    <div @click="dialogNavigationOpen = true">End {{ end }} Shot {{ shot }} </div>
    <q-btn round flat @click="goNext(false)" :disabled="globalLoading"
      ><q-icon name="chevron_right"
    /></q-btn>
  </q-toolbar>
  <DialogConfirmation v-if="!!confirmUnsaved" confirmButtonText="Proceed" @close="confirmUnsaved = false" @confirm="confirmUnsaved">
    You have unsaved changes to this shot. By proceeding, you will lose all unsaved changes. Would you like to proceed anyway? 
  </DialogConfirmation>
  <DialogNavigation v-model="dialogNavigationOpen" @go="goToCustomShot" @cancel="dialogNavigationOpen = false"/>
</template>
<script setup lang="ts">
import {computed, inject} from "vue";
import {useSessionStore} from "@/store/session";
import type Shot from '@/types/Shot'
const store = useSessionStore();
const shot = computed<number>(() => store.shot);
const end = computed<number>(() => store.end);
const editedShot = inject<Ref>('editedShot')!


const {prevShot, nextShot, goToShot} = store;

const {globalLoading} = useLoading();

const {objTheSame} = useValidation();
const currentShot = computed(() => store.currentShot)
const unsavedChanges = computed(() => !objTheSame(editedShot.value, store.currentShot))

// Null if confirm dialog is not present
// When truthy, this ref is a function that will be executed on dialog @confirm event
// Either 'goNext' or 'goPrev'
const confirmUnsaved = ref<null | Function>(null)

const goNext = async (force = false) => {
  if (unsavedChanges.value && !force) {
    confirmUnsaved.value = () => goNext(true)
    return;
  }
  confirmUnsaved.value = null;
  nextShot();
};
const goPrev = async (force = false) => {
   if (unsavedChanges.value && !force) {
    confirmUnsaved.value = () => goPrev(true)
    return;
  }
    confirmUnsaved.value = null;
  prevShot();
};

// Manually go to shot/end
const dialogNavigationOpen = ref(false)

const goToCustomShot = (data: {shot: number, end:number}, force = false) => {
  dialogNavigationOpen.value = false;
  if (unsavedChanges.value && !force) {
    confirmUnsaved.value = () => goToCustomShot(data, true)
    return;
  }
  const {shot: shotNo, end: endNo} = data;
  goToShot(shotNo, endNo)

}
</script>
