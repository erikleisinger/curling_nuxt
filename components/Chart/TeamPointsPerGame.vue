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
    against: Number,
    labels: Boolean,
    for: Number,
    showTooltip: Boolean,
    teamId: Number,
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
                    // borderAlign: "inner",
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
            maintainAspectRatio: true,
            responsive: true,
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
                datalabels: {
                    display: true,
                    color: "white",
                    font: {
                        size: props.height / 6,
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
                    enabled: props.showTooltip,
                    usePointStyle: true,
                    callbacks: {
                        label: ({ raw }) => {
                            const formatted = raw.toFixed(1);
                            return `${formatted} points`;
                        },
                    },
                },
            },
            cutout: "0",
            rotation: -90,
            circumference: 360,
            animation: {
                animateScale: true,
            },
        },
    });
});
</script>
