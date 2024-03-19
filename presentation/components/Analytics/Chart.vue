<template>
         <canvas ref="chart" id="canvas"  />
</template>
<script setup>
    import Chart from "chart.js/auto";

    const props = defineProps({
        data: Object
    })

    let myChart;
    const chart = ref(null);
    const loading = ref(false)

    const initChart= () => {
        myChart = new Chart(chart.value, {
        type: "line",
        data: props.data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        pointStyle: "circle",
                        usePointStyle: true,
                        // color: "white",
                    },
                    reverse: true,
                    title: {
                        color: "white",
                    },
                },
                tooltip: {
                    enabled: true,
                },
            },
            scales: {
                x: {
                    display: true,
                 
                },
                y: {
                    display: true,
                
                    border: {
                        display: false,
                    },
                    grid: {
                        display:true,
                    },
                    min: 0,
                    max: 100,
                    position: "left",
                    
                    ticks: {
                        padding: 0,
                        mirror: true,
                        callback:(value) => `${value}%`
                    },
                    title: {
                        display: true,
                        text: 'Win %',

                    }
                },
            },
        },
    });
    Object.seal(chart.value);

    }

    onMounted(() => {
        initChart()
    })
</script>