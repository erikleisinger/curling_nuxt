<template>
    <div class="line-chart__container" ref="linechart">
        <q-inner-loading :showing="loading || updating" color="primary" />
        <ChartLineOverTime
            v-if="!loading"
            v-bind="chartProps"
            height="calc(100% - 50px)"
            @chart="setChart"
        >
            <div class="row justify-between chart-options__container no-wrap">
                <div class="row full-width">
                    <div class="row justify-between full-width">
                        <q-btn
                            icon="chevron_left"
                            flat
                            round
                            size="sm"
                            @click="changeStat(-1)"
                            :style="{
                                visibility:
                                    currentIndex === 0 ? 'hidden' : 'visible',
                            }"
                        />
                        <div class="column">
                            <h1 class="text-md text-bold">
                                {{ options[currentIndex].title }}
                            </h1>
                        </div>
                        <q-btn
                            icon="chevron_right"
                            flat
                            round
                            size="sm"
                            @click="changeStat(+1)"
                            :style="{
                                visibility:
                                    currentIndex >= options.length - 1
                                        ? 'hidden'
                                        : 'visible',
                            }"
                        />
                    </div>
                </div>
            </div>
        </ChartLineOverTime>
   <!-- <ChartTeamStatsTimeEfficiency :teamId="teamId"/> -->
   
    </div>
</template>
<style lang="scss" scoped>
.line-chart__container {
    width: 100%;
    height: 100%;
    .chart-options__container {
        height: 100%;
        width: 100%;
        padding: var(--space-sm);
        padding-bottom: 0px;
    }
    .legend__container {
        padding: 0px var(--space-sm);
    }
}
</style>
<script setup>
import {
    BADGE_COLORS,
    BADGE_TITLES_PLAIN,
    BADGE_TITLE_CONVERT,
} from "@/constants/badges";
import { useUserTeamStore } from "@/store/user-teams";
import TeamStats from '@/store/models/team-stats'

const {setBgGradient} = useColor();

const props = defineProps({
    teamId: Number,
    visibleStats: Array,
});

const linechart = ref(null);

const currentIndex = ref(0);
const swipeStart = ref(null);

const changeStat = (inc) => {
    if (
        currentIndex.value + inc < 0 ||
        currentIndex.value + inc > options.length - 1
    )
        return;
    setActiveStat(currentIndex.value, currentIndex.value + inc);
    currentIndex.value += inc;
    visibleItems.value = [options[currentIndex.value + inc].title];
};

const setActiveStat = (currentIndex, newIndex) => {
    chart.setDatasetVisibility(newIndex, true);
    chart.setDatasetVisibility(currentIndex, false);

    chart.update("active");
};



const emit = defineEmits(["close"]);

const $q = useQuasar();

const showAverages = ref(true);

const TENSION = 0.4;

const options = [
    {
        color: BADGE_COLORS.efficiency,
        title: BADGE_TITLES_PLAIN.efficiency,
        visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.efficiency),
    },
    {
        color: BADGE_COLORS.bandit,
        title: BADGE_TITLES_PLAIN.bandit,
        visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.bandit),
    },
    {
        color: BADGE_COLORS.bulwark,
        title: BADGE_TITLES_PLAIN.bulwark,
        visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.bulwark),
    },
    {
        color: BADGE_COLORS.stealdefense,
        title: BADGE_TITLES_PLAIN.stealdefense,
        visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.stealdefense),
    },
    {
        color: BADGE_COLORS.minimalist,
        title: BADGE_TITLES_PLAIN.minimalist,
        visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.minimalist),
    },
    // {
    //     color: BADGE_COLORS.firstend,
    //     title: BADGE_TITLES_PLAIN.firstend,
    //     visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.firstend),
    // },
    // {
    //     color: BADGE_COLORS.strategist,
    //     title: BADGE_TITLES_PLAIN.strategist,
    //     visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.strategist),
    // },
];

