<template>
    <canvas ref="chart" id="canvas" />
</template>
<script setup>
import Chart from "chart.js/auto";
const props = defineProps({
    data: Array,
    maintain: Boolean,
    labels: Boolean,
});
let myChart;
const chart = ref(null);

const setChartData = () => {
    if (!myChart) return;
    myChart.data.labels = Array.from(Array(props.data.length).keys()).map(
        (d, index) => index
    );
    myChart.data.datasets = [
        {
            data: props.data,
            label: "data",
            fill: true,
            borderColor: "#347fc4",
            backgroundColor: (context) => setBgGradient(context, "#347fc4"),
            tension: 0.4,
            pointRadius: 0,
        },
    ];
    myChart.update();
};

const {setBgGradient} = useColor();

onMounted(() => {
    myChart = new Chart(chart.value, {
        type: "line",
        options: {
            responsive: true,
            maintainAspectRatio: props.maintain,
            
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    display: false,
                },
                y: {
                    display: !!props.labels,
                    border: {
                        display: false,
                    },
                    grid: {
                        display: false,
                    },
                    position: "left",
                    ticks: {
                        padding: 0,
                        mirror: true,
                    },
                },
            },
        },
    });
    Object.seal(chart.value);

    setChartData();
});

watch(
    () => props.data,
    () => {
        setChartData();
    },
    { deep: true }
);
</script>
