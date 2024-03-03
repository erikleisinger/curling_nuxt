<template>
    <div class="tile" :class="{  expanded }" :style="{ width: expanded ? '100%' : '' }">
        <header
            class="row items-center no-wrap justify-between q-mb-md"
            v-if="!expanded"
        >
            <h3
                class="position-relative row no-wrap"
                :data-flip-id="headerFlipId"
                :class="headerFlipId"
            >
                {{name}}
            </h3>
            <h2
                :class="{
                    [valueFlipId]: true,
                }"
                style="white-space: nowrap"
                :data-flip-id="valueFlipId"
            >
                  <slot name="value"/>
               
            </h2>
        </header>
        <header v-else class="full-width header-expanded">
            <div class="close-container__floating">
                <q-btn icon="close" flat round @click="emit('close')" />
            </div>
            <div
                :class="
                    $q.screen.xs
                        ? ' column items-center q-py-md justify-center'
                        : 'row no-wrap items-center justify-center'
                "
            >
                <div class="column justify-center" :class="{'q-mr-lg': !$q.screen.xs}">
                    <h3
                        class="position-relative text-center"
                        :data-flip-id="headerFlipId"
                        :class="headerFlipId"
                    >
                    
                        {{ name }}
                    </h3>
                    <h4 class="text-center">
                        <slot name="description"/>
                    </h4>
                </div>
                <q-knob
                    show-value
                    :model-value="percent"
                    size="150px"
                    :thickness="0.15"
                    :angle="70"
                    style="margin: unset"
                    class="percent q-mt-md"
                    readonly
                    track-color="grey-9"
                    :style="{ color }"
                >
                    <div class="knob--text">
                        <h2
                            style="white-space: nowrap; position: relative; margin-right: -6px;"
                            :data-flip-id="valueFlipId"
                            :class="valueFlipId"
                        >
                        <slot name="value"/>
                        </h2>
                    </div>
                </q-knob>
            </div>
            <div>
                <slot name="stat-expanded" />
            </div>
        </header>
        <slot name="stat" v-if="!expanded" />
        <slot />
    </div>
</template>
<style lang="scss" scoped>
$min-height: min(175px, calc(50% - 12px));
.header-expanded {
    display: grid;
    grid-template-rows: auto auto;

    row-gap: var(--space-sm);
}
.tile {
    padding: var(--space-sm);
    &:not(.expanded) {
        padding-top: var(--space-md);
    }
    background-color: rgba(240, 238, 238, 0.1);

    .knob--text {
        color: rgb(250, 250, 250);
    }
    @include md {
        &:hover:not(.expanded) {
            background-color: rgba(225, 225, 225, 0.5);
        }
    }

   

    cursor: pointer;
    min-height: $min-height;
    border-radius: 4px;
    padding-bottom: var(--space-md);

    min-width: $min-height;
    position: relative;

    h3 {
        margin-bottom: var(--space-xs);
        top: 0;
        font-size: 1.4rem;
        line-height: 0.8;
        padding-right: var(--space-sm);

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
            margin-bottom: calc(var(--space-xl) - 8px);
            @include sm {
                margin-top: unset;
                margin-bottom: unset;
            }
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
        @include sm {
            right: var(--space-sm);
        }
    }
    :deep(.q-circular-progress__track) {
        color: rgba(211, 211, 211, 0.7) !important;
    }
    h2 {
        @include xl-text;
        line-height: 0.8em;
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
}
</style>
<script setup>
const props = defineProps({
    color: String,
    expanded: Boolean,
    name: String,
    percent: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(["close"]);

const $q = useQuasar();


/**
 * Unique selectors for each tile
 */

const {generateUniqueId} = useUniqueId();
const headerFlipId = generateUniqueId('tile-header');
const valueFlipId = generateUniqueId('tile-value')
</script>