const visibleItems = ref([options[0].title]);
// const visibleItems = computed(() => [options[currentIndex.value].title])

const toggleVisibility = (chart, index = 0) => {
    const { visible } = chart.getDatasetMeta(index);
    chart.setDatasetVisibility(index, !visible);
    chart.update("active");

    if (visible) {
        // Remove item from visible
        const arrayIndex = visibleItems.value.indexOf(options[index].title);
        visibleItems.value.splice(arrayIndex, 1);
    } else {
        visibleItems.value.push(options[index].title);
    }
};

const toggleAverageVisibility = (evt, chart) => {
    const { annotations } = getHammerConversionOverTime();
    chart.options.plugins.annotation.annotations = annotations;
    chart.update();
};

watch(
    () => props.visibleStats,
    (val) => {
        if (!chart || $q.screen.xs) return;
        visibleItems.value = val;
        const { data } = getHammerConversionOverTime();
        chart.data = data;
        chart.update();
    },
    { deep: true }
);

const allData = ref([]);

const dayjs = useDayjs();

const limitFilter = ref(null);
const rangeFilter = ref(null);

const getRange = (type) => {
    if (type === "week") {
        return {
            range_start_param: dayjs()
                .subtract(1, "week")
                .startOf("day")
                .format("YYYY-MM-DD HH:mm:ss"),
            range_end_param: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        };
    } else if (type === "month") {
        return {
            range_start_param: dayjs()
                .subtract(1, "month")
                .startOf("day")
                .format("YYYY-MM-DD HH:mm:ss"),
            range_end_param: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        };
    }
    return null;
};

const getTeamStats = async () => {
    const { data } = await useSupabaseClient().rpc("get_team_stats", {
        team_id_param: props.teamId,
        range_start_param: !rangeFilter.value
            ? null
            : getRange(rangeFilter.value)?.range_start_param,
        range_end_param: !rangeFilter.value
            ? null
            : getRange(rangeFilter.value)?.range_end_param,
        limit_param: limitFilter.value,
    });

    console.log(data)
    data.forEach((stat) => {
useRepo(TeamStats).save({
    ...stat,
    team_id: props.teamId
})
    })
    
    allData.value = data.reverse();
};

let chart;

const setChart = (c) => {
    chart = c;
};

const chartProps = ref({});
const loading = ref(true);

const initChart = () => {
    chartProps.value = getHammerConversionOverTime();
};

onMounted(async () => {
    loading.value = true;
    await getTeamStats();
    initChart();
    loading.value = false;
});

const updating = ref(false);

const setFilter = async (filterType, value, chart) => {
    if (updating.value) return;
    if (filterType === "limit") {
        if (limitFilter.value === value) {
            limitFilter.value = null;
        } else {
            limitFilter.value = value;
        }
    } else if (filterType === "range") {
        if (rangeFilter.value === value) {
            rangeFilter.value = null;
        } else {
            rangeFilter.value = value;
        }
    }
    updating.value = true;
    await getTeamStats();
    chart.data = getHammerConversionOverTime().data;
    chart.update();
    updating.value = false;
};



const getHammerConversionOverTime = () => {
    const { format, toTimezone } = useTime();

    const getPointData = ([d]) => {
        const point = d.dataset.data[d.dataIndex];
        const { data } = point;

        return data;
    };

    const team = useUserTeamStore().userTeams.find(
        ({ id }) => id === props.teamId
    );

    const hammerConversionAvg =
        (team.hammer_conversion_count / team.hammer_end_count) * 100;
    const nonHammerForceAvg =
        (team.non_hammer_force_count / team.non_hammer_end_count) * 100;
    const nonHammerStealAvg =
        (team.non_hammer_steal_count / team.non_hammer_end_count) * 100;
    const hammerStealDefenseAvg =
        (team.hammer_steal_count / team.hammer_end_count) * 100;
    const hammerBlankAvg =
        (team.hammer_blank_count / team.hammer_end_count) * 100;
    const hammerFirstEndAvg =
        (team.hammer_first_end_count / team.games_played) * 100;
    const hammerLastEndAvg =
        (team.hammer_last_end_count / team.games_played) * 100;

    const conversions = {
        label: BADGE_TITLES_PLAIN.efficiency,

        data: allData.value.map((d, index) => {
            const previous = [...allData.value].splice(0, index);
            previous.push({
                hammer_end_count: d.hammer_end_count,
                hammer_conversion_count: d.hammer_conversion_count,
                hammer_blank_count: d.hammer_blank_count,
            });

            const sums = previous.reduce(
                (
                    all,
                    {
                        hammer_end_count,
                        hammer_conversion_count,
                        hammer_blank_count,
                    }
                ) => {
                    return {
                        hammer_end_count:
                            all.hammer_end_count + hammer_end_count,
                        hammer_conversion_count:
                            all.hammer_conversion_count +
                            (hammer_conversion_count - hammer_blank_count),
                    };
                },
                {
                    hammer_end_count: 0,
                    hammer_conversion_count: 0,
                }
            );

            const y =
                (sums.hammer_conversion_count / sums.hammer_end_count) * 100;

            const all = previous.map(
                ({
                    hammer_conversion_count,
                    hammer_end_count,
                    hammer_blank_count,
                }) =>
                    (hammer_conversion_count /
                        (hammer_end_count - hammer_blank_count)) *
                    100
            );
            const max = Math.max(...all);

            return {
                x: index,
                y,
                data: {
                    start_time: d.start_time,
                    hammer_conversion_count: d.hammer_conversion_count,
                    hammer_end_count: d.hammer_end_count,
                    average: hammerConversionAvg,
                    max,
                },
            };
        }),
        backgroundColor: "rgba(156, 39, 176, 1)",
        borderColor: "rgba(156, 39, 176, 1)",
        backgroundColor: (context) => setBgGradient(context, "#9c27b0"),
        hidden: !visibleItems.value.includes(BADGE_TITLES_PLAIN.efficiency),
        tension: TENSION,
        fill: true,
        pointStyle: false,
    };

    const steals = {
        label: BADGE_TITLES_PLAIN.bandit,
        data: allData.value.map((d, index) => {
            const previous = [...allData.value].splice(0, index);
            previous.push({
                non_hammer_end_count: d.non_hammer_end_count,
                non_hammer_steal_count: d.non_hammer_steal_count,
            });

            const sums = previous.reduce(
                (all, { non_hammer_end_count, non_hammer_steal_count }) => {
                    return {
                        non_hammer_end_count:
                            all.non_hammer_end_count + non_hammer_end_count,
                        non_hammer_steal_count:
                            all.non_hammer_steal_count + non_hammer_steal_count,
                    };
                },
                {
                    non_hammer_end_count: 0,
                    non_hammer_steal_count: 0,
                }
            );

            const y =
                (sums.non_hammer_steal_count / sums.non_hammer_end_count) * 100;

            const all = previous.map(
                ({ non_hammer_steal_count, non_hammer_end_count }) =>
                    (non_hammer_steal_count / non_hammer_end_count) * 100
            );
            const max = Math.max(...all);

            return {
                x: index,
                y,
                data: {
                    start_time: d.start_time,
                    hammer_steal_count: d.hammer_steal_count,
                    hammer_end_count: d.hammer_end_count,
                    average: nonHammerStealAvg,
                    max,
                },
            };
        }),
        borderColor: "rgba(244, 67, 54, 1)",
        backgroundColor: "rgba(244, 67, 54, 1)",
        backgroundColor: (context) => setBgGradient(context, "#f44336"),
        hidden: !visibleItems.value.includes(BADGE_TITLES_PLAIN.bandit),
        tension: TENSION,
        pointStyle: false,
        fill: true,
    };

    const forces = {
        label: BADGE_TITLES_PLAIN.bulwark,
        data: allData.value.map((d, index) => {
            const previous = [...allData.value].splice(0, index);
            previous.push({
                non_hammer_end_count: d.non_hammer_end_count,
                non_hammer_force_count: d.non_hammer_force_count,
            });

            const sums = previous.reduce(
                (all, { non_hammer_end_count, non_hammer_force_count }) => {
                    return {
                        non_hammer_end_count:
                            all.non_hammer_end_count + non_hammer_end_count,
                        non_hammer_force_count:
                            all.non_hammer_force_count + non_hammer_force_count,
                    };
                },
                {
                    non_hammer_end_count: 0,
                    non_hammer_force_count: 0,
                }
            );

            const y =
                (sums.non_hammer_force_count / sums.non_hammer_end_count) * 100;

            const all = previous.map(
                ({ non_hammer_force_count, non_hammer_end_count }) =>
                    (non_hammer_force_count / non_hammer_end_count) * 100
            );
            const max = Math.max(...all);

            return {
                x: index,
                y,
                data: {
                    start_time: d.start_time,
                    non_hammer_force_count: d.non_hammer_force_count,
                    non_hammer_end_count: d.non_hammer_end_count,
                    average: nonHammerForceAvg,
                    max,
                },
            };
        }),
        borderColor: "rgba(33, 150, 243, 1)",
        // backgroundColor: "rgba(33, 150, 243, 1)",
        backgroundColor: (context) => setBgGradient(context, "#2196f3"),
        hidden: !visibleItems.value.includes(BADGE_TITLES_PLAIN.bulwark),
        pointStyle: false,

        tension: TENSION,
        fill: true,
    };

    const blanks = {
        label: BADGE_TITLES_PLAIN.minimalist,

        data: allData.value.map((d, index) => {
            const previous = [...allData.value].splice(0, index);
            previous.push({
                hammer_end_count: d.hammer_end_count,
                hammer_blank_count: d.hammer_blank_count,
            });

            const sums = previous.reduce(
                (all, { hammer_end_count, hammer_blank_count }) => {
                    return {
                        hammer_end_count:
                            all.hammer_end_count + hammer_end_count,
                        hammer_blank_count:
                            all.hammer_blank_count + hammer_blank_count,
                    };
                },
                {
                    hammer_end_count: 0,
                    hammer_blank_count: 0,
                }
            );

            const y = (sums.hammer_blank_count / sums.hammer_end_count) * 100;
            const all = previous.map(
                ({ hammer_blank_count, hammer_end_count }) =>
                    (hammer_blank_count / hammer_end_count) * 100
            );
            const max = Math.max(...all);

            return {
                x: index,
                y,
                data: {
                    start_time: d.start_time,
                    hammer_blank_count: d.hammer_blank_count,
                    hammer_end_count: d.hammer_end_count,
                    average: hammerBlankAvg,
                    max,
                },
            };
        }),
        borderColor: "rgba(0, 131, 143, 1)",
        backgroundColor: "rgba(0, 131, 143, 1)",
        backgroundColor: (context) => setBgGradient(context, "#00838f"),
        hidden: !visibleItems.value.includes(BADGE_TITLES_PLAIN.minimalist),
        tension: TENSION,
        fill: true,
        pointStyle: false,
    };

    const hammerFirstEnd = {
        label: BADGE_TITLES_PLAIN.firstend,
        data: allData.value.reduce((all, current, index) => {
            const runningHFECount =
                all.reduce((allHFE, currentHFE) => {
                    return allHFE + currentHFE.data.hammer_first_end_count;
                }, 0) + current.hammer_first_end_count;

            return [
                ...all,
                {
                    x: index,
                    y: (runningHFECount / (index + 1)) * 100,
                    data: {
                        start_time: current.start_time,
                        hammer_first_end_count: current.hammer_first_end_count,
                        hammer_end_count: index + 1,
                        average: hammerFirstEndAvg,
                    },
                },
            ];
        }, []),

        borderColor: "rgba(255, 235, 59, 1)",
        backgroundColor: "rgba(255, 235, 59, 1)",
        backgroundColor: (context) => setBgGradient(context, "#ffeb3b"),
        hidden: !visibleItems.value.includes(BADGE_TITLES_PLAIN.firstend),
        tension: TENSION,
        fill: true,
    };

    const hammerLastEnd = {
        label: BADGE_TITLES_PLAIN.strategist,
        data: allData.value.reduce((all, current, index) => {
            const runningHLECount =
                all.reduce((allHLE, currentHLE) => {
                    return allHLE + currentHLE.data.hammer_last_end_count;
                }, 0) + current.hammer_last_end_count;

            return [
                ...all,
                {
                    x: index,
                    y: (runningHLECount / (index + 1)) * 100,
                    data: {
                        start_time: current.start_time,
                        hammer_last_end_count: current.hammer_last_end_count,
                        hammer_end_count: index + 1,
                        average: hammerLastEndAvg,
                    },
                },
            ];
        }, []),
        borderColor: "rgba(233, 30, 99, 1)",
        backgroundColor: "rgba(233, 30, 99, 1)",
        backgroundColor: (context) => setBgGradient(context, "#e91e63"),
        hidden: !visibleItems.value.includes(BADGE_TITLES_PLAIN.strategist),
        tension: TENSION,
        fill: true,
        pointStyle: false,
    };

    const stealDefense = {
        label: BADGE_TITLES_PLAIN.stealdefense,

        data: allData.value.map((d, index) => {
            const previous = [...allData.value].splice(0, index);
            previous.push({
                hammer_end_count: d.hammer_end_count,
                hammer_steal_count: d.hammer_steal_count,
            });

            const sums = previous.reduce(
                (all, { hammer_end_count, hammer_steal_count }) => {
                    return {
                        hammer_end_count:
                            all.hammer_end_count + hammer_end_count,
                        hammer_steal_count:
                            all.hammer_steal_count + hammer_steal_count,
                    };
                },
                {
                    hammer_end_count: 0,
                    hammer_steal_count: 0,
                }
            );

            const y = (sums.hammer_steal_count / sums.hammer_end_count) * 100;
            (sums.hammer_blank_count / sums.hammer_end_count) * 100;
            const all = previous.map(
                ({ hammer_steal_count, hammer_end_count }) =>
                    (hammer_steal_count / hammer_end_count) * 100
            );
            const max = Math.max(...all);

            return {
                x: index,
                y,
                data: {
                    start_time: d.start_time,
                    hammer_steal_count: d.hammer_steal_count,
                    hammer_end_count: d.hammer_end_count,
                    average: hammerBlankAvg,
                    max,
                },
            };
        }),
        borderColor: "rgba(96, 125, 139, 1)",
        backgroundColor: "rgba(96, 125, 139, 1)",
        backgroundColor: (context) => setBgGradient(context, "#607d8b"),
        hidden: !visibleItems.value.includes(BADGE_TITLES_PLAIN.stealdefense),
        tension: TENSION,
        fill: true,
        pointStyle: false,
    };

    const datasets = {
        efficiency: {
            datasets: conversions,
            average: hammerConversionAvg,
        },
        bandit: {
            datasets: steals,
            average: nonHammerStealAvg,
        },
        bulwark: {
            datasets: forces,
            average: nonHammerForceAvg,
        },
        stealdefense: {
            datasets: stealDefense,
            average: hammerStealDefenseAvg,
        },
        minimalist: {
            datasets: blanks,
            average: hammerBlankAvg,
        },
        // firstend: {
        //     datasets: hammerFirstEnd,
        //     average: hammerFirstEndAvg,
        // },

        // strategist: {
        //     datasets: hammerLastEnd,
        //     average: hammerLastEndAvg,
        // },
    };

    const generateAnnotations = () => {
        const { getColor } = useColor();
        const annotations = {};
        Object.keys(datasets).forEach((key, index) => {
            annotations[key] = {
                yMin: datasets[key].average,
                yMax: datasets[key].average,
                borderColor: getColor(BADGE_COLORS[key]),
                opacity: 0.1,
                borderWidth: 2,

                type: "label",
                callout: {
                    display: true,
                },
                content: `${datasets[key].average.toFixed(1)}%`,
                position: {
                    x: "end",
                    y: "end",
                },
                xValue: datasets[key].datasets.data.length - 1,
                yValue: datasets[key].average,
                yAdjust: (e, e1, e2) => {
                    console.log(
                        datasets[key].datasets.label,
                        datasets[key].datasets.data[0].data.max,
                        datasets[key].average
                    );
                    return datasets[key].average < 30 ? -70 : 70;
                },
                xAdjust: -20,

                display: (e) => {
                    console.log(datasets[key]);
                    if (e.chart) {
                        return e.chart.getDatasetMeta(index)?.visible;
                    }
                },
            };
            // annotations[`${key}-max`] =

            //    {
            //         yMin: datasets[key].datasets.data[0].data.max,
            //         yMax: datasets[key].datasets.data[0].data.max,
            //         borderColor: 'red',
            //         opacity: 0.1,
            //         borderWidth: 2,
            //         borderDash: [6, 6],
            //         type: "line",
            //         display: (e) => {
            //             console.log(datasets[key].datasets.data[0].data.max)
            //             if (e.chart) {
            //                 return e.chart.getDatasetMeta(index)?.visible;
            //             }
            //         },

            //     }
        });
        return annotations;
    };

    return {
        annotations: generateAnnotations(),
        data: {
            labels: allData.value.map(({ start_time }) =>
                format(toTimezone(start_time))
            ),
            datasets: Object.keys(datasets).map(
                (key) => datasets[key].datasets
            ),
        },
        ticks: {
            callback: (index, _, all) => {
                if (index !== 0 && index !== all.length - 1) return "";
                const { start_time } = allData.value[index];

                return format(toTimezone(start_time), "MMM DD");
            },
        },
        tooltip: {
            callbacks: {
                afterTitle: ([d]) => {
                    const { dataIndex } = d;
                    const { opposition_name } = allData.value[dataIndex] || {};
                    if (!opposition_name) return "";
                    return `vs. ${opposition_name}`;
                },
                afterLabel: (d) => {
                    const { average } = d.raw.data;
                    const { y } = d.raw;
                    const descriptor = y - average < 0 ? "below" : "above";
                    return `${Math.abs(y - average).toFixed(
                        1
                    )}% ${descriptor} average (${average.toFixed(1)}%)`;
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
                            3: `${data.hammer_steal_count}/${
                                data.hammer_end_count
                            } ends (${(
                                (data.hammer_steal_count /
                                    data.hammer_end_count) *
                                100
                            ).toFixed(1)}%)`,
                            4: `${data.hammer_blank_count}/${
                                data.hammer_end_count
                            } ends (${(
                                (data.hammer_blank_count /
                                    data.hammer_end_count) *
                                100
                            ).toFixed(1)}%)`,
                            5: `${data.hammer_first_end_count}/${
                                d.dataIndex + 1
                            } games (${(
                                (data.hammer_first_end_count /
                                    allData.value.length) *
                                100
                            ).toFixed(1)}%)`,
                            6: `${data.hammer_last_end_count}/${
                                d.dataIndex + 1
                            } games (${(
                                (data.hammer_last_end_count /
                                    allData.value.length) *
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
            mode: "x",
            display: false,
            intersect: false,
        },
    };
};
</script>
