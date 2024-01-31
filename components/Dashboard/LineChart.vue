<template>
    <canvas ref="chart" id="canvas" />
</template>
<script setup>
import Chart from "chart.js/auto";
const props = defineProps({
    color: {
        type: String,
        default: "#347fc4",
    },
    data: Array,
    maintain: Boolean,
    modelValue: Object,
    labels: Boolean,
    clickable: Boolean,
    start: String,
    end: String,
});

const emit = defineEmits(["click", "update:modelValue"]);

const chartForParent = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});
let myChart;
const chart = ref(null);

const setChartData = () => {
    if (!myChart) return;
    myChart.data.labels = Array.from(
        Array(props.data[0]?.points?.length).keys()
    ).map((d, index) => index);
    myChart.data.datasets = props.data.map(
        ({ color, points, label }, index) => {
            return {
                data: points,
                label,
                fill: true,
                borderColor: color,
                // backgroundColor: props.data.length === 1 || index === 1 ? (context) => setBgGradient(context, color) : 'transparent',
                backgroundColor: !index
                    ? (context) => setBgGradient(context, color)
                    : "transparent",
                tension: 0.4,
                pointRadius: 0,
                order:
                    props.data.length > 1 && !index
                        ? 2
                        : props.data.length > 1
                        ? 1
                        : 1,
            };
        }
    );

    myChart.options.plugins.legend.display = props.data?.length > 1;

    myChart.update();
    chartForParent.value = myChart;
};

const { setBgGradient } = useColor();

onMounted(() => {
    myChart = new Chart(chart.value, {
        type: "line",
        options: {
            responsive: true,
            maintainAspectRatio: props.maintain,
            onClick: (e) => {
                if (!props.clickable) return;
                const points =
                    myChart.getElementsAtEventForMode(
                        e,
                        "index",
                        { intersect: false },
                        false
                    ) ?? [];
                let point;
                if (points.length === 2) {
                    point = points[1];
                } else {
                    point = points[0];
                }
                if (!point) return;
                const { index, element } = point;
                const { $context } = element;
                const { raw } = $context;
                const { x, y } = element;

                let raw2 = null;
                if (points[1]) {
                    const { $context: context2 } = points[0].element;
                    raw2 = context2.raw;
                }

                emit("click", { index, x, y, raw, raw2 });
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        pointStyle: "circle",
                        usePointStyle: true,
                        color: "white",
                    },
                    reverse: true,
                    title: {
                        color: "white",
                    },
                },
                tooltip: {
                    enabled: false,
                },
            },
            scales: {
                x: {
                    display: !!props.start && !!props.end,
                    ticks: {
                        callback: (_, index) => {
                            if (index === 0) return props.start ?? false;
                            if (index === props.data[0].points.length - 1)
                                return props.end;
                        },
                        align: "inner",
                    },
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
