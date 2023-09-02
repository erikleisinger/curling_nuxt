<template>
    <div class="line-chart__container">
        <q-inner-loading :showing="loading || updating" color="primary" />
        <ChartLineOverTime
            v-if="!loading"
            v-bind="chartProps"
            v-slot="{ chart }"
            height="calc(100% - 66px)"
        >
            <div
                class="row justify-between  chart-options__container no-wrap"
                ref="toolbar"
            >
            <div class="row ">
                <q-btn class="q-mb-sm q-mr-none q-mr-sm-sm"  :round="$q.screen.xs" :rounded="!$q.screen.xs" :flat="$q.screen.xs" icon="visibility" color="primary" :label="$q.screen.xs ? '' : 'Show/hide stats'">
                  
                    <q-menu
                        transition-show="jump-down"
                        transition-hide="jump-up"
                      
                    >
                        <q-list dense style="min-width: 100px">
                            <q-item
                                clickable
                                v-ripple
                                v-for="(option, index) in options"
                                :key="`option-${index}`"
                                @click="toggleVisibility(chart, index)"
                                :active="visibleItems.includes(option.title)"
                                manual-focus
                                :focused="true"
                                :disable="updating"
                            >
                                <q-item-section avatar>
                                    <q-icon
                                        :color="option.color"
                                        name="circle"
                                    ></q-icon>
                                </q-item-section>

                                <q-item-section>{{
                                    option.title
                                }}</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
                <q-btn class="q-mb-sm q-mr-none q-mr-sm-sm" :round="$q.screen.xs" :rounded="!$q.screen.xs" :flat="$q.screen.xs" icon="date_range"  :color="$q.screen.xs ? 'primary' : 'white'" text-color="primary"  :label="$q.screen.xs ? '' : 'Range'">
                
                    <q-menu
                        transition-show="jump-down"
                        transition-hide="jump-up"
                      
                    >
                        <q-list dense style="min-width: 100px">
                            <q-item
                                clickable
                                @click="setFilter('range', 'week', chart)"
                                :active="rangeFilter === 'week'"
                                :focused="rangeFilter === 'week'"
                                manual-focus
                                 :disable="updating"
                            >
                                <q-item-section>Past week</q-item-section>
                            </q-item>
                            <q-item
                                clickable
                                @click="setFilter('range', 'month', chart)"
                                :active="rangeFilter === 'month'"
                                :focused="rangeFilter === 'month'"
                                manual-focus
                                 :disable="updating"
                            >
                                <q-item-section>Past Month</q-item-section>
                            </q-item>
                            <q-item
                                clickable
                                @click="setFilter('range', null, chart)"
                                :active="rangeFilter === null"
                                :focused="rangeFilter === null"
                                manual-focus
                                 :disable="updating"
                            >
                                <q-item-section>All time</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
                <q-checkbox label="Averages" class="q-mb-sm q-ml-sm q-ml-sm-none" v-model="showAverages" dense @update:model-value="toggleAverageVisibility($event, chart)"/>
            </div>
            <div>
                <q-btn flat round icon="close" @click="emit('close')" />
            </div>
            </div>
        </ChartLineOverTime>
    </div>
</template>
<style lang="scss" scoped>
.line-chart__container {
    width: 100%;
    height: 100%;
    // height: calc(100% - 100px);
    .chart-options__container {
        height: 100%;
        width: 100%;
        padding: var(--space-sm);
        padding-bottom: 0px;
    }
}
</style>
<script setup>
import { BADGE_COLORS, BADGE_TITLES_PLAIN } from "@/constants/badges";
import { useElementSize, watchDebounced } from "@vueuse/core";
import { useUserTeamStore } from "@/store/user-teams";

const props = defineProps({
    teamId: Number,
    visibleStats: Array,
});

const emit = defineEmits(["close"]);

const $q = useQuasar();

const toolbar = ref(null);
const { height, width } = useElementSize(toolbar);

const showAverages = ref(true)

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
        color: BADGE_COLORS.minimalist,
        title: BADGE_TITLES_PLAIN.minimalist,
        visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.minimalist),
    },
    {
        color: BADGE_COLORS.firstend,
        title: BADGE_TITLES_PLAIN.firstend,
        visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.firstend),
    },
    {
        color: BADGE_COLORS.strategist,
        title: BADGE_TITLES_PLAIN.strategist,
        visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.strategist),
    },
];

const visibleItems = ref([...(props.visibleStats ?? [])]);

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
    const {annotations} = getHammerConversionOverTime();
    chart.options.plugins.annotation.annotations = annotations;
    chart.update();
}

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
    allData.value = data.reverse();
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

