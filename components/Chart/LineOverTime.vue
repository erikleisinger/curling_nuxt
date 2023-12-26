<template>
    <div :style="`height: ${height}`">
        <div
            class="floating text-bold"
            :style="titlePosition"
            id="line-chart-annotation"
            ref="annotation"
        >
            <slot name="annotation" />
        </div>
        <canvas ref="chart" id="canvas" style="z-index: 1" />
    </div>
</template>
<style lang="scss" scoped>
.ticks__container {
    position: absolute;
    height: 100%;
    width: 30px;
    right: 2vw;
    top: 0;
    border-right: 1px solid rgba(0, 0, 0, 0.5);
 

    mix-blend-mode: multiply;
}
:deep(.floating) {
    position: absolute;
    pointer-events: none;
    height: 76px;
    margin: var(--space-lg);
    @include sm {
        margin: var(--space-lg);
    }
    margin-right: var(--space-xl);
    color: v-bind(labelColor);
    width: fit-content;
       z-index: 0;

    h5 {
        font-weight: normal;
        font-size: var(--text-sm);
        color: black !important;
    }
    h3 {
        font-weight: bold;
        line-height: 0.8em;
        font-size: var(--text-xxxl);
    }
    h4 {
        font-size: var(--text-xs);
        margin-top: -8px;
        font-style: italic;
        color: black !important;
    }
}
</style>
<script setup>
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";
import gsap from "gsap";
import { useElementSize, useElementBounding } from "@vueuse/core";

const $q = useQuasar();

Chart.register(annotationPlugin);

const props = defineProps({
    annotations: Object,
    calculateMinMax: Boolean,
    height: {
        type: String,
        default: "100%",
    },
    data: Object,
    percent: {
        type: Boolean,
        default: true,
    },
    ticks: Object,
    tooltip: Object,
});

const triggerAnnotationAnimation = () => {
    const tl = gsap.timeline();

    tl.from(
        document.querySelector("#line-chart-annotation").querySelector("h3"),
        {
                        x:
                Math.ceil(Math.random() * 50) *
                (Math.round(Math.random()) ? 1 : -1),
            y:
                Math.ceil(Math.random() * 50) *
                (Math.round(Math.random()) ? 1 : -1),
            opacity: 0,
            duration: 0.5,
            // delay: 0.2,
            ease: "power2",
        },
        "start"
    )

    tl.from(
        document
            .querySelector("#line-chart-annotation")
            .querySelector("h3 span"),
        {
            opacity: 0,
            duration: 0.3,
            delay: 0.1,
            ease: "power2",
        }
    );

};

const chart = ref(null);
let myChart;

const loading = ref(true);

const dayjs = useDayjs();

const label = computed(() => props.data.datasets[0].label);
const labelColor = computed(() => props.data.datasets.length > 1 ? '#36454f' : props.data.datasets[0].borderColor);
const cumulativeAvg = computed(() =>
    props.data.datasets[0].data[
        props.data.datasets[0].data.length - 1
    ]?.y.toFixed(2)
);

const { width: chartWidth, height: chartHeight } = useElementSize(chart);
const annotation = ref(null);
const { width: annotationWidth, height: annotationHeight } =
    useElementBounding(annotation);

