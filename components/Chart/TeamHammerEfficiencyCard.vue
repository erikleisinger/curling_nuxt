<template>
    <ChartContainer @swipe="onSwipe" :index="index">
        <template v-slot:card>
        </template>
        <div v-if="index === 0" key="chart-1" class="chart__container">
            <h2 class="text-md text-left text-bold q-pl-sm">
                Hammer efficiency
            </h2>

            <div class="stats__grid--container">
                <div class="inner-stat">
                    <h2 class="text-sm">Conversions</h2>
                    <div>{{ props.for }}</div>
                </div>
                <div class="inner-stat">
                    <h2 class="text-sm">Forces</h2>
                    <div>{{ forces }}</div>
                </div>
                <div class="inner-stat">
                    <h2 class="text-sm">Steals</h2>
                    <div>{{ steals }}</div>
                </div>
                <div class="inner-stat">
                    <h2 class="text-sm">Total ends</h2>
                    <div>{{ totalEnds }}</div>
                </div>
                <div class="chart-inner__floating">
                    <canvas ref="chart1" />
                </div>
            </div>
        </div>
        <div v-if="index === 1" key="chart-1">Stats 2</div>
    </ChartContainer>
</template>
<style lang="scss" scoped>
.chart__container {
    display: grid;
    grid-template-rows: 3em 1fr;
    padding: var(--space-md);
    .chart-inner__floating {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
    }
    .stats__grid--container {
        display: grid;
        position: relative;
        grid-template-columns: repeat(2, 50%);
        grid-template-rows: repeat(2, 50%);
        .inner-stat {
            padding: var(--space-sm);
            &:nth-child(even) {
                text-align: right;
            }
            div {
                font-weight: bold;
            }
        }
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
});

const index = ref(0);

const TITLES = ["Games played", "Title 2"];

const DESCRIPTIONS = ["", "It changed!"];

const descriptionText = computed(() => {
    return `<span class="text-bold">${props.for} / ${props.totalEnds}</span> ends`;
});
const components = ref([null, null]);
const onSwipe = (direction) => {
    const inc =
        {
            left: 1,
            right: -1,
        }[direction] || null;
    if (index.value + inc < 0 || index.value + inc >= components.value.length)
        return;
    index.value += inc;
};
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
                    borderWidth: 0,
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
                    ctx.fillText(text, x, y + 5);
                    ctx.textAlign = "center";
                    ctx.font = "bold 20px sans-serif";
                },
            },
            // new radiusBackground()
        ],
        options: {
            backgroundColor: "rgba(0,0,0,0.4)",
            maintainAspectRatio: false,
            aspectRatio: 2,
            radiusBackground: {
                color: "red", // Set your color per instance if you like
            },
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
                doughnutBackground: {
                    color: "red",
                },
                datalabels: {
                    color: "white",
                    font: {
                        size: 18,
                        family: '"Hind", sans-serif',
                        weight: "bold",
                    },
                    clamp: true,
                    anchor: "center",

                    formatter: (value, context) => {
                        return value.toFixed(1);
                    },
                },
                legend: {
                    display: false,
                    fullSize: false,
                    align: "center",
                    labels: {
                        font: {
                            size: 8,
                        },
                        usePointStyle: true,
                        pointStyle: "circle",
                        useBorderRadius: true,
                        borderRadius: 50,
                    },
                    position: "bottom",
                },
                tooltip: {
                    enabled: false,
                    usePointStyle: true,
                    callbacks: {
                        label: ({ raw }) => {
                            const formatted = raw.toFixed(1);
                            return `${formatted} points`;
                        },
                    },
                },
            },
            cutout: "80%",
            radius: "75%",
            rotation: 135,
            // circumference: (360 / 100) * Number.parseInt(percent),
            circumference: 360,
            animation: {
                animateScale: true,
            },
        },
    });
});
</script>
