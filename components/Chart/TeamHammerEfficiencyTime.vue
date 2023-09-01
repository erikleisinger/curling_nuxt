<template>
    <ChartLineOverTime v-if="!loading" v-bind="chartProps"/>
</template>

<script setup>

const props = defineProps({
    teamId: Number,
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

onMounted(async () => {
    loading.value = true;
    await getTeamStats();
    chartProps.value = getHammerConversionOverTime();
    setTimeout(() => {
   loading.value = false;
    }, 200)
 
})

    const getHammerConversionOverTime = () => {
    const reversed = allData.value.reverse();
    const conversions = {
        label: "Hammer conversion",
        data: reversed.map((d, index) => ({
            x: index,
            y: (d.hammer_conversion_count / d.hammer_end_count) * 100,
            data: {
                start_time: d.games?.start_time,
                hammer_conversion_count: d.hammer_conversion_count,
                hammer_end_count: d.hammer_end_count,
            },
        })),
    };

    const steals = {
        label: "Steals conceded",
        data: reversed.map((d, index) => ({
            x: index,
            y: (d.hammer_steal_count / d.hammer_end_count) * 100,
            data: {
                start_time: d.games?.start_time,
                hammer_steal_count: d.hammer_steal_count,
                hammer_end_count: d.hammer_end_count,
            },
        })),
    };

    const forces = {
        label: "Forced ends",
        data: reversed.map((d, index) => ({
            x: index,
            y: (d.hammer_force_count / d.hammer_end_count) * 100,
            data: {
                start_time: d.games?.start_time,
                hammer_force_count: d.hammer_force_count,
                hammer_end_count: d.hammer_end_count,
            },
        })),
    };

    const blanks = {
        label: "Blank ends",
        data: reversed.map((d, index) => ({
            x: index,
            y: (d.hammer_blank_count / d.hammer_end_count) * 100,
            data: {
                start_time: d.games?.start_time,
                hammer_blank_count: d.hammer_blank_count,
                hammer_end_count: d.hammer_end_count,
            },
        })),
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

    const hammerConversionAvg = getConversionAverage();
    const hammerForceAvg = getForceAverage();
    const hammerStealAvg = getStealAverage();
    const hammerBlankAvg = getBlankAverage()

    return {
        annotations: {
            conversion: {
                yMin: hammerConversionAvg,
                yMax: hammerConversionAvg,
                borderColor: "#9ad0f5",
                borderWidth: 2,
                borderDash: [6,6],
                type: "line",
                label: {
                    display: true,
                    content: `Avg: ${hammerConversionAvg.toFixed(1)}%`,
                    color: "rgba(0,0,0,0.6)",
                    backgroundColor: 'rgba(0,0,0,0)',
                    yAdjust: -7,
                    enabled: true,
                }
            },
            force: {
                yMin: hammerForceAvg,
                yMax: hammerForceAvg,
                borderColor: "#ffcf9f",
                borderWidth: 2,
                borderDash: [6,6],
                type: "line",
                label: {
                    display: true,
                    content: `Avg: ${hammerForceAvg.toFixed(1)}%`,
                    color: "rgba(0,0,0,0.6)",
                    backgroundColor: 'rgba(0,0,0,0)',
                    yAdjust: -7,
                    enabled: true,
                }
            },
            steal: {
                yMin: hammerStealAvg,
                yMax: hammerStealAvg,
                borderColor: "#ffb1c1",
                borderWidth: 2,
                borderDash: [6,6],
                type: "line",
                label: {
                    display: true,
                    content: `Avg: ${hammerStealAvg.toFixed(1)}%`,
                    color: "rgba(0,0,0,0.6)",
                    backgroundColor: 'rgba(0,0,0,0)',
                    yAdjust: -7,
                    enabled: true,
                }
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
                    content: `Avg: ${hammerBlankAvg.toFixed(1)}%`,
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
            datasets: [conversions, steals, forces, blanks],
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
                            2: `${data.hammer_force_count}/${
                                data.hammer_end_count
                            } ends (${(
                                (data.hammer_force_count /
                                    data.hammer_end_count) *
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