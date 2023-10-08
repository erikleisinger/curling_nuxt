<template>
    <div :style="`height: ${height}; width: 100%; position: relative`">
        <!-- <div class="ticks__container column justify-between items-center">
            <div  class="full-width text-center" style="margin-top: -0.5em">{{max}}%</div>
            <div  class="full-width text-center" style="margin-bottom: -0.5em">{{min}}%</div>
        </div> -->
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
    border-right: 1px solid rgba(0,0,0,0.5);
 
    mix-blend-mode: multiply;
}
</style>
<script setup>
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";

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

const chart = ref(null);
let myChart;

const loading = ref(true);

const dayjs = useDayjs();

onMounted(async () => {
    const annotations = { ...props.annotations };
    const data = { ...props.data };
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
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 16,
                    },
                },
                tooltip: {
                    ...tooltip,
                    mode: 'nearest'
                }
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
                        align: 'inner',
                        maxRotation: 0,
                        minRotation:0,
                        
                        padding: 0,
                        autoSkip: false,
                        callback: (e) => {                       
                            const numDataPoints = props.data.datasets[0].data.length
                            if (e !== 0 && e!== numDataPoints - 1) return ''
                            const {start_time} = props.data.datasets[0].data[e].data
                            return dayjs(start_time).format('MMM DD')
                            
                          
                            
                        },
                        
                    }
                   
                },
                y: {
                    border: {
                        display: false,
                    },
                    grid: {
                        display: false,
                    },
                    min: 0,
                    //max: 100,
                    position: 'right',
                
                    ticks: {
                        callback: (e, e2, e3) => {
                            return `${e}%`;
                        },
                        padding: 0,
                        // display: false,
                    },
                },
            },
        },
    });

    Object.seal(chart.value);
    getMinMax()
    loading.value = false;
  
});

const min = ref(0);
const max = ref(0)

const getMinMax = () => {
    const {scales} = myChart || {};
    const {y} = scales || {};
    const {min:chartMin, max:chartMax} = y || {};
    min.value = chartMin ?? 0
    max.value = chartMax ?? 0


}
</script>
