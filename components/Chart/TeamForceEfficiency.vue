<template>
    <ChartContainer @swipe="onSwipe" :index="index">
        <!-- <template v-slot:title>{{ TITLES[index] }}</template>
        <template v-slot:subtitle>{{ DESCRIPTIONS[index] }}</template> -->
        <template v-slot:card>
            <!-- <StatsAggregateCard :score="gamesCount"/> -->
        </template>
        <!-- :style="{height: `${chartHeight}px`}" -->
        <div v-if="index === 0" key="chart-1" class="chart__container">
            <div>
                <canvas ref="chart1" />
            </div>
            <div class="full-height row items-center">
                <div>
                    <h2 class="text-md text-bold text-right">
                        Force efficiency
                    </h2>
                    <h3 class="text-sm text-right" v-html="descriptionText" />
                </div>
            </div>
        </div>
        <div v-if="index === 1" key="chart-1">Stats 2</div>
    </ChartContainer>
</template>
<style lang="scss" scoped>
.chart__container {
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
    totalEnds: Number
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


var radiusBackground = function() {
  var self = this;

  function handler(chart, options) {
  const { ctx, width, height } = chart

  const { innerRadius } = chart.getDatasetMeta(chart.data.datasets.length - 1).controller
  const { outerRadius } = chart.getDatasetMeta(0).controller
  const radiusLength = outerRadius - innerRadius


    const x = width / 2,
      y = height / 2

    ctx.beginPath()
    ctx.arc(x, y, outerRadius - radiusLength / 2, 0, 2 * Math.PI)
    ctx.lineWidth = radiusLength
    ctx.strokeStyle = 'rgba(0,0,0,0.08)'
    ctx.stroke()
  


}

  return {
      id: 'doughnutChartBackground',
        beforeDatasetsDraw: handler
  }
};

onMounted(async () => {
    const percent = Number.parseInt(((props.for / props.totalEnds) * 100).toFixed())
    if (Number.isNaN(percent)) return;
    console.log('circ: ', (360 / 100) * Number.parseInt(percent))
    var chart = new Chart(chart1.value, {
        type: "doughnut",
        data: {
            labels: ["Points for per game", "Points against per game"],
            datasets: [
                {
                    data: [80],
                    backgroundColor: ["rgba(159, 90, 253, 1)", "#EE6055"],
                    borderAlign: "inner",
                    borderColor: ["rgba(255, 255, 255 ,1)"],
                    borderJoinStyle: "miter",
                    borderRadius: 8,
                    borderWidth: 0,
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
                    
                    const text = `${percent}%`
                    ctx.fillText(text, x, y + 7.5);
                    ctx.textAlign = "center";
                    ctx.font = "bold 25px sans-serif";
                },
            },
            // new radiusBackground()
        ],
        options: {
            backgroundColor: 'rgba(0,0,0,0.4)',
            maintainAspectRatio: false,
            aspectRatio: 2,
             radiusBackground: {
      color: 'red' // Set your color per instance if you like
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
                    color: 'red'
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
            radius: "100%",
            rotation: 90,
            // circumference: (360 / 100) * Number.parseInt(percent),
            circumference: 180,
            animation: {
                animateScale: true,
            },
            position: 'center'
        },
    });
    console.log(chart)
});
</script>