const updating = ref(false)

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
    const hammerStealAvg =
        (team.hammer_steal_count / team.hammer_end_count) * 100;
    const hammerBlankAvg =
        (team.hammer_blank_count / team.hammer_end_count) * 100;
    const hammerFirstEndAvg =
        (team.hammer_first_end_count / team.games_played) * 100;
    const hammerLandEndAvg =
        (team.hammer_last_end_count / team.games_played) * 100;

    const conversions = {
        label: BADGE_TITLES_PLAIN.efficiency,
        data: allData.value.map((d, index) => ({
            x: index,
            y: (d.hammer_conversion_count / d.hammer_end_count) * 100,
            data: {
                start_time: d.start_time,
                hammer_conversion_count: d.hammer_conversion_count,
                hammer_end_count: d.hammer_end_count,
                average: hammerConversionAvg,
            },
        })),
        backgroundColor: "rgba(156, 39, 176, 1)",
        borderColor: "rgba(156, 39, 176, 1)",
        hidden: !props.visibleStats.includes(BADGE_TITLES_PLAIN.efficiency),
    };

    const steals = {
        label: BADGE_TITLES_PLAIN.bandit,
        data: allData.value.map((d, index) => ({
            x: index,
            y: (d.hammer_steal_count / d.hammer_end_count) * 100,
            data: {
                start_time: d.start_time,
                hammer_steal_count: d.hammer_steal_count,
                hammer_end_count: d.hammer_end_count,
                average: hammerStealAvg,
            },
        })),
        borderColor: "rgba(244, 67, 54, 1)",
        backgroundColor: "rgba(244, 67, 54, 1)",
        hidden: !props.visibleStats.includes(BADGE_TITLES_PLAIN.bandit),
    };

    const forces = {
        label: BADGE_TITLES_PLAIN.bulwark,
        data: allData.value.map((d, index) => ({
            x: index,
            y: (d.non_hammer_force_count / d.non_hammer_end_count) * 100,
            data: {
                start_time: d.start_time,
                non_hammer_force_count: d.non_hammer_force_count,
                non_hammer_end_count: d.non_hammer_end_count,
                average: nonHammerForceAvg,
            },
        })),
        borderColor: "rgba(33, 150, 243, 1)",
        backgroundColor: "rgba(33, 150, 243, 1)",
        hidden: !props.visibleStats.includes(BADGE_TITLES_PLAIN.bulwark),
    };

    const blanks = {
        label: BADGE_TITLES_PLAIN.minimalist,
        data: allData.value.map((d, index) => ({
            x: index,
            y: (d.hammer_blank_count / d.hammer_end_count) * 100,
            data: {
                start_time: d.start_time,
                hammer_blank_count: d.hammer_blank_count,
                hammer_end_count: d.hammer_end_count,
                average: hammerBlankAvg,
            },
        })),
        borderColor: "rgba(0, 131, 143, 1)",
        backgroundColor: "rgba(0, 131, 143, 1)",
        hidden: !props.visibleStats.includes(BADGE_TITLES_PLAIN.minimalist),
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
        hidden: !props.visibleStats.includes(BADGE_TITLES_PLAIN.firstend),
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
                        average: hammerLandEndAvg,
                    },
                },
            ];
        }, []),
        borderColor: "rgba(233, 30, 99, 1)",
        backgroundColor: "rgba(233, 30, 99, 1)",
        hidden: !props.visibleStats.includes(BADGE_TITLES_PLAIN.strategist),
    };

    const datasets = {
        efficiency: {
            datasets: conversions,
            average:
                (team.hammer_conversion_count / team.hammer_end_count) * 100,
        },
        bandit: {
            datasets: steals,
            average: (team.hammer_steal_count / team.hammer_end_count) * 100,
        },
        bulwark: {
            datasets: forces,
            average:
                (team.non_hammer_force_count / team.non_hammer_end_count) * 100,
        },
        minimalist: {
            datasets: blanks,
            average: (team.hammer_blank_count / team.hammer_end_count) * 100,
        },
        firstend: {
            datasets: hammerFirstEnd,
            average: (team.hammer_first_end_count / team.games_played) * 100,
        },
        strategist: {
            datasets: hammerLastEnd,
            average: (team.hammer_last_end_count / team.games_played) * 100,
        },
    };

    const generateAnnotations = () => {
        const { getColor } = useColor();
        const annotations = {};
        Object.keys(datasets).forEach((key, index) => {
            annotations[key] = {
                yMin: datasets[key].average,
                yMax: datasets[key].average,
                borderColor: getColor(BADGE_COLORS[key]),
                opacity: 0.3,
                borderWidth: 2,
                borderDash: [6, 6],
                type: "line",
                display: (e) => {
                    if (!showAverages.value) return false;
                    if (e.chart) {
                        return e.chart.getDatasetMeta(index)?.visible;
                    }
                    return true;
                },
            };
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

                return format(toTimezone(start_time), 'MMM DD');
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
                            3: `${data.hammer_blank_count}/${
                                data.hammer_end_count
                            } ends (${(
                                (data.hammer_blank_count /
                                    data.hammer_end_count) *
                                100
                            ).toFixed(1)}%)`,
                            4: `${data.hammer_first_end_count}/${
                                d.dataIndex + 1
                            } games (${(
                                (data.hammer_first_end_count /
                                    allData.value.length) *
                                100
                            ).toFixed(1)}%)`,
                            5: `${data.hammer_last_end_count}/${
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
        },
    };
};

// hammerConversionProps.value = getHammerConversionOverTime();
</script>
