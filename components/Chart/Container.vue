<template>
    <section name="hammer conversion" class="stats__section">
        <div class="row items-center no-wrap">
            <div class="column">
                <h2 class="text-md text-bold"><slot name="title" /></h2>
                <h3 class="text-sm"><slot name="subtitle" /></h3>
            </div>
            <div class="col-grow row justify-end full-height">
                <slot name="card" />
            </div>
        </div>
        <div ref="chartContainer" :id="`stats-scroller-${index}`">
            <slot />
        </div>

        <q-inner-loading color="deep-purple" :showing="loading" />
    </section>
</template>
<style lang="scss" scoped>
$section-margin: var(--space-xs);

.stats__section {
    scroll-snap-align: center;
    overflow: visible;
    display: grid;
    border-radius: 0px;
    box-shadow: $pretty-shadow;
    margin: $section-margin;
    position: relative;
    width: calc(100% - var(--space-md));
    @include sm {
        width: calc(50% - var(--space-md));
    }
}
.total__card--wrap {
    margin-bottom: var(--space-sm);
}
</style>
<script setup>
import PinchZoom from "pinch-zoom-js";
import { useSwipe, useRefHistory } from "@vueuse/core";
const props = defineProps({
    loading: Boolean,
    index: Number,
    zoomable: Boolean,
});
const pz = ref(null);
onMounted(() => {
    if (!props.zoomable) return;
    pz.value = new PinchZoom(
        document.querySelector(`#stats-scroller-${props.index}`),
        {
            maxZoom: 3,
            draggableUnzoomed: false,
        }
    );
});

onBeforeUnmount(() => {
    // pz.value.destroy
});

const emit = defineEmits(["swipe"]);
const chartContainer = ref(null);
const { direction } = useSwipe(chartContainer, {
    onSwipe: () => {
        if (direction.value === "left" || direction.value === "right") {
            emit("swipe", direction.value);
        }
    },
});

const indexes = computed(() => props.index);

const enterClass = ref("slideInLeft");
const leaveClass = ref("slideOutLeft");

const { history } = useRefHistory(indexes);

watch(
    history,
    () => {
        if (history.value[0].snapshot > history.value[1].snapshot) {
            enterClass.value = "slideInRight";
            leaveClass.value = "slideInRight";
        } else {
            enterClass.value = "slideInLeft";
            leaveClass.value = "slideInLeft";
        }
    },
    { deep: true }
);
</script>
