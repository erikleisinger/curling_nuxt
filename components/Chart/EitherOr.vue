<template>
    <canvas ref="chart"/>
</template>
<script setup>
import Chart from "chart.js/auto";

const props = defineProps({
    datasets: {
        type: Array, 
        default() {
return [
                  {
                    label: "Avg points scored",
                    backgroundColor: "#3790E9",
                    barThickness: 15,
                    data: [50],
                },
                {
                    label: "Avg points conceded",
                    backgroundColor: "#E3D8F1",
                       barThickness: 15,
                    data: [100],
                },
]
        },
    }
})

const chart = ref(null)
    onMounted(() => {
    new Chart(chart.value, {
        type: "bar",
        label: 'Title',
        data: {
            labels: [
                "",
            ],
            datasets: props.datasets,
        },
        options: {
            borderColor: "rgba(0,0,0,0.5)",
            indexAxis: 'y',

            responsive: true,
            scales: {
                x: {
                    stacked: true,
                      ticks: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        display: false
                    }
                },
            },
        },
    });
});
</script>