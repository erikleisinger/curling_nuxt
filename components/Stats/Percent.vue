<template>
    <div class="line-container">
        <Percentage
            :color="color"
            :percent="percent"
            height="16px"
            :reverse="reverse"
            v-if="rendered"
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
    padding: var(--space-md) 0px;
    width: 100%;
    .percent__container {
        width: v-bind(BADGE_DIMENSION);
        display: flex;
        justify-content: center;
        font-weight: bold;
        margin-left: var(--space-xs);
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
        default: 'blue'
    },
    stat: String,
    stats: [Object, Array],
    prependPercent: Boolean,
    reverse: Boolean,
});

const rendered = ref(true)

const {calcStat} = useStats();
const percent = computed(() => {
    return calcStat(props.stats, props.stat)
}) ;

watch(percent, () => {
    rendered.value = false;
    nextTick(() => {
        rendered.value = true;
    })
})

const $q = useQuasar();
</script>
