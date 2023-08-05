<template>
    <!-- <NuxtLayout> -->

    
        <q-inner-loading
            :showing="loading"
            label="Please wait..."
            color="primary"
        />
        <!-- :to="`/stats/player/${item.id}`" -->
        <q-item v-for="item in players" :key="item.id" class="items-center row" v-memo="[item.avatar, item.name]">
            <q-item-section avatar>
                <PlayerAvatar
                    :parsedAvatar="parseAvatar(item.avatar)"
                    :player="item"
                    :showStats="false"
                />
            </q-item-section>
            <q-item-section>
                <q-item-label
                    class="row items-center"
                    style="line-height: 1em !important"
                    >{{ item.name }}</q-item-label
                >
            </q-item-section>
            <q-item-section side @click.stop.prevent>
                <div class="text-grey-8 row no-wrap">
                    <slot name="actions" v-bind:playerId="item.id" />
                </div>
            </q-item-section>
        </q-item>
</template>
<script setup lang="ts">
import { usePlayerStore } from "@/store/players";
import { useSwipe, useDraggable } from "@vueuse/core";
import { TABLE_NAMES } from "@/constants/tables";
import type Player from "@/types/player";
import Json from "@/types/json";
import { parseAvatar } from "@/utils/avatar";

const store = usePlayerStore();

const players = computed<Player[]>(() => store.players);
const loading = ref<boolean>(false);

const loadPlayers = async (force: boolean = false) => {
    loading.value = true;
    await store.fetchPlayers(force);
    loading.value = false;
};

const tableArea = ref(null);
const { direction } = useSwipe(tableArea, {
    threshold: 200,
    onSwipeEnd: (e) => {
        if (direction.value !== "down") return;
        loadPlayers(true);
    },
});
</script>
