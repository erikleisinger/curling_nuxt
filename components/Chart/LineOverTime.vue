<template>
    <div :style="`height: ${height}`">
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
        getMinMax()

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
            layout: {
                padding: {
                    left: 0,
                    top: 0
                }
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
                    min: min.value,
                    max: max.value,
                  
                    position: 'right',
                   
                
                    ticks: {
                          stepSize: max.value - min.value,
                        callback: (e, e2, e3) => {
                            return `${e}%`;
                        },

                        padding: 0,
                        
                        mirror: true,
                        z: 100,
                        color: 'rgba(0,0,0,0.8)',
                         textStrokeColor: 'white',
                    backdropColor: 'rgba(0,0,0,0.3)',
                    // showLabelBackdrop: true,
                        
                    },
                },
            },
        },
    });

    Object.seal(chart.value);

    loading.value = false;
  
});

const min = ref(0);
const max = ref(0)

const getMinMax = () => {

    const allData = ((props.data?.datasets && props?.data?.datasets[0]?.data) ?? []).map(({y}) => y)

    
    max.value = Number.parseFloat((Math.max(...allData)).toFixed())
      min.value = Number.parseFloat((Math.min(...allData)).toFixed())



}
</script>
