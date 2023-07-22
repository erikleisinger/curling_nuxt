<template>
<GameController/>
</template>
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
};



</script>
