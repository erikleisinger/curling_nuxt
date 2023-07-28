<template>

    <q-knob
        show-value
        class="percent-wheel"
        :class="`text-${color}`"
        :model-value="val"
        :thickness="0.2"
        :color="color"
        readonly
        instant-feedback
        track-color="red"
    >
        <div class="column items-center">
            <div style="font-size: 0.8rem; color: black; font-weight: bold">
                {{ label }}
            </div>
            <div>{{ val.toFixed() }}%</div>
        </div>
    </q-knob>

</template>
<style lang="scss">
.percent-wheel {
    .q-circular-progress__track {
        color: rgba(213, 213, 213, 0.3) !important;
    }
    .q-circular-progress__svg {
        color: v-bind(barColor) !important;
    }
}
</style>
<script setup>
const props = defineProps({
    color: {
        type: String,
        default() {
            return "primary";
        },
    },
    label: String,
    value: Number,
});
const val = ref(0);
const { upTick } = useAnimate();
const { getColor } = useColor();


const barColor = computed(() => {
    return getColor(props.color);
});

const percent = computed(() => props.value)
watch(percent, (v) => {
    if (!v) return;
    upTick(val, v, 7)
}, {immediate:true})
</script>
