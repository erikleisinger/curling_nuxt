<template>
    <div :style="`height: ${height}`">
        <div class="floating text-bold" :style="titlePosition" id="line-chart-annotation">
            <slot name="annotation"/>
        </div>
        <canvas ref="chart" id="canvas" />
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
    font-size: var(--text-lg);
    margin: var(--space-lg);
     @include sm {
        margin: var(--space-lg)
    }
    margin-right: var(--space-xl);
    color: v-bind(labelColor);
    width: fit-content;
  

    h3 {
        font-weight: bold;
        line-height: 0.8em;
    }
    h4 {
        font-size: var(--text-xs);
        font-style: italic;
        color: black!important;
    }
}
</style>
<script setup>
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";
import gsap from 'gsap'

const $q = useQuasar();


Chart.register(annotationPlugin);

const props = defineProps({
    annotations: Object,
    height: {
        type: String,
        default: "100%",
    },
    data: Object,
    ticks: Object,
    tooltip: Object,
});

const triggerAnnotationAnimation = () => {
    const tl = gsap.timeline();
    tl.from(document.querySelector('#line-chart-annotation').querySelector('h3'), {
        x: Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1),
        y: Math.ceil(Math.random() * 99) * (Math.round(Math.random()) ? 1 : -1),
        opacity: 0,
        duration: 0.5,
        delay: 0.3,
        ease: 'power2'
    })
    tl.from(document.querySelector('#line-chart-annotation').querySelector('h4'), {
        transformOrigin: 'top',
        scaleY: 0,
        duration: 0.1,
        ease: 'power2'
    })
}

const chart = ref(null);
let myChart;

const loading = ref(true);

const dayjs = useDayjs();

const label = computed(() => props.data.datasets[0].label);
const labelColor = computed(() => props.data.datasets[0].borderColor);
const cumulativeAvg = computed(() =>
    props.data.datasets[0].data[
        props.data.datasets[0].data.length - 1
    ]?.y.toFixed(2)
);

const titlePosition = computed(() => {
    const obj = {};

    const firstPoint = props.data.datasets[0].data[0]?.y;
    const midPoint =
        props.data.datasets[0].data[
            Math.ceil(props.data.datasets[0].data.length / 2)
        ]?.y;
    const lastPoint =
        props.data.datasets[0].data[props.data.datasets[0].data.length - 2]?.y;
    const maxPoint = Math.max(
        ...[...props.data.datasets[0].data]
            .splice(0, props.data.datasets[0].data.length - 1)
            .map(({ y }) => y)
    );

    const threshholdY = 60
    if (maxPoint < threshholdY) {
        if (firstPoint < threshholdY && lastPoint < threshholdY && midPoint < threshholdY) {
            return {
                top: 0,
                left: 0,
                right: 0,
                margin: "auto",
                'margin-top': $q.screen.xs ? 'var(--space-md)' : 'var(--space-lg)',
            }
        }
        if (maxPoint < lastPoint) {
            if (firstPoint < lastPoint) {
return {
                left: 0,
                top: 0,
            };
            } else {
                return {
                right: 0,
                top: 0,
            };
            }
            
        } else {
            return {
                right: 0,
                top: 0,
            };
        }
    }
    if (maxPoint >= threshholdY) {
        if (midPoint < threshholdY - 10 && lastPoint < threshholdY - 10) {
            return {
                top: 0,
                right: 0,
            }
        }
        if (firstPoint < lastPoint) {
return {
            bottom: 0,
            right: 0,
        };
        }
        return {
            bottom: 0,
            left: 0,
        };
        
    }

    return obj;
});

onMounted(async () => {
    console.log(props.height)
    getMinMax();
    const annotations = { ...props.annotations };
    const data = {...props.data, datasets: props.data.datasets.map((d) => ({
        ...d,
        pointStyle: 'circle',
        pointRadius: 3,
        pointHitRadius: 15,
        pointBackgroundColor: d.borderColor,
    }))}

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
                    borderWidth: 5,
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
                        weight: 'bold',
                         family: 'Montserrat',
                         lineHeight: 0.5,
                    },
                    titleFont: {
                        weight: 'normal',
                         family: 'Montserrat',
                        
                         
                    },
                    footerFont: {
                        weight: 'normal',
                        family: 'Montserrat',
                        style: 'italic'
                    },
                    titleMarginBottom: 12,
                    footerMarginTop: 10,
      
                    displayColors: false,
                    bodyColor: `lighten(${labelColor.value}, 10%)`,
                    borderColor: labelColor.value,
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
                    min: 0,
                    max: 100,

                    position: "right",

                    ticks: {
                        //   stepSize: 100 - 0,
                        callback: (e, e2, e3) => {
                            return `${e}%`;
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
    const allData = (
        (props.data?.datasets && props?.data?.datasets[0]?.data) ??
        []
    ).map(({ y }) => y);

    max.value = Number.parseFloat(Math.max(...allData).toFixed());
    min.value = Number.parseFloat(Math.min(...allData).toFixed());
};
</script>
