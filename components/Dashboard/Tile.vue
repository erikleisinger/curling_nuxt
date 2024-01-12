<template>
    <div class="tile" :class="{ highlight: betterThanAverage, expanded }">
        <header class="column items-center no-wrap">
            <h3 class="position-relative">
                {{ name }}
                <div class="better--floating" v-if="betterThanAverage">
                    <q-icon
                        name="stars"
                        :style="{ color: getColor(color) }"
                    />
                </div>
            </h3>

            <q-knob
                show-value
                :model-value="isPercent ? percent : 100"
                size="100px"
                :thickness="0.15"
                :angle="70"
                style="margin: unset"
                class="percent"
                readonly
                track-color="grey-9"
                :style="{ color: getColor(color) }"
            >
                <div class="knob--text">
                    <h2>
                        {{ percent.toFixed(isPercent ? 0 : 1) }}
                    </h2>
                </div>
            </q-knob>
            <h4 v-if="betterThanAverage && expanded">
                <div
                    class="better--floating"
                    style="right: unset; left: -1.2em"
                   
                >
                    <q-icon
                        name="stars"
                        :style="{ color: getColor(color) }"
                    />
                </div>
                Better than the worldwide average
            </h4>
        </header>
        <slot />
    </div>
</template>
<style lang="scss" scoped>
$min-height: min(175px, calc(50% - 12px));
.tile {
    padding: var(--space-sm);
      background-color: rgba(240, 238, 238, 0.5);
    .knob--text {
        color: $app-royal-blue;
    }
    color: $app-royal-blue;
    &:hover:not(.expanded) {

      
        background-color: rgba(225, 225, 225, 0.5);
    }
    &.expanded {
        padding-top: var(--space-lg);
    }

    cursor: pointer;
    // min-height: $min-height;
    border-radius: 4px;
    padding-bottom: var(--space-md);

    // min-width: $min-height;
    position: relative;

    &.highlight {
    }
    h3 {
        margin-bottom: var(--space-xs);

        // position: absolute;
        top: 0;
        @include reg-text;
        line-height: 0.8;
        padding: 0px var(--space-sm);
        // color: rgba(255, 255, 255, 0.782);

        z-index: 1;
        position: relative;
    }
    :deep(.q-circular-progress__track) {
        color: rgba(211, 211, 211, 0.7) !important;
    }
    h2 {
        @include lg-text;
    }
    .percent {
        z-index: 1;
    }

    h4 {
        font-family: $font-family-secondary;
        @include text-caption;
        line-height: 1;
        // color: rgba(255,255,255,0.8);
        margin-top: var(--space-lg);
        position: relative;
        font-style: italic;
    }
    .better--floating {
        position: absolute;
        right: -0.5em;
        top: -0.1em;
        // color: $app-royal-blue;
    }
}
</style>
<script setup>
import {
    NON_PERCENT_STATS,
    STAT_NAMES,
    STAT_COLORS,
    STAT_TYPES,
} from "@/constants/stats";
import { useElementBounding } from "@vueuse/core";
import TeamStatsTotal from "@/store/models/team-stats-total";
import { START_LOCATION } from "vue-router";
const props = defineProps({
    betterThanAverage: Boolean,
    expanded: Boolean,
    percent: {
        type: Number,
        default: 0,
    },
    total: Number,
    type: String,
});

const { getColor } = useColor();

const isPercent = !NON_PERCENT_STATS.includes(props.type);

const name = STAT_NAMES[props.type];

const tile = ref(null);
const { height } = useElementBounding(tile);
const tileWidth = computed(() => `${height.value}px`);

const color = computed(() => (props.betterThanAverage ? "mint" : "yellow"));
</script>
