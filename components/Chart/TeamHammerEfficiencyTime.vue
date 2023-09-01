<template>
    <ChartLineOverTime v-if="!loading" v-bind="chartProps"/>
</template>

<script setup>
import {BADGE_TITLES_PLAIN} from '@/constants/badges'
import {watchDebounced} from '@vueuse/core'

const props = defineProps({
    teamId: Number,
    visibleStats: Array,
})

const allData = ref([])

const getTeamStats = async () => {
    const {data} =  await useSupabaseClient().from('team_stats').select(`
    *,
    games:game_id (
        start_time
    )
    `).eq('team_id', props.teamId)

    const dayjs = useDayjs();

    allData.value = data.sort((a,b) => dayjs(a.games?.start_time).unix() - dayjs(b?.games?.start_time).unix())
}

const chartProps = ref({})
const loading = ref(false)

const initChart = () => {
 loading.value = true;
 chartProps.value = getHammerConversionOverTime();
   setTimeout(() => {
   loading.value = false;
    }, 200)
}

onMounted(async () => {
     loading.value = true;
    await getTeamStats();
    initChart();
 
})


watchDebounced(() => props.visibleStats, async () => {
initChart();
   
    
  
}, {debounce: 200, immediate: false, deep: true})

    const getHammerConversionOverTime = () => {
    const reversed = allData.value.reverse();
    const conversions = {
        label: BADGE_TITLES_PLAIN.efficiency,
        data: reversed.map((d, index) => ({
            x: index,
            y: (d.hammer_conversion_count / d.hammer_end_count) * 100,
            data: {
                start_time: d.games?.start_time,
                hammer_conversion_count: d.hammer_conversion_count,
                hammer_end_count: d.hammer_end_count,
            },
        })),
        backgroundColor: 'rgba(156, 39, 176, 0.3)',
        borderColor: 'rgba(156, 39, 176, 1)',
        hidden: !props.visibleStats.includes(BADGE_TITLES_PLAIN.efficiency),
    };

    const steals = {
        label: BADGE_TITLES_PLAIN.bandit,
        data: reversed.map((d, index) => ({
            x: index,
            y: (d.hammer_steal_count / d.hammer_end_count) * 100,
            data: {
                start_time: d.games?.start_time,
                hammer_steal_count: d.hammer_steal_count,
                hammer_end_count: d.hammer_end_count,
            },
        })),
        borderColor: 'rgba(244, 67, 54, 1)',
        backgroundColor: 'rgba(244, 67, 54, 0.3)',
        hidden: !props.visibleStats.includes(BADGE_TITLES_PLAIN.bandit),
    };

    const forces = {
        label: BADGE_TITLES_PLAIN.bulwark,
        data: reversed.map((d, index) => ({
            x: index,
            y: (d.non_hammer_force_count / d.non_hammer_end_count) * 100,
            data: {
                start_time: d.games?.start_time,
                non_hammer_force_count: d.non_hammer_force_count,
                non_hammer_end_count: d.non_hammer_end_count,
            },
        })),
        borderColor: 'rgba(33, 150, 243, 1)',
        backgroundColor: 'rgba(33, 150, 243, 0.3)',
        hidden: !props.visibleStats.includes(BADGE_TITLES_PLAIN.bulwark),
    };

    const blanks = {
        label:  BADGE_TITLES_PLAIN.minimalist,
        data: reversed.map((d, index) => ({
            x: index,
            y: (d.hammer_blank_count / d.hammer_end_count) * 100,
            data: {
                start_time: d.games?.start_time,
                hammer_blank_count: d.hammer_blank_count,
                hammer_end_count: d.hammer_end_count,
            },
        })),
        borderColor: 'rgba(0, 131, 143, 1)',
        backgroundColor: 'rgba(0, 131, 143, 0.3)',
        hidden: !props.visibleStats.includes(BADGE_TITLES_PLAIN.minimalist),
    };

    const hammerForces = {
        label: BADGE_TITLES_PLAIN.survivalist,
        data: reversed.map((d, index) => ({
            x: index,
            y: (d.hammer_force_count / d.hammer_end_count) * 100,
            data: {
                start_time: d.games?.start_time,
                hammer_force_count: d.hammer_force_count,
                hammer_end_count: d.hammer_end_count,
            },
        })),
        borderColor: 'rgba(27, 94, 32, 1)',
        backgroundColor: 'rgba(27, 94, 32, 0.3)',
        hidden:!props.visibleStats.includes(BADGE_TITLES_PLAIN.survivalist),
    };

     const hammerFirstEnd = {
        label: BADGE_TITLES_PLAIN.firstend,
        data: reversed.map((d, index) => ({
            x: index,
            y: (d.hammer_first_end_count / allData.value.length) * 100,
            data: {
                start_time: d.games?.start_time,
                hammer_first_end_count: d.hammer_first_end_count,
                hammer_end_count: allData.value.length,
            },
        })),
        borderColor: 'rgba(255, 235, 59, 1)',
        backgroundColor: 'rgba(255, 235, 59, 0.3)'
    };

      const hammerLastEnd = {
        label: BADGE_TITLES_PLAIN.firstend,
        data: reversed.map((d, index) => ({
            x: index,
            y: (d.hammer_last_end_count / 1) * 100,
            data: {
                start_time: d.games?.start_time,
                hammer_last_end_count: d.hammer_last_end_count,
                hammer_end_count: allData.value.length,
            },
        })),
        borderColor: 'rgba(233, 30, 99, 1)',
        backgroundColor: 'rgba(233, 30, 99, 0.3)'
    };

    const { format, toTimezone } = useTime();

    const getPointData = ([d]) => {
        const point = d.dataset.data[d.dataIndex];
        const { data } = point;

        return data;
    };

    const getConversionAverage = () => {
        const { hammer_end_count, hammer_conversion_count } = reversed.reduce(
            (all, current) => {
                return {
                    hammer_end_count:
                        all.hammer_end_count + current.hammer_end_count,
                    hammer_conversion_count:
                        all.hammer_conversion_count +
                        current.hammer_conversion_count,
                };
            },
            { hammer_end_count: 0, hammer_conversion_count: 0 }
        );

        return (hammer_conversion_count / hammer_end_count) * 100;
    };

    
    const getForceAverage = () => {
        const { non_hammer_end_count, non_hammer_force_count } = reversed.reduce(
            (all, current) => {
                return {
                    non_hammer_end_count:
                        all.non_hammer_end_count + current.non_hammer_end_count,
                    non_hammer_force_count:
                        all.non_hammer_force_count +
                        current.non_hammer_force_count,
                };
            },
            { non_hammer_end_count: 0, non_hammer_force_count: 0 }
        );

        return (non_hammer_force_count / non_hammer_end_count) * 100;
    };

     const getStealAverage = () => {
        const { hammer_end_count, hammer_steal_count } = reversed.reduce(
            (all, current) => {
                return {
                    hammer_end_count:
                        all.hammer_end_count + current.hammer_end_count,
                    hammer_steal_count:
                        all.hammer_steal_count +
                        current.hammer_steal_count,
                };
            },
            { hammer_end_count: 0, hammer_steal_count: 0 }
        );

        return (hammer_steal_count / hammer_end_count) * 100;
    };
      const getBlankAverage = () => {
        const { hammer_end_count, hammer_blank_count } = reversed.reduce(
            (all, current) => {
                return {
                    hammer_end_count:
                        all.hammer_end_count + current.hammer_end_count,
                    hammer_blank_count:
                        all.hammer_blank_count +
                        current.hammer_blank_count,
                };
            },
            { hammer_end_count: 0, hammer_blank_count: 0 }
        );

        return (hammer_blank_count / hammer_end_count) * 100;
    };

        const getHammerForceAverage = () => {
        const { hammer_end_count, hammer_force_count } = reversed.reduce(
            (all, current) => {
                return {
                    hammer_end_count:
                        all.hammer_end_count + current.hammer_end_count,
                    hammer_force_count:
                        all.hammer_force_count +
                        current.hammer_force_count,
                };
            },
            { hammer_end_count: 0, hammer_force_count: 0 }
        );

        return (hammer_force_count / hammer_end_count) * 100;
    };

           const getHammerFirstEndAverage = () => {
        const { hammer_first_end_count } = reversed.reduce(
            (all, current) => {
                return {
                    hammer_first_end_count:
                        all.hammer_first_end_count +
                        current.hammer_first_end_count,
                };
            },
            { hammer_first_end_count: 0 }
        );

        return (hammer_first_end_count / 1) * 100;
    };

    const hammerConversionAvg = getConversionAverage();
    const nonHammerForceAvg = getForceAverage();
    const hammerStealAvg = getStealAverage();
    const hammerBlankAvg = getBlankAverage()
    const hammerForceAvg = getHammerForceAverage()
    const hammerFirstEndAvg = getHammerFirstEndAverage();

    return {
        annotations: {
            conversion: {
                yMin: hammerConversionAvg,
                yMax: hammerConversionAvg,
                borderColor: "rgba(156, 39, 176, 0.3)",
                borderWidth: 2,
                borderDash: [6,6],
                type: "line",
                label: {
                    display: true,
                    content: `${BADGE_TITLES_PLAIN.efficiency} avg: ${hammerConversionAvg.toFixed(1)}%`,
                    color: "rgba(0,0,0,0.6)",
                    backgroundColor: 'rgba(0,0,0,0)',
                    yAdjust: -7,
                    enabled: true,
                },
                display: (e) => {
                    if (e.chart) {
                        return e.chart.getDatasetMeta(0)?.visible
                    } 
                    return true;
                },
            },
            force: {
                yMin: nonHammerForceAvg,
                yMax: nonHammerForceAvg,
                borderColor: "rgba(33, 150, 243, 0.3)",
                borderWidth: 2,
                borderDash: [6,6],
                type: "line",
                label: {
                    display: true,
                    content: `${BADGE_TITLES_PLAIN.bulwark} avg: ${nonHammerForceAvg.toFixed(1)}%`,
                    color: "rgba(0,0,0,0.6)",
                    backgroundColor: 'rgba(0,0,0,0)',
                    yAdjust: -7,
                    enabled: true,
                },
                display: (e) => {
                    if (e.chart) {
                        return e.chart.getDatasetMeta(2)?.visible
                    } 
                    return true;
                },
            },
            steal: {
                yMin: hammerStealAvg,
                yMax: hammerStealAvg,
                borderColor: "rgba(244, 67, 54, 0.3)",
                borderWidth: 2,
                borderDash: [6,6],
                type: "line",
                label: {
                    display: true,
                    content: `${BADGE_TITLES_PLAIN.bandit} avg: ${hammerStealAvg.toFixed(1)}%`,
                    color: "rgba(0,0,0,0.6)",
                    backgroundColor: 'rgba(0,0,0,0)',
                    yAdjust: -7,
                    enabled: true,
                },
                display: (e) => {
                    if (e.chart) {
                        return e.chart.getDatasetMeta(1)?.visible
                    } 
                    return true;
                },
            },
            blank: {
                yMin: hammerBlankAvg,
                yMax: hammerBlankAvg,
                borderColor: "#ffe6aa ",
                borderWidth: 2,
                borderDash: [6,6],
                type: "line",
                label: {
                    display: true,
                    content: `${BADGE_TITLES_PLAIN.minimalist} avg: ${hammerBlankAvg.toFixed(1)}%`,
                    color: "rgba(0,0,0,0.6)",
                    backgroundColor: 'rgba(0,0,0,0)',
                    yAdjust: -7,
                    enabled: true,
                },
                display: (e) => {
                    if (e.chart) {
                        return e.chart.getDatasetMeta(3)?.visible
                    } 
                    return true;
                },
            },
           hammerForce: {
                yMin: hammerForceAvg,
                yMax: hammerForceAvg,
                borderColor: "rgba(27, 94, 32, 0.3)",
                borderWidth: 2,
                borderDash: [6,6],
                type: "line",
                label: {
                    display: true,
                    content: `${BADGE_TITLES_PLAIN.survivalist} avg: ${hammerForceAvg.toFixed(1)}%`,
                    color: "rgba(0,0,0,0.6)",
                    backgroundColor: 'rgba(0,0,0,0)',
                    yAdjust: -7,
                    enabled: true,
                },
                display: (e) => {
                    if (e.chart) {
                        return e.chart.getDatasetMeta(4)?.visible
                    } 
                    return true;
                },
            },
            hammerFirstEnd: {
                yMin: hammerFirstEndAvg,
                yMax: hammerFirstEndAvg,
                borderColor: "rgba(255, 235, 59, 0.3)",
                borderWidth: 2,
                borderDash: [6,6],
                type: "line",
                label: {
                    display: true,
                    content: `Hammer first end avg: ${hammerFirstEndAvg.toFixed(1)}%`,
                    color: "rgba(0,0,0,0.6)",
                    backgroundColor: 'rgba(0,0,0,0)',
                    yAdjust: -7,
                    enabled: true,
                }
            },
        },
        data: {
            labels: allData.value.map(({ games }) =>
                format(toTimezone(games.start_time))
            ),
            datasets: [conversions, steals, forces, blanks, hammerForces],
        },
        tooltip: {
            callbacks: {
                afterTitle: () => {
                    return `vs. team name`;
                },
                label: (d) => {
                    const data = getPointData([d]);
                    return (
                        {
                            0: `${data.hammer_conversion_count}/${
                                data.hammer_end_count
                            } ends (${(
                                (data.hammer_conversion_count /
                                    data.hammer_end_count) *
                                100
                            ).toFixed(1)}%)`,
                            1: `${data.hammer_steal_count}/${
                                data.hammer_end_count
                            } ends (${(
                                (data.hammer_steal_count /
                                    data.hammer_end_count) *
                                100
                            ).toFixed(1)}%)`,
                            2: `${data.non_hammer_force_count}/${
                                data.non_hammer_end_count
                            } ends (${(
                                (data.non_hammer_force_count /
                                    data.non_hammer_end_count) *
                                100
                            ).toFixed(1)}%)`,
                            3: `${data.hammer_blank_count}/${
                                data.hammer_end_count
                            } ends (${(
                                (data.hammer_blank_count /
                                    data.hammer_end_count) *
                                100
                            ).toFixed(1)}%)`,
                        }[d.datasetIndex] || "no label"
                    );
                },
                title: (d) => {
                    const data = getPointData(d);
                    return `${toTimezone(data.start_time, "MMM DD YYYY")}`;
                },
            },
        },
    };
};


// hammerConversionProps.value = getHammerConversionOverTime();
</script>