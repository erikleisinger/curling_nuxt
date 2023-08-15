<template>
    <ChartContainer @swipe="onSwipe" :index="index">
        <!-- <template v-slot:title>{{ TITLES[index] }}</template>
        <template v-slot:subtitle>{{ DESCRIPTIONS[index] }}</template> -->
        <template v-slot:card>
            <!-- <StatsAggregateCard :score="gamesCount"/> -->
        </template>
        <!-- :style="{height: `${chartHeight}px`}" -->
        <div v-if="index === 0" key="chart-1" class="chart__container">
            <div class="full-height row items-center">
                <div>
                    <h2 class="text-md text-bold">Ends per game</h2>
                    <h3 class="text-sm" v-html="descriptionText" />
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
import ChartDataLabels from "chartjs-plugin-datalabels";

const props = defineProps({
    against: Number,
    for: Number,
    teamId: Number,
});

const index = ref(0);

const TITLES = ["Games played", "Title 2"];

const DESCRIPTIONS = ["", "It changed!"];

const descriptionText = computed(() => {
    if (props.for > props.against) {
        return `Wins <span class="text-bold">${(
            props.for - props.against
        ).toFixed(1)}</span> more ends than they lose`;
    } else if (props.for < props.against) {
        return `Loses <span class="text-bold">${(
            props.against - props.for
        ).toFixed(1)}</span> more ends than they win`;
    } else {
        return "Wins as many ends as they lose";
    }
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

onMounted(async () => {
    const centerText = {
        id: "centerText",
        afterDataSetDraw(chart, args, pluginOptions) {
            const { ctx } = chart;
            console.log(chart.getDatasetMeta(0));
            ctx.save();
        },
    };

    var chart = new Chart(chart1.value, {
        type: "doughnut",
        data: {
            labels: ["Points for per game", "Points against per game"],
            datasets: [
                {
                    data: chartData.value,
                    backgroundColor: ["#9f5afd", "#EE6055"],
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

        plugins: [ChartDataLabels],
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
                        // pointStyleWidth: 40,
                        useBorderRadius: true,
                        borderRadius: 50,
                        // padding: 15,
                    },
                    position: "bottom",
                },
                tooltip: {
                    usePointStyle: true,
                    callbacks: {
                        label: (val) => {
                            const { dataIndex, raw } = val;
                            console.log(val);
                            const formatted = raw.toFixed(1);
                            return `${formatted} points`;
                        },
                    },
                },
            },
            cutout: "0%",
            rotation: -90,
            circumference: 360,
            animation: {
                animateScale: true,
            },
        },
    });
});
</script>
