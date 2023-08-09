<template>
    <canvas ref="chart"  />
</template>
<script setup>
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const props = defineProps({
    data: {
        type: Array,
        default() {
            return [
                {
                    y: "Hammer possession",
                    percent: 20,
                    rawValue: "2",
                    total: "3",
                    description: "Ends where you had hammer",
                },
                {
                    y: "Hammer conversion",
                    percent: 10,
                    rawValue: "2",
                    total: "3",
                },
                {
                    y: "Hammer possession2",
                    percent: 20,
                    rawValue: "2",
                    total: "3",
                },
                {
                    y: "Hammer conversion2",
                    percent: 10,
                    rawValue: "2",
                    total: "3",
                },
                {
                    y: "Hammer possession3",
                    percent: 20,
                    rawValue: "2",
                    total: "3",
                },
                {
                    y: "Hammer conversion3",
                    percent: 10,
                    rawValue: "2",
                    total: "3",
                },
            ];
        },
    },
    displayLabel: {
        type: Boolean,
        default() {
            return true;
        },
    },
    max: Number,
    percent: Boolean,
    tooltipCallback: {
        type: Function,
        default: (data) => `Average ${data.formattedValue} points per game`,
    },
});

const chart = ref(null);
onMounted(() => {
    new Chart(chart.value, {
        type: "bar",
        label: "Title",
        data: {
            datasets: [
                {
                    data: props.data,
                    parsing: {
                        yAxisKey: "percent",
                    },
                },
            ],
        },
        plugins: [ChartDataLabels],
        options: {
            datalabels: {
                color: "white",
                formatter: (data) => {
                    return "";
                },
            },
            datasets: {
                bar: {
                    barThickness: 15,
                    minBarLength: 15,
                },
            },
            // borderColor: "rgba(0,0,0,0.5)",
            indexAxis: "x",
            layout: {
                padding: {
                    top: 0,
                },
            },
            plugins: {
                datalabels: {
                    // anchor: "center",
                    color: "white",
                    formatter: (value, context) => {
                        if (props.percent) return `${value.percent}%`;
                        return value.rawValue;
                    },
                    //     labels: {
                    //         title: {
                    //             font: {
                    //                 weight: "bold",
                    //             },
                    //         },
                    //         value: {
                    //             color: "white",
                    //         },
                    //     },
                },
                legend: {
                    display: false,
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
                        footer: ([data]) => {
                            const { raw, formattedValue } = data;

                            return `${raw.rawValue} out of ${raw.total} ends (${
                                props.percent ? formattedValue : raw.percent
                            }%)`;
                        },
                        label: (data) => {
                            return data?.raw?.description;
                        },
                    },
                },
            },
            responsive: true,
            scales: {
                y: {
                    min: 0,
                    max: props.max || null,
                    grace: 1,
                    ticks: {
                          callback: (data) => {
                        return `${data}%`
                    },
                        stepSize: 1,
                        display: true,
                    },
                  
                },
                x: {
                    afterFit: (data) => {
                        data.width = 50;
                    },
                    ticks: {
                        callback: (data) => {
                        return `${data}pt`
                    },
                    }
                },
            },
        },
    });
});
</script>
