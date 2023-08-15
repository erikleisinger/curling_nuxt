<template>
    <ChartContainer @swipe="onSwipe" :index="index">
        <template v-slot:title>{{ TITLES[index] }}</template>
        <template v-slot:subtitle>{{ DESCRIPTIONS[index] }}</template>
        <template v-slot:card
            ><StatsAggregateCard :score="gamesCount"
        /></template>

        <div v-if="index === 0" key="chart-1" class="chart__container">
            <canvas ref="chart1" />
        </div>
        <div v-if="index === 1" key="chart-1">Stats 2</div>
    </ChartContainer>
</template>
<style lang="scss" scoped>
.chart__container {
    margin-top: 0%;
}
</style>
<script setup>
import Chart from "chart.js/auto";

const props = defineProps({
    teamId: Number,
});

const index = ref(0);

const TITLES = ["Games played", "Title 2"];

const DESCRIPTIONS = ["", "It changed!"];
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

const chartData = ref([
    {
        value: 0,
        percent: 0,
    },
    {
        value: 0,
        percent:0
    },
    {
        value:0,
        percent:0
    }
])

const gamesCount = ref(0)

const getWinsLossess = async () => {
    const { client, fetchHandler } = useSupabaseFetch();
    const { data } = await fetchHandler(
        () =>
            client.rpc("get_team_wins", {
                team_id_param: props.teamId,
            }),
        { onError: "Error fetching data" }
    );

    const {wins, losses, ties} = data;

    chartData.value = [
        {
            value: wins,
            percent: wins / (wins + losses + ties) * 100
        },
        {
            value: ties,
            percent: ties / (wins + losses + ties) * 100
        },
        {
            value: losses,
            percent: losses / (wins + losses + ties) * 100
        }
    ];

    gamesCount.value = wins + losses + ties;
    
};

onMounted(async () => {
    const client = useSupabaseClient();
    const { data } = await client.rpc("get_team_game_statistics", {
        team_id_param: props.teamId,
    });

    await getWinsLossess();

    
    console.log("got data: ", data);

    var chart = new Chart(chart1.value, {
        type: "doughnut",
           data: {
            
            labels: ['Win', 'Draw', 'Loss'],
            datasets: [{

                data: chartData.value,
                backgroundColor: [
                   
                   '#8DE969',
                   'rgba(159, 90, 253, 1)',
                   '#EE6055'
                ],
                borderAlign: 'inner',
                borderColor: [
                    'rgba(255, 255, 255 ,1)',
                ],
                borderJoinStyle: 'miter',
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
                        innerStart: 16
                    }
                ],
                borderWidth: 2
                
            }]

        },
        options: {
            maintainAspectRatio: false,
            aspectRatio: 3/2,
            elements: {
                arc: [
                    {
                        borderRadius: 16,
                    }
                ]
                
            },
            plugins: {
                legend: {
                    display:true,
                    align: 'center',
                    labels: {
                        
                        font: {
                            size: 16,
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        // pointStyleWidth: 40,
                        useBorderRadius: true,
                        borderRadius: 50,
                    },
                    position: 'bottom',
                },
                tooltip: {
                    usePointStyle: true,
                    callbacks: {
                        label: (val) => {
                            const {raw, parsed} = val;
                            return `${parsed} games - ${raw.percent}%`
                        }
                    }
                }
            },
            cutout: '85%',
            radius: '50%',
            position: 'right',
            rotation: -90,
            circumference: 180,
            animation: {
                animateScale: true,
            }
        },
    });
});
</script>
