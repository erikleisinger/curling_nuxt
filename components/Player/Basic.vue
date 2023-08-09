<template>
    <div class="player__container--basic" ref="container">
   
            <PlayerAvatar
                :parsedAvatar="parseAvatar(player.avatar)"
                :player="player"
            />

        <div
            class="truncate-text col-auto q-pl-xs q-ml-xs column justify-center text-md"
        >
            <q-item-label class="truncate-text">
                <span v-if="player?.id">
                    {{ player.name }}
                </span>
            </q-item-label>
            <q-item-label caption v-if="slots.subtitle">
                <slot name="subtitle"/>
            </q-item-label>
        </div>
<div class="row justify-end items-center" v-if="slots.append">
    <slot name="append"/>
</div>
    </div>
</template>
<style lang="scss">
.player__container--basic {
    display: grid;
    grid-template-columns: v-bind(columns);
    padding: var(--space-sm);

    border-bottom: 1px solid $grey-3;
}
</style>
<script setup>
import { usePlayerStore } from "@/store/players";
import { parseAvatar } from "@/utils/avatar";

import {useElementSize} from '@vueuse/core'
const props = defineProps({
    player: Object,
});
const slots = useSlots();

const container = ref(null)
const {height} = useElementSize(container)



const columns = computed(() => slots.append ? `min(${height.value + (height.value * 0.2)}px, 30%) auto auto` : `min(${height.value}px, 30%) 70%`);
</script>
