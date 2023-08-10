<template>
    <canvas ref="chart" />
</template>
<script setup>
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import PinchZoom from "pinch-zoom-js";
import { watchDebounced } from "@vueuse/core";

const props = defineProps({
    visible: Boolean,
    index: Number,
});

const chart = ref(null);
const isVisible = computed(() => props.visible);
const rendered = ref(false);
const myChart = ref(null);
watchDebounced(
    isVisible,
    (val) => {
        if (!val && !rendered.value) return;
        if (!val && rendered.value) {
            // myChart?.value?.hide();
            return;
        } else if (rendered.value) {
            // myChart?.value?.show();
            return;
        }

        rendered.value = true;
        //     setTimeout(() => {
        //    new PinchZoom(document.querySelector(`.zoomable-chart`), {
        //         maxZoom: 6,
        //         draggableUnzoomed: false,
        //     });
        //     }, 1000)

        myChart.value = new Chart(chart.value, {
            type: "line",
            label: "Title",
            data: {
                labels: [
                    "September",
                    "October",
                    "November",
                    "December",
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                ],
                datasets: [
                    {
                        label: "With LR",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointRadius: 5,
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        // borderColor: 'rgba(99, 149, 255, 0.9)',
                        // spacing: 100,
                        // backgroundColor: (val) => {
                        //     // console.log('bg color: ', val)
                        //     return 'rgba(99, 149, 255, 0.5)'
                        // },
                        data: [2, 1, 2, 0, 1, 2.2, 2.4],
                        // parsing: {
                        //     xAxisKey: props.percent ? "percent" : "rawValue",
                        // },
                    },
                    {
                        label: "Without LR",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointRadius: 5,
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        // borderColor: 'rgba(99, 149, 255, 0.9)',
                        // spacing: 100,
                        // backgroundColor: (val) => {
                        //     // console.log('bg color: ', val)
                        //     return 'rgba(99, 149, 255, 0.5)'
                        // },
                        data: [1.1, 2, 3.1, 1.2, 0.6, 1, 2, 1, 2],
                        // parsing: {
                        //     xAxisKey: props.percent ? "percent" : "rawValue",
                        // },
                    },
                ],
            },
            // plugins: [ChartDataLabels],
            options: {
                aspectRatio: 1,
                maintainAspectRatio: true,
                responsive: false,

                datasets: {
                    line: {
                        display: true,
                        label: {
                            // display: false,
                        },
                    },
                },

                // borderColor: "rgba(0,0,0,0.5)",
                indexAxis: "x",
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            boxWidth: 10,
                            usePointStyle: true,
                            pointStyle: "circle",
                        },
                        // maxWidth: 200,
                        position: "top",
                    },
                    tooltip: {
                        displayColors: false,
                        bodyFont: {
                            style: "italic",
                        },
                        callbacks: {
                            title: ([data]) => {
                                return data?.raw?.title;
                            },
                            // footer: ([data]) => {
                            //     const { raw, formattedValue } = data;

                            //     return `${raw.rawValue} out of ${raw.total} ends (${
                            //         props.percent ? formattedValue : raw.percent
                            //     }%)`;
                            // },
                            label: (data) => {
                                return data?.raw?.description;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        min: 0,
                        // max: props.max || null,
                        //    grid: {
                        //     display: false,
                        //    },
                        ticks: {

                            callback: (val, index) => {
                                return val === 0 ? 'Sept' : val === 4 ? 'Jan' : val === 8 ? 'May' :  ''
                            }
                        },
                    },
                    y: {
                        // grid: {
                        //     display: false,
                        // }
                        // afterFit: (data) => {
                        //     data.width = 50;
                        // },
                        ticks: {
                            precision: 1,
                        }
                        
                    },
                },
            },
        });
    },
    { immediate: true, debounce: 50 }
);
</script>
