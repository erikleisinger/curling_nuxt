<template>
        <canvas ref="chart" id="canvas" height="400" width="400" />
</template>
<style lang="scss" scoped>
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
    tooltip: Object,
});

const chart = ref(null);

onMounted(async () => {
    var ctx = document.getElementById("canvas").getContext("2d");
ctx.canvas.width = 400;
ctx.canvas.height = 400;
    const myChart = new Chart(chart.value, {
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
                    drawTime: "beforeDraw",
                    annotations: props.annotations,
                },
                legend: {
                    display: true,
                    position: "top",
                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 16
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

    Object.seal(myChart)
});
</script>
