<template>
    <GameController v-if="initialized" />
    <GlobalLoading infinite v-else :error="error" :errorMessage="errorMessage" />
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, watch} from "vue";
import {useRouteQuery} from '@vueuse/router';
import { useSessionStore } from "@/store/session";
import { useAuthStore } from "@/store/auth";
import type Shot from "@/types/shot";
const tab = ref("rings");

provide("tab", tab);

const $q = useQuasar();

/* Edited Shot */

//  Edited shot provided to all children
//  GameNavigation, InputScore, RockController

const defaultShot = {
    id: null,
    end_id: null,
    player_id: null,
    shot_no: null,
    turn: null,
    line: null,
    score: null,
    type_id: null,
    notes: null,
    rock_positions: {},
};

const editedShot = ref(defaultShot);

provide("editedShot", editedShot);

const store = useSessionStore();
const shot = computed(() => store.currentShot);

/* End edited shot */

const gameId = useRouteQuery('id')

const initialized = ref(false);
const error = ref(false);
const errorMessage = ref(null)
onBeforeMount(async () => {
    initialized.value = false;
    const id = gameId.value || store.lastPlayedGame
    if (!id) {
        navigateTo("/select");
    } else {
        try {
    await store.initGame(id);
        nextTick(() => {
            initialized.value = true;
        });
        } catch(e: any) {
            error.value = true;
            if (e?.message) errorMessage.value = e.message;
            console.error(e)
        }
    
    }
});

onBeforeUnmount(() => {
    store.endSession();
})

const currentThrower = computed(() => store.getCurrentThrower);
const assignShot = (val: Shot | null) => {
    if (!val || !store.game?.id) return;
    Object.assign(editedShot.value, val);
    if (!editedShot.value.player_id && currentThrower.value?.id) editedShot.value.player_id = currentThrower.value?.id;
};

// TODO: MAKE SURE EDITED SHOT IS INIT ON INITIAL
watch(
    shot,
    (val) => {
        assignShot(val);
    },
    { deep: true }
);
</script>
