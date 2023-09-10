<template>
    <div ref="el" class="el" :id="`scroller-section-${endno}`">
        <slot />
    </div>
</template>
<style lang="scss">
.el {
    opacity: v-bind(opacity);
    // transform: v-bind(scale);
}
</style>
<script setup>
import {
    useElementBounding,
} from "@vueuse/core";

const props = defineProps({
    endno: Number
})

const emit = defineEmits(["visible"]);
const el = ref(null);
const { left, right, x, y, width } = useElementBounding(el);
const { width: windowWidth } = useWindowSize();

const midpoint = computed(() => windowWidth.value / 2 - width.value / 2);
const beginning = computed(() => 0 - width.value);
const end = computed(() => windowWidth.value);
const opacity = computed(() => 1 - normalizedDistanceFromCenter.value);
const scale = computed(
    () => `scale(${1 - getNormalizedDistanceFromCenter(25)})`
);

// Center is 0, distance either to left or right side is calculated in normalized
// units of 0.1 precision.

// NOTE to reverse this just call 1 - point.value
const normalizedDistanceFromCenter = computed(() => {
    const step = Number.parseInt(
        (Math.abs(midpoint.value - end.value) / 10).toFixed(1)
    );
    const currentPos = Math.abs(midpoint.value - x.value);
    const normalizedUnits = currentPos / step / 10;

    return normalizedUnits;
});

/**
 * @param unitSize the size of normalized step from center (higher means changes less fast)
 */
const getNormalizedDistanceFromCenter = (unitSize) => {
    const step = Number.parseInt(
        (Math.abs(midpoint.value - end.value) / 10).toFixed(1)
    );
    const currentPos = Math.abs(midpoint.value - x.value);
    const normalizedUnits = currentPos / step / unitSize;

    return normalizedUnits;
};

const emitVisible = () => {
    emit('visible')
}

watch(normalizedDistanceFromCenter, (val) => {
    if (val > 0.3) return;
    emitVisible();
})




</script>
