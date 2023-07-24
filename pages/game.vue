<template>
    <GameController v-if="initialized" />
    <GlobalLoading infinite v-else />
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, watch, InjectionKey } from "vue";
import { useSessionStore } from "@/store/session";
import { useAuthStore } from "@/store/auth";
import type Shot from "@/types/shot";
const tab = ref("rings");

provide("tab", tab);

const $q = useQuasar();

// Global loading
const { globalLoading } = useLoading();

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

const initialized = ref(false);
onBeforeMount(async () => {
    if (!store.game?.id) {
        navigateTo("/select");
    } else {
        await store.initGame();
        nextTick(() => {
            initialized.value = true;
        });
    }
});

const assignShot = (val: Shot | null) => {
    if (!val || !store.game?.id) return;
    Object.assign(editedShot.value, val);
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
