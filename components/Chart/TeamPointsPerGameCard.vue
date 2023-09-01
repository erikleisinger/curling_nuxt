<template>
    <ChartContainer @swipe="onSwipe" :index="index">
        <!-- <template v-slot:title>{{ TITLES[index] }}</template>
        <template v-slot:subtitle>{{ DESCRIPTIONS[index] }}</template> -->
        <template v-slot:card>
            <!-- <StatsAggregateCard :score="gamesCount"/> -->
        </template>
        <!-- :style="{height: `${chartHeight}px`}" -->
        <div v-if="index === 0" key="chart-1" class="chart__container">
           
            <div style="position:relative; width: 100%">
                <canvas ref="chart1" />
            </div>
             <div class="full-height row items-center">
                <div>
                    <h2 class="text-md text-bold text-right">Points per game</h2>
                    <h3 class="text-sm text-right" v-html="descriptionText" />
                </div>
            </div>
        </div>
        <div v-if="index === 1" key="chart-1">Stats 2</div>
    </ChartContainer>
</template>
<style lang="scss" scoped>
.chart__container {
    width: 100%;
    display: grid;
    grid-template-columns: 50% 50%;
    padding-right: var(--space-md);
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
        return `Scores <span class="text-bold">${(
            props.for - props.against
        ).toFixed(1)}</span> more points than they concede`;
    } else if (props.for < props.against) {
        return `Concedes <span class="text-bold">${(
            props.against - props.for
        ).toFixed(1)}</span> more points than they score`;
    } else {
        return "Scores as many points as they concede";
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
                        useBorderRadius: true,
                        borderRadius: 50,
                    },
                    position: "bottom",
                },
                tooltip: {
                    usePointStyle: true,
                    callbacks: {
                        label: ({ raw }) => {
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
