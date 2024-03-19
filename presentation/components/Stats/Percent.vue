<template>
    <div class="line-container">
        <Percentage
            :color="color"
            :percent="percent"
            :height="height"
            :reverse="reverse"
            :oneWay="oneWay"
        >
            <template v-slot:prepend v-if="prependPercent">
                <div class="percent__container reverse">
                    {{ percent.toFixed() }}%
                </div>
            </template>
            <template v-slot:append v-else>
                <div class="percent__container">{{ percent.toFixed() }}%</div>
            </template>
        </Percentage>
    </div>
</template>

<style lang="scss">
.line-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    .percent__container {
        display: flex;
        justify-content: center;
        // font-weight: bold;
        margin-left: var(--space-xs);

        @include smmd-text;
        font-family: $font-family-header;
        &.reverse {
            margin-left: unset;
            margin-right: var(--space-xs);
        }
    }
}
</style>

<script setup>
const props = defineProps({
    color: {
        type: String,
        default: "blue",
    },
    height: {
        type: String,
        default: "16px",
    },
    oneWay: Boolean,
    stat: String,
    stats: [Object, Array],
    prependPercent: Boolean,
    reverse: Boolean,
});

const percent = computed(() => {
    try {
        const p = props.stats[props.stat]?.percent;
        if (typeof p === 'string') throw new Error();
        return p
    } catch {
        return 0;
    }
});

// const rendered = computed(() => !!percent.value || percent.value === 0)

const { getColor } = useColor();

const $q = useQuasar();
</script>
<script>
export default {
    name: "StatsPercent",
};
</script>
