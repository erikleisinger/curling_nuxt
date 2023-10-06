<template>
    <div v-if="!loading" class="full-width">
        <slot :chart="myChart" />
    </div>
    <div :style="`height: ${height}; width: 100%`">
        <canvas ref="chart" id="canvas" />
    </div>
</template>
<style lang="scss" scoped></style>
<script setup>
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(annotationPlugin);

const props = defineProps({
    annotations: Object,
    height: {
        type: String,
        default: "100%",
    },
    data: Object,
    ticks: Object,
    tooltip: Object,
});

const emit = defineEmits(["chart"]);

const chart = ref(null);
let myChart;

const loading = ref(true);

onMounted(async () => {
    const annotations = { ...props.annotations };
    const data = { ...props.data };
    const tooltip = { ...props.tooltip };
    const ticks = { ...props.ticks };
    myChart = new Chart(chart.value, {
        type: "line",
        data,

        options: {
            clip: false,
            elements: {
                line: {
                    tension: 0,
                    borderWidth: 5,
                },
                // point: {
                //     display: false,
                //     pointRadius: 0,
                // },
            },

            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                annotation: {
                    annotations,
                },
                legend: {
                    display: false,
                    position: "top",
                    labels: {
                        display: false,
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 16,
                    },
                },
                // tooltip,
            },

            animation: {
                animateScale: true,
            },
           
            scales: {
                x: {
                    border: {
                        display: false,
                    },
                    grid: {
                        display: false,
                        
                        
                    },
                    ticks: {
                        display: false
                    }
                   
                },
                y: {
                    border: {
                        display: false,
                    },
                    grid: {
                        display: false,
                    },
                    min: 0,
                    //max: 100,
                    position: 'right',
                    ticks: {
                        callback: (e, e2, e3) => {
                            const {value: startValue} = e3[0];
                            const {value: endValue} = e3[e3.length- 1]
                            console.log(startValue,endValue, e)
                            // if (e !== startValue && e !== endValue) return ''
                            return `${e}%`;
                        },
                        padding: 0,
                        display: false,
                    },
                },
            },
        },
    });

    Object.seal(myChart.value);
    loading.value = false;
    emit("chart", myChart);
});
</script>
