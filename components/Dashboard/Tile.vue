<template>
    <div class="tile" ref="tile" >
        <header class="column items-center no-wrap" >
        <q-knob
            show-value
            :model-value="isPercent ? percent : 100"
            size="100px"
            :thickness="0.2"
            :angle="70"
            style="margin: unset"
            class="percent"
            readonly
            track-color="grey-9"
            :style="{ color: getColor(STAT_COLORS[type]) }"
        >

            <div class="knob--text text-white">
                <h2>{{ percent.toFixed(isPercent ? 0 : 1) }}{{isPercent ? '%' : ''}}</h2>
            </div>
        </q-knob>
        <h3 class="text-center">{{name}}</h3>
        </header>
        <slot/>
    </div>
</template>
<style lang="scss" scoped>
    .tile {
        padding: var(--space-sm);
        background-color: rgba(4, 2, 20, 0.2)!important;
        min-height: 175px;
        border-radius: 16px;
        

        // width: v-bind(tileWidth);
        min-width: 175px;
        h3 {
            margin-top: var(--space-md);
            line-height: 1;
        }
        :deep(.q-circular-progress__track) {
            color: rgba(4, 2, 20, 0.7)!important;
        }
    }
</style>
<script setup>
import {NON_PERCENT_STATS, STAT_NAMES, STAT_COLORS, STAT_TYPES} from '@/constants/stats'
import {useElementBounding} from '@vueuse/core'
const props = defineProps({
    percent: {
        type: Number,
        default: 0
    },
    type: String,
});

const { getColor } = useColor();

const isPercent = !NON_PERCENT_STATS.includes(props.type)

const name = STAT_NAMES[props.type]

const tile = ref(null);
const {height} = useElementBounding(tile);
const tileWidth = computed(() => `${height.value}px`)

</script>
