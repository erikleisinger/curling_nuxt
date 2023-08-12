<template>
    <canvas ref="chart" class="zoomable-chart" />
</template>
<script setup>
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const props = defineProps({
    visible: Boolean,
    index: Number,
});

const chart = ref(null);
const isVisible = computed(() => props.visible);
const rendered = ref(false);
const myChart = ref(null);

onMounted(() => {
    console.log('mounted')
            if (!isVisible.value && !rendered.value) return;
        if (!isVisible.value && rendered.value) {
            return;
        } else if (rendered.value) {
            return;
        }
        setTimeout(() => {
   renderChart();
}, 300)
     

     
})

const id = Math.floor(Math.random() * 1000000000)
const renderChart = () => {
   rendered.value = true;
           
        window[`chart${id}`] = new Chart(chart.value, {
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
}

    onBeforeUnmount(() => {
        const chart = window[`chart${id}`]
        if (!chart) return;
        chart.destroy();
        delete window[`chart${id}`]
    })
</script>
