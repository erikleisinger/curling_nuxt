<template>
    <q-toolbar class="bg-primary text-white row justify-between">
        <q-btn round flat  @click="prevShot"><q-icon name="chevron_left"/></q-btn>
        <div>End {{end}} Shot {{shot}}</div>
           <q-btn round flat @click="nextShot"><q-icon name="chevron_right"/></q-btn>
      </q-toolbar>
</template>
<script setup>
import {computed} from 'vue'
    import { useGameStore } from '@/store/game';
    const store = useGameStore();
    const shot = computed(() => store.shot);
    const end = computed(() => store.end)
    const {prevShot, nextShot} = store;
</script>