<template>
    <ChartContainer :index="index">
        <!-- <template v-slot:title>{{ TITLES[index] }}</template>
        <template v-slot:subtitle>{{ DESCRIPTIONS[index] }}</template> -->
        <template v-slot:card>
            <!-- <StatsAggregateCard :score="gamesCount"/> -->
        </template>
        <div v-if="index === 0" key="chart-1" class="chart__container">
            <div class="full-height row items-center">
                <div>
                    <h2 class="text-md text-bold">Games played</h2>
                    <h3 class="text-sm">
                        {{ wins }} wins, {{ losses }} losses, {{ ties }} ties
                    </h3>
                </div>
            </div>
            <div>
                <canvas ref="chart1" />
            </div>
        </div>
        <div v-if="index === 1" key="chart-1">Stats 2</div>
    </ChartContainer>
</template>
<style lang="scss" scoped>
.chart__container {
    display: grid;
    grid-template-columns: 50% 50%;
    padding-left: var(--space-md);
}
</style>
<script setup>
import { useElementSize } from "@vueuse/core";
import Chart from "chart.js/auto";

const props = defineProps({
    losses: Number,
    ties: Number,
    wins: Number,
});

const index = ref(0);

const TITLES = ["Games played", "Title 2"];

const DESCRIPTIONS = ["", "It changed!"];
const components = ref([null, null]);
const chart1 = ref(null);

const { height: chartHeight } = useElementSize(chart1);

const chartData = ref([
    {
        value: 0,
        percent: 0,
    },
    {
        value: 0,
        percent: 0,
    },
    {
        value: 0,
        percent: 0,
    },
]);
const chart = ref(null)

const setChartData = () => {
    const { wins, losses, ties } = props;
    chartData.value = [
        {
            value: wins,
            percent: (wins / (wins + losses + ties)) * 100,
        },
        {
            value: ties,
            percent: (ties / (wins + losses + ties)) * 100,
        },
        {
            value: losses,
            percent: (losses / (wins + losses + ties)) * 100,
        },
    ];
}

onMounted(async () => {
    setChartData();
    const newChart = new Chart(chart1.value, {
        type: "doughnut",
        data: {
            labels: ["Win", "Draw", "Loss"],
            datasets: [
                {
                    data: chartData.value,
                    backgroundColor: [
                        "#9f5afd",
                        "#F0C808",
                        "#EE6055",
                    ],
                    borderAlign: "inner",
                    borderColor: ["rgba(255, 255, 255 ,1)"],
                    borderJoinStyle: "miter",
                    borderRadius: [
                        {
                            outerEnd: 0,
                            innerEnd: 70,
                        },
                        {
                            innerStart: 16,
                            innerEnd: 16,
                        },
                        {
                            innerStart: 16,
                        },
                    ],
                    borderWidth: 2,
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
                    const totalGames = data.datasets[0].data.reduce(
                        (all, c) => {
                            return all + c.value;
                        },
                        0
                    );

                    ctx.fillText(totalGames, x, y + 12.5);
                    ctx.textAlign = "center";
                    ctx.font = "bold 40px sans-serif";
                },
            },
        ],
        options: {
            maintainAspectRatio: false,
            aspectRatio: 2,
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
                    fullSize: false,
                    align: "center",
                    labels: {
                        font: {
                            size: 16,
                        },
                        usePointStyle: true,
                        pointStyle: "circle",
                        useBorderRadius: true,
                        borderRadius: 50,
                        padding: 15,
                    },
                    position: "right",
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
            cutout: "75%",
            rotation: -90,
            circumference: 360,
            animation: {
                animateScale: true,
            },
        },
    });

    Object.seal(newChart);
    chart.value = newChart;
});

const record = computed(() => ({wins: props.wins, losses: props.losses, ties: props.ties}))
watch(record, () => {
    setChartData();
    chart.value.data.datasets.forEach((dataset) => {
        dataset.data = chartData.value
    })
    chart.value.update('none');
}, {deep: true})
</script>
