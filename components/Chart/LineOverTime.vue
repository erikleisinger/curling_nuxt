<template>
    <div v-if="!loading" class="full-width">
        <slot :chart="myChart" />
    </div>
    <div :style="`height: ${height}; width: 100%`">
        <canvas ref="chart" id="canvas" />
    </div>
</template>
<style lang="scss" scoped></style>
<script setup>
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(annotationPlugin);

const props = defineProps({
    annotations: Object,
    height: {
        type: String,
        default: "100%",
    },
    data: Object,
    ticks: Object,
    tooltip: Object,
});

const chart = ref(null);
let myChart;

const loading = ref(true);

onMounted(async () => {
    console.log("MOUNTED: ", props.data);
    const annotations = { ...props.annotations };
    const data = { ...props.data };
    const tooltip = { ...props.tooltip };
    const ticks = {...props.ticks}
    myChart = new Chart(chart.value, {
        type: "line",
        data,

        options: {
            clip: false,
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
                    // drawTime: "beforeDraw",
                    annotations,
                },
                legend: {
                    display: false,
                    position: "top",
                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 16,
                    },
                },
                tooltip,
            },

            animation: {
                animateScale: true,
            },
            scales: {
                x: {
                    ticks
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

    Object.seal(myChart.value);
    loading.value = false;
});
</script>
