<template>
    <q-toolbar class="bg-primary text-white row justify-between">
        <q-btn round flat  @click="goPrev" :disabled="loading"><q-icon name="chevron_left"/></q-btn>
        <div>End {{end}} Shot {{shot}}</div>
           <q-btn round flat @click="goNext" :disabled="loading"><q-icon name="chevron_right"/></q-btn>
      </q-toolbar>
</template>
<script setup>
import {computed, inject} from 'vue'
    import { useGameStore } from '@/store/game';
    const store = useGameStore();
    const shot = computed(() => store.shot);
    const end = computed(() => store.end);

    const editedShot = inject('editedShot');

    const {prevShot, nextShot, saveShot} = store;

    const loading = computed(() => store.loading)

    const goNext = async () => {
        await saveShot(editedShot.value)
        nextShot(editedShot.value)
    }
    const goPrev = async () => {
        await saveShot(editedShot.value);
        prevShot(editedShot.value);
    }
</script>