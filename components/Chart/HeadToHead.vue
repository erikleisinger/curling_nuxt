<template>
    <canvas ref="chart" style="max-height: 90px" />
</template>
<script setup>
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const props = defineProps({
    datasets: {
        type: Array,
        default() {
            return [
                {
                    label: "Avg for",
                    backgroundColor: "#3790E9",
                    barThickness: 15,
                    data: [2.2],
                },
                {
                    label: "Avg against",
                    backgroundColor: "#E3D8F1",
                    barThickness: 15,
                    data: [3],
                },
            ];
        },
    },
    displayLabel: {
        type: Boolean,
        default() {
            return true
        }
    },
    tooltipCallback: {
        type: Function,
        default: (data) => `Average ${data.formattedValue} points per game`
            
    }
});

const chart = ref(null);
onMounted(() => {
    new Chart(chart.value, {
        type: "bar",
        label: "Title",
        data: {
            labels: [""],
            datasets: props.datasets,
        },
        plugins: [ChartDataLabels],
        options: {
            // borderColor: "rgba(0,0,0,0.5)",
            indexAxis: "y",
            maintainAspectRatio: false,

            layout: {
                padding: {
                    top: 0,
                },
            },
            plugins: {
                datalabels: {
                    anchor: "center",
                    color: (val) => {
                        return val.dataset.fontColor || 'white'
                    },
                    // formatter: (value, context) => {
                    //     return `${value}`
                    // },
                    labels: {
                        title: {
                            font: {
                                weight: "bold",
                            },
                        },
                       
                    },
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

                    callbacks: {
                        label: props.tooltipCallback,
  
                    }
                }
            },
            responsive: true,
            scales: {
                x: {
                    display: false,
                    min:0,
                    max: ({chart}) => {
                        return chart?.data?.datasets?.reduce((all, current) => {
                            return current.data[0] + all
                        }, 0)

                    },
                    grid: {
                        display: false,
                    },
                    grace: 0,
                    stacked: true,
                    ticks: {
                        display: false,
                        backdropPadding: 0,
                        grace: 0,
                        
                        
                       
                    },
                },
                y: {
                    display:false,
                    stacked: true,
                },
            },
        },
    });
});
</script>
