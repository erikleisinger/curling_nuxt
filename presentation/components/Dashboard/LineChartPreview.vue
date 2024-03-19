<template>
    <div
        v-if="chartPointsPreview && chartPointsPreview.length"
        :style="`width: ${tileWidth}px; height: 80px`"
        :class="`tile-chart-${type}`"
        :data-flip-id="`tile-chart-${type}`"
    >
        <DashboardLineChart
            :data="chartPointsPreview"
            :maintain="false"
            :color="getColor(color)"
        />
    </div>
</template>
<script setup>
import { STAT_COLORS, STAT_TYPES } from "@/presentation/constants/stats";
const props = defineProps({
    stats: Object,
    type: String,   
});

const chartPointsPreview = computed(() => {
    const data = props.stats[props.type].chartPoints();
    const points = data.points.slice(
        data.points.length < 5 ? 0 : data.points.length - 5
    );

    if (points.length === 0) {
        points.push(0);
        points.push(100);
    }
    if (points.length === 1) {
        points.push(points[0]);
    }
    return [
        {
            points,
            color: data.color,
        },
    ];
});

const { width } = useElementSize(document.getElementById("dashboard"));

const $q = useQuasar();

const tileWidth = computed(
    () => ($q.screen.xs ? width.value / 2 : width.value / 3) - 30
);

const { getColor } = useColor();
const color = STAT_COLORS[props.type];
</script>