const titlePosition = computed(() => {
    if (!chartWidth.value) return;

    const arr = [];
    props.data?.datasets?.forEach(({ data }) => {
        data.forEach(({ y }, index) => {
            if (!arr[index]) arr[index] = [];

            arr[index].push(
                props.percent
                    ? y
                    : ((y - min.value) / (max.value - min.value)) * 100
            );
        });
    });

    const numPointsTotal = props.data?.datasets[0]?.data?.length ?? 0

    const requiredVerticalSpacing =
        (annotationHeight.value / chartHeight.value) * 100;


    const pointSpacing =
        chartWidth.value / numPointsTotal;
            const numSpacesNeeded = Math.ceil(annotationWidth.value / pointSpacing);


    const topSpaces = arr
        .reduce((all, current) => {
            return [
                ...all,
                Math.max(...current) < 100 - requiredVerticalSpacing,
            ];
        }, [])
        .reduce(
            (all, current, index) => {
                if (all.count >= numSpacesNeeded) return all;

                if (!!current) {
                    if (all.index === null) {
                        return { index, count: all.count + 1 };
                    }
                    return { index: all.index, count: all.count + 1 };
                }
                if (!current) {
                    return { index: null, count: 0 };
                }
            },
            { index: null, count: 0 }
        );

    const bottomSpaces = arr
        .reduce((all, current) => {

            return [...all, Math.min(...current) > requiredVerticalSpacing];
        }, [])
        .reduce(
            (all, current, index) => {
                if (all.count >= numSpacesNeeded) return all;
                if (!!current) {
                    if (all.index === null) {
                        return { index, count: all.count + 1 };
                    }
                    return { index: all.index, count: all.count + 1 };
                }
                if (!current) {
                    return { index: null, count: 0 };
                }
            },
            { index: null, count: 0 }
        );

    let middleSpaces;
    if (props.data?.datasets?.length === 2) {
        middleSpaces = arr
            .reduce((all, current) => {
                return [
                    ...all,
                    Math.abs(current[0] - current[1]) >= requiredVerticalSpacing
                        ? 100 - Math.max(...current)
                        : false,
                ];
            }, []).reduce(
                (all, current, index) => {
                    if (all.count >= numSpacesNeeded) return all;
                    if (current !== null && current !== undefined) {
                        if (all.index === null) {
                            return { index, count: all.count + 1, y: current };
                        }
                        return {
                            index: all.index,
                            count: all.count + 1,
                            y: all.y,
                        };
                    }
                    if (!current) {
                        return { index: null, count: 0, y: 0 };
                    }
                },
                { index: null, count: 0, y: 0 }
            );
    }



    const canBeMiddle = middleSpaces?.count >= numSpacesNeeded;
    const canBeTop = topSpaces.count >= numSpacesNeeded;
    const canBeBottom = bottomSpaces.count >= numSpacesNeeded;

    if (canBeTop) {
     return {
            top: 0,
            left: `${topSpaces.index * pointSpacing}px`,
            margin: "auto",
            "margin-left": $q.screen.xs ? "var(--space-sm)" : "var(--space-md)",
            "margin-right": $q.screen.xs
                ? "var(--space-sm)"
                : "var(--space-md)",
            "margin-top": $q.screen.xs ? "var(--space-sm)" : "var(--space-md)",
        };
    }

    if (canBeBottom) {
        return {
            bottom: 0,
            left: `${bottomSpaces.index * pointSpacing}px`,
            margin: "auto",
            "margin-left": $q.screen.xs ? "var(--space-sm)" : "var(--space-md)",
            "margin-right": $q.screen.xs
                ? "var(--space-sm)"
                : "var(--space-md)",
            "margin-bottom": $q.screen.xs
                ? "var(--space-xs)"
                : "var(--space-lg)",
        };
    }

    if (canBeMiddle) {
        return {
            top: `${(middleSpaces.y / 100) * chartHeight.value}px`,
            left: `${middleSpaces.index * pointSpacing}px`,
            margin: "auto",
            color: "white",
            "margin-left": $q.screen.xs ? "var(--space-sm)" : "var(--space-md)",
            "margin-right": $q.screen.xs
                ? "var(--space-sm)"
                : "var(--space-md)",
            "margin-bottom": $q.screen.xs
                ? "var(--space-md)"
                : "var(--space-lg)",
                  "margin-top": $q.screen.xs
                ? "var(--space-md)"
                : "var(--space-lg)",
        };
    }
});

onMounted(async () => {
    getMinMax();
    const annotations = { ...props.annotations };
    const data = {
        ...props.data,
        datasets: props.data.datasets.map((d) => ({
            ...d,
            pointStyle: "circle",
            pointRadius: 3,
            pointHitRadius: 15,
            pointBackgroundColor: d.borderColor,
        })),
    };

    // const data = {...props.data}

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
                    borderWidth: 0,
                },
            },
            layout: {
                padding: {
                    left: 0,
                    top: 0,
                },
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
                        usePointStyle: false,
                        pointStyle: "circle",
                        padding: 16,
                    },
                },
                tooltip: {
                    ...tooltip,
                    mode: "nearest",
                    bodyFont: {
                        size: 40,
                        weight: "bold",
                        family: "Montserrat",
                        lineHeight: 0.5,
                    },
                    titleFont: {
                        weight: "normal",
                        family: "Montserrat",
                    },
                    footerFont: {
                        weight: "normal",
                        family: "Montserrat",
                        style: "italic",
                    },
                    
                    titleMarginBottom: 12,
                    footerMarginTop: 10,

                    displayColors: false,
                    // bodyColor: `lighten(${labelColor.value}, 10%)`,
                    borderColor: (val) => {
                        try {
                            const [context] = val.tooltipItems;

                            const { dataset } = context;
                            const { pointBackgroundColor } = dataset;
                            return pointBackgroundColor;
                        } catch {
                            return "";
                        }
                    },
                    borderWidth: 3,
                },
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
                        display: true,
                        align: "inner",
                        maxRotation: 0,
                        minRotation: 0,

                        padding: 0,
                        autoSkip: false,

                        callback: (e) => {
                            const numDataPoints =
                                props.data.datasets[0].data.length;
                            if (e !== 0 && e !== numDataPoints - 1) return "";
                            const { start_time } =
                                props.data.datasets[0].data[e].data;
                            return dayjs(start_time).format("MMM DD");
                        },
                    },
                },
                y: {
                    border: {
                        display: false,
                    },
                    grid: {
                        display: false,
                    },
                    min: props.calculateMinMax ? min.value : 0,
                    max: props.calculateMinMax ? max.value : 100,

                    position: "right",

                    ticks: {
                        //   stepSize: 100 - 0,
                        callback: (e, e2, e3) => {
                            return `${e}${props.percent ? "%" : ""}`;
                        },

                        padding: 0,

                        mirror: true,
                        z: 100,
                        color: "rgba(0,0,0,0.8)",
                        textStrokeColor: "white",
                        backdropColor: "rgba(0,0,0,0.3)",
                        // showLabelBackdrop: true,
                    },
                },
            },
        },
    });

    Object.seal(chart.value);

    loading.value = false;
    triggerAnnotationAnimation();
});

const min = ref(0);
const max = ref(0);

const getMinMax = () => {
    const allData = props.data?.datasets?.reduce((all, { data }) => {
        return [...all, ...data.map(({ y }) => y)];
    }, []);

    max.value = Number.parseFloat(Math.max(...allData).toFixed(2));
    min.value = Number.parseFloat(Math.min(...allData).toFixed(2));
};
</script>
