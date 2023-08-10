<template>
    <canvas ref="chart"  />
</template>
<script setup>
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const props = defineProps({
    data: Array,
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
                    barPercentage: 0.9,
                    categoryPercentage: (val) => {
                        console.log('CATEGORYa: ', val)
                        return 1;
                    },
                    // borderRadius: 32,
                    
                    borderSkipped: false,
                    borderWidth:2,
                    borderColor: 'rgba(99, 149, 255, 0.9)',
                    // spacing: 100,
                    backgroundColor: (val) => {
                        // console.log('bg color: ', val)
                        return 'rgba(99, 149, 255, 0.5)'
                    },
                    data: props.data,
                    parsing: {
                        xAxisKey: props.percent ? "percent" : "rawValue",
                    },
                },
            ],
        },
        plugins: [ChartDataLabels],
        options: {
            aspectRatio: 1,
            maintainAspectRatio: true,
            responsive: false,
            


            datasets: {
                bar: {

                    // barThickness: 60,
                    minBarLength: 40,
                },
            },
            elements: {
                barThickness: 30,
            },
            // borderColor: "rgba(0,0,0,0.5)",
            indexAxis: "y",
            layout: {
                
                padding: {
                    top: 0,
                },
            },
            plugins: {
                datalabels: {
                    // anchor: "center",
                    color: "white",
                    font: {
                        size: 20,
                        family: '"Hind", sans-serif'
                    },
                    // display: false,


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
            scales: {
                
                x: {
                    height: 3000,
                    min: 0,
                    max: props.max || null,
                   grid: {
                    display: false,
                   },

                    
                    
                },
                y: {
                    grid: {
                        display: false,
                    }
                    
                    // afterFit: (data) => {
                    //     data.width = 50;
                    // },
                },
            },
        },
    });

// myChart.
});
</script>
