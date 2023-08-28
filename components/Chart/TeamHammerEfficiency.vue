<template>
    <div class="chart__container">
        <div class="chart__inner">
            <canvas ref="chart1" />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.chart__container {
    height: v-bind(formattedHeight);
    width: v-bind(formattedHeight);
    .chart__inner {
        margin: -10px;
    }
}
</style>
<script setup>
import { useElementSize } from "@vueuse/core";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const props = defineProps({
    for: Number,
    forces: Number,
    steals: Number,
    teamId: Number,
    totalEnds: Number,
    height: {
        type: Number,
        default: 60,
    },
});

const formattedHeight = computed(() => `${props.height}px`);

const index = ref(0);

const TITLES = ["Games played", "Title 2"];

const DESCRIPTIONS = ["", "It changed!"];

const descriptionText = computed(() => {
    return `<span class="text-bold">${props.for} / ${props.totalEnds}</span> ends`;
});
const components = ref([null, null]);
const chart1 = ref(null);

const { height: chartHeight } = useElementSize(chart1);

const chartData = ref([props.for, props.against]);

const gamesCount = ref(0);

var radiusBackground = function () {
    var self = this;

    function handler(chart, options) {
        const { ctx, width, height } = chart;

        const { innerRadius } = chart.getDatasetMeta(
            chart.data.datasets.length - 1
        ).controller;
        const { outerRadius } = chart.getDatasetMeta(0).controller;
        const radiusLength = outerRadius - innerRadius;

        const x = width / 2,
            y = height / 2;

        ctx.beginPath();
        ctx.arc(x, y, outerRadius - radiusLength / 2, 0, 2 * Math.PI);
        ctx.lineWidth = radiusLength;
        ctx.strokeStyle = "rgba(0,0,0,0.08)";
        ctx.stroke();
    }

    return {
        id: "doughnutChartBackground",
        beforeDatasetsDraw: handler,
    };
};

onMounted(async () => {
    const percent = Number.parseInt(
        ((props.for / props.totalEnds) * 100).toFixed()
    );
    if (Number.isNaN(percent)) return;
    new Chart(chart1.value, {
        type: "doughnut",
        data: {
            datasets: [
                {
                    data: [percent, 100 - percent],
                    backgroundColor: ["#9f5afd", "rgba(0,0,0,0.1)"],
                    borderAlign: "center",
                    borderColor: ["rgba(255, 255, 255 ,1)"],
                    borderRadius: [16, 0],
                    borderWidth: 2,
                    spacing: -1,
                },
            ],
        },

        plugins: [
            {
                id: "centerText",
                afterDatasetDraw(chart, args, pluginOptions) {
                    const { ctx, data } = chart;

                    ctx.save();
                    const x = chart.getDatasetMeta(0).data[0].x;
                    const y = chart.getDatasetMeta(0).data[0].y;

                    const text = `${percent}%`;
                      ctx.fillText(text, x, y + props.height / 11);
                    ctx.textAlign = "center";
                    ctx.font = `bold calc(${props.height}px / 4.5) sans-serif`;
                },
            },
            // new radiusBackground()
        ],
         options: {
            maintainAspectRatio: true,
            aspectRatio: 1,
            elements: {
                arc: [
                    {
                        borderRadius: 16,
                    },
                ],
            },
            layout: {
                padding: 16,
            },
            plugins: {
                legend: {
                    display: false,
                    
                },
                tooltip: {
                    usePointStyle: true,
                    callbacks: {
                        label: (val) => {
                            const { raw, parsed } = val;
                            return `${parsed} game${
                                parsed === 1 ? "" : "s"
                            } - ${raw.percent.toFixed()}%`;
                        },
                    },
                },
            },
            cutout: "65%",
            rotation: -90,
            circumference: 360,
            animation: {
                animateScale: true,
            },
        },
    });
});
</script>
