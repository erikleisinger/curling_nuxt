<template>
    <div class="chart__container">
        <div class="chart__inner">
            <canvas ref="chart1" />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.chart__container {
    // height: v-bind(formattedHeight);
    // width: v-bind(formattedHeight);
    width: 100%;
    .chart__inner {
        width: inherit;
        padding: var(--space-sm);
        margin: -10px;
        canvas {
            width: 100%;
            height: 400px;
            box-sizing: border-box;
        }
    }
}
</style>
<script setup>
import { useElementSize } from "@vueuse/core";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(annotationPlugin);

const props = defineProps({
    annotations: Object,
    data: Object,
    for: Number,
    forces: Number,
    steals: Number,
    teamId: Number,
    totalEnds: Number,
    height: {
        type: Number,
        default: 60,
    },
    tooltip: Object,
});

const formattedHeight = computed(() => `${props.height}px`);

const index = ref(0);

const TITLES = ["Games played", "Title 2"];

const DESCRIPTIONS = ["", "It changed!"];

const descriptionText = computed(() => {
    return `<span class="text-bold">${props.for} / ${props.totalEnds}</span> ends`;
});
const components = ref([null, null]);
const chart1 = ref(null);

onMounted(async () => {
    new Chart(chart1.value, {
        type: "line",
        data: props.data,

        options: {
            elements: {
                line: {
                    tension: 0,
                    borderWidth: 5,
                },
                point: {
                    pointRadius: 7,
                },
            },

            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                annotation: {
                     drawTime: 'beforeDraw',
                    annotations: props.annotations
                },
                legend: {
                    display: true,
                    position: "top",
                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                    },
                },
                tooltip: props.tooltip,
            },

            animation: {
                animateScale: true,
            },
            scales: {
                x: {
                    display: false,
                },
                y: {
                    grid: {
                        display: false,
                    },
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: (e) => {
                            return `${e}%`;
                        },
                    },
                },
            },
        },
    });
});
</script>
