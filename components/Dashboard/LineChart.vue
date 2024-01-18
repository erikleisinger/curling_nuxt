<template>
    <canvas ref="chart" id="canvas" />
</template>
<script setup>
import Chart from "chart.js/auto";
const props = defineProps({
    color: {
        type: String,
        default: "#347fc4"
    },
    data: Array,
    maintain: Boolean,
    modelValue: Object,
    labels: Boolean,
    clickable: Boolean,
});

const emit = defineEmits(['click', 'update:modelValue'])

const chartForParent = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})
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
            borderColor: props.color,
            backgroundColor: (context) => setBgGradient(context, props.color),
            tension: 0.4,
            pointRadius: 0,
        },
    ];
    myChart.update();
    chartForParent.value = myChart;
};

const {setBgGradient} = useColor();

onMounted(() => {
    myChart = new Chart(chart.value, {
        type: "line",
        options: {

            responsive: true,
            maintainAspectRatio: props.maintain,
            onClick: (e) => {
                if (!props.clickable) return;
                const [point] = myChart.getElementsAtEventForMode(e, 'index', { intersect: false }, false) ?? [];
                if (!point)return;
                const {index, element} = point;
                const {$context} = element;
                const {raw} = $context;
                const {x,y} = element;

                emit('click', {index, x, y, raw})
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltips: {
                    enabled: false,
                }
               
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
