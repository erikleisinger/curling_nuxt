<template>
     <canvas ref="chart" style="margin:auto"/>
</template>

<script setup>
import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
const chart = ref(null)

const props = defineProps({
    data: {
        type: Array,
        default() {
            return [0, 1, 2]
        }
    },
})

const sumGames = computed(() => {
return props.data.reduce((all, current) => (all += current), 0)
})

const percentagesFromData = computed(() => {
    
    const [wins, losses, ties] = props.data;
    console.log(wins, losses, ties)
    if (!wins && !losses && !ties) return [33,33,33]
    return [
        wins / sumGames.value * 100,
        losses / sumGames.value * 100,
        ties / sumGames.value * 100
    ]
})

onMounted(() => {
    const data = {
        datasets: [
            {
                data: percentagesFromData.value,
            },
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ["Wins", "Losses", "Ties"],
    };
    new Chart(chart.value, {
        type: "doughnut",
        data,
         plugins: [ChartDataLabels],
        options: {
            // borderColor: "rgba(0,0,0,0.5)",
            borderJoinStyle: "round",
            backgroundColor: (val) => {
                const color = {
                    0: "#5142f6", // Win
                    1: "#ff3c2b", // Loss
                    // 2: "#FF7B9C", // tie
                    2: '#f4389c' // tie
                }[val.index];
                return color;
            },
            plugins: {
                datalabels: {
                    color: 'white',
                    formatter: (data) => {
                        if (!data) return ''
                        return `${data.toFixed()}%`
                    },
                    
                },
                    legend: {
                        labels: {
                            boxWidth: 10,
                            usePointStyle: true,
                            pointStyle: 'circle',
                        },
                        position: "left",
                    },
                tooltip: {
                    usePointStyle: true,
                    callbacks: {
                        label: ({dataIndex}) => {
                           return `${props.data[dataIndex]} out of ${sumGames.value}`
                        },
                        labelPointStyle: () => {
                            return {
                                pointStyle: "circle",
                            };
                        },
                    },
                },
            },
        },
    });
});
</script>