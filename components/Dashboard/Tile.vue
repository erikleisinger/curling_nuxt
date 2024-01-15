<template>
    <div class="tile" :class="{ highlight: betterThanAverage, expanded }">
        <header
            class="row items-center no-wrap justify-between q-mb-md"
            v-if="!expanded"
        >
            <h3 class="position-relative row no-wrap">
                <q-icon
                    v-if="betterThanAverage"
                    size="0.9em"
                    class="q-mr-xs"
                    name="stars"
                    :style="{ color: getColor('yellow') }"
                />
                {{ name }}
            </h3>
            <h2 :class="{green: betterThanAverage}" style="white-space: nowrap">
                {{ percent.toFixed(isPercent ? 0 : 1) }}
                <span class="text-caption" style="margin-left: -1.3em" v-if="isPercent">%</span>
            </h2>
        </header>
        <header v-else class="full-width header-expanded">
            <div class="close-container__floating">
                <q-btn icon="close" flat round @click="emit('close')"/>
            </div>
            <div class="column items-center justify-center q-py-md">
                <h3 class="position-relative">
                    <q-icon
                        v-if="betterThanAverage"
                        size="0.9em"
                        class="q-mr-xs"
                        name="stars"
                        :style="{ color: getColor('yellow') }"
                    />
                    {{ name }}
                </h3>
                <h4>{{STAT_DESCRIPTIONS[type]}}</h4>
                <q-knob
                    show-value
                    :model-value="isPercent ? percent : 100"
                    size="150px"
                    :thickness="0.15"
                    :angle="70"
                    style="margin: unset"
                    class="percent q-mt-md"
                    readonly
                    track-color="grey-9"
                    :style="{ color: getColor(STAT_COLORS[type] ?? 'blue') }"
                >
                    <div class="knob--text">
                        <h2 >
                            {{ percent.toFixed(isPercent ? 0 : 1) }}
                        </h2>
                    </div>
                </q-knob>
               
            </div>
            <div>
                <slot name="stat-expanded" />
            </div>
        </header>

        <slot name="stat" v-if="!expanded" />

         <div class="row justify-center full-width">
                    <h5 v-if="betterThanAverage && expanded">
                        <div
                            class="better--floating"
                            style="right: unset; left: -1.2em"
                        >
                            <q-icon
                                name="stars"
                                :style="{ color: getColor('yellow') }"
                            />
                        </div>
                        Better than the worldwide average
                    </h5>
                </div>

        <slot />
    </div>
</template>
<style lang="scss" scoped>
$min-height: min(175px, calc(50% - 12px));
.header-expanded {
    display: grid;
    grid-template-rows: auto auto;
 
    row-gap: var(--space-sm);
    @include sm {
        grid-template-rows: unset;
        grid-template-columns: repeat(2, 1fr);
    }
}
.tile {
    padding: var(--space-sm);
    background-color: rgba(240, 238, 238, 0.1);

    .knob--text {
        color: rgb(250, 250, 250);
    }
    // color: $app-royal-blue;
    &:hover:not(.expanded) {
        background-color: rgba(225, 225, 225, 0.5);
    }
    &.expanded {
        padding-top: var(--space-sm);
    }

    cursor: pointer;
    min-height: $min-height;
    border-radius: 4px;
    padding-bottom: var(--space-md);

    min-width: $min-height;
    position: relative;

    h3 {
        margin-bottom: var(--space-xs);

        // position: absolute;
        top: 0;
        // @include reg-text;
        font-size: 1.1rem;
        line-height: 0.8;
        // padding: 0px var(--space-sm);
        padding-right: var(--space-sm);
        // color: rgba(255, 255, 255, 0.782);

        z-index: 1;
        position: relative;
    }
    &.expanded {
        h3 {
            @include smmd-text;
            margin-bottom: unset;
            padding-right: unset;
        }
        h4 {
            margin-top: var(--space-xxxs);
            margin-bottom: calc(var(--space-xl) - 8px)
        }
        h5 {
            font-family: $font-family-secondary;
            @include text-caption;
            margin-top: var(--space-lg);
            position: relative;
        }
    }
    .close-container__floating {
        position: absolute;
        top: var(--space-sm);
        right: 0;
    }
    :deep(.q-circular-progress__track) {
        color: rgba(211, 211, 211, 0.7) !important;
    }
    h2 {
        @include xl-text;
       
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
        left: -0.5em;
        top: -0.1em;
        // color: $app-royal-blue;
    }
}
</style>
<script setup>
import {
    NON_PERCENT_STATS,
    STAT_DESCRIPTIONS,
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

const emit = defineEmits(['close'])

const { getColor } = useColor();

const isPercent = !NON_PERCENT_STATS.includes(props.type);

const name = STAT_NAMES[props.type];

const color = computed(() => (props.betterThanAverage ? "mint" : "yellow"));
</script>
