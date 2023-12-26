<template>
    <ChartLineOverTime v-bind="chartData()" class="col-12">
        <template v-slot:annotation>
            <h5 style="pointer-events:none; z-index: -1">{{ title[props.type] }}</h5>
            <h3 style="pointer-events:none; z-index: -1">
                {{ cumulativeAvg
                }}{{isPercent ? '%' : ''}}<span
                    :style="`font-size: 10px; font-weight:normal; visibility: ${
                        showAppend ? 'visible' : 'hidden'
                    }`"
                    >of the time</span
                >
            </h3>
            <h4>top {{ (100 - percentile || 1).toFixed() }}% worldwide</h4>
        </template>
    </ChartLineOverTime>
</template>
<script setup>
import Team from "@/store/models/team";
import TeamStats from "@/store/models/team-stats";

const props = defineProps({
    minDate: String,
    teamId: Number,
    type: String,
});

const title = {
    efficiency: "Score 2+ points with hammer",
    steal_efficiency: "Score points without hammer",
    force_efficiency: "Force opposition to 1 point",
    steal_defense: "Stolen on with hammer",
    points: "Average points per game",
    hammer_fe: "Hammer in first end",
    hammer_le: "Hammer in last end",
};

const showAppend = computed(() => props.type !== "points");
const { setBgGradient } = useColor();
const datasetParams = {
    efficiency: [
        {
            numerator: "hammer_conversion_count",
            denominator: "hammer_end_count",
            label: "Hammer efficiency",
            borderColor: "156, 39, 176",
            backgroundColor: (context) => setBgGradient(context, "#9c27b0"),
              isPercent: true,
        },
    ],
    steal_efficiency: [
        {
            numerator: "non_hammer_steal_count",
            denominator: "non_hammer_end_count",
            label: "Steal efficiency",
            borderColor: "244, 67, 54",

            backgroundColor: (context) => setBgGradient(context, "#f44336"),
              isPercent: true,
        },
    ],
    force_efficiency: [
        {
            numerator: "non_hammer_force_count",
            denominator: "non_hammer_end_count",
            label: "Force efficiency",
            borderColor: "33, 150, 243",
            backgroundColor: (context) => setBgGradient(context, "#2196f3"),
              isPercent: true,
              isPercent: true,
        },
    ],
    steal_defense: [
        {
            numerator: "hammer_steal_count",
            denominator: "hammer_end_count",
            label: "Steal defense",
            borderColor: "96, 125, 139",
            backgroundColor: (context) => setBgGradient(context, "#607d8b"),
            isPercent: true,
        },
    ],
    points: [
        {
            numerator: "points_for",
            denominator: null,
            label: "Points for",
            borderColor: "33, 150, 243",
            backgroundColor: (context) => setBgGradient(context, "#2196f3"),
              isPercent: false
        },
        {
            numerator: "points_against",
            denominator: null,
            label: "Points against",
            borderColor: "244, 67, 54",

            backgroundColor: (context) => setBgGradient(context, "#f44336"),
              isPercent: false
        },
    ],
    hammer_fe: [
        {
            numerator: "hammer_first_end_count",
            denominator: null,
            label: "Hammer in last end",
            borderColor: "255, 193, 7",
            backgroundColor: (context) => setBgGradient(context, "#ffc107"),
              isPercent: true,
        },
    ],
    hammer_le: [
        {
            numerator: "hammer_last_end_count",
            denominator: null,
            label: "Hammer in last end",
            borderColor: "20, 90, 50",
            backgroundColor: (context) => setBgGradient(context, "#145a32"),
              isPercent: true,
        },
    ],
};

const avgParams = {
    efficiency: {
        percentile: "hammer_conversion_percentile",
        average: "hammer_conversion_average",
        isPercent: true,
    },
    steal_efficiency: {
        percentile: "steal_efficiency_percentile",
        average: "steal_efficiency",
        isPercent: true,
    },
    force_efficiency: {
        percentile: "force_efficiency_percentile",
        average: "force_efficiency",
        isPercent: true,
    },
    steal_defense: {
        percentile: "steal_defense_percentile",
        average: "steal_defense",
        isPercent: true,
    },
    points: {
        percentile: "points_for_percentile",
        average: "points_for",
        isPercent: false,
    },
    hammer_fe: {
        percentile: "hammer_first_end_percentile",
        average: "hammer_first_end",
        isPercent: true,
    },
    hammer_le: {
        percentile: "hammer_last_end_percentile",
        average: "hammer_last_end",
        isPercent: true,
    },
};

const { toUTC } = useTime();

const stats = computed(() => {
    return useRepo(TeamStats)
        .where("team_id", props.teamId)
        .where("start_time", (val) => {
            if (!val) return;
            if (!props.minDate) return true;
            return (
                toUTC(val, null, false, true).unix() >
                toUTC(props.minDate, null, false, true).unix()
            );
        })
        .orderBy("start_time", "asc")
        .get();
});

const t = computed(() =>
    useRepo(Team).where("id", props.teamId).with("totalStats").first()
);

const percentile = computed(
    () => t.value?.totalStats[avgParams[props.type]?.percentile] * 100
);

const { isPercent } = avgParams[props.type];

const cumulativeAvg = computed(() => {
    const params = avgParams[props.type];
    const { average } = params;
    let val = "";
    if (isPercent) {
        val = (t.value?.totalStats[average] * 100).toFixed(1);
    } else {
        val = t.value?.totalStats[average].toFixed(1);
    }
    return Number(val)
});

const chartData = () => {
    const { format, toTimezone } = useTime();

    const getPointData = ([d]) => {
        const point = d.dataset.data[d.dataIndex];
        const { data } = point;

        return data;
    };

    const team = useRepo(Team)
        .where("id", props.teamId)
        .with("totalStats")
        .first();

    const datasets = datasetParams[props.type].map(
        ({ numerator, denominator, backgroundColor, borderColor, label }) => {
            const { isPercent } = avgParams[props.type];
            return {
                data: stats.value.map((d, index) => {
                    const previous = [...stats.value].splice(0, index);
                    previous.push({
                        [denominator]: d[denominator],
                        [numerator]: d[numerator],
                    });

                    const sums = previous.reduce(
                        (all, current) => {
                            return {
                                [denominator]:
                                    all[denominator] + current[denominator],
                                [numerator]:
                                    all[numerator] + current[numerator],
                            };
                        },
                        {
                            [denominator]: 0,
                            [numerator]: 0,
                        }
                    );

                    const average =
                        (sums[numerator] /
                            (denominator ? sums[denominator] : index + 1)) *
                        (isPercent ? 100 : 1);
                        console.log('avg: ', average, numerator, sums[numerator])
                        

                    const y = isPercent ? 
                        (d[numerator] /
                            (denominator ? d[denominator] : index + 1)) * 100 : d[numerator]
    

                    return {
                        x: index,
                        y,
                        data: {
                            start_time: d.start_time,
                            [numerator]: d[numerator],
                            [denominator]: d[denominator],
                            average,
                        },
                    };
                }),
                borderColor: `rgba(${borderColor}, 1)`,
                borderWidth: 2,
                backgroundColor,
                tension: 0.4,
                fill: true,
                pointStyle: false,
                label,
            };
        }
    );
    const generateAnnotations = () => {
        const obj = {}
        datasetParams[props.type].forEach((dataset, index) => {
            if (index > 0)return;
            const yVal = Number(dataset.isPercent ? (t.value?.totalStats[avgParams[props.type].average] * 100).toFixed() : t.value?.totalStats[avgParams[props.type].average].toFixed())
            obj[index] = {
                borderColor: `rgba(${dataset.borderColor}, 0.4)`,
                borderWidth: 2,
                borderDash: [5],
                type: "line",
                yMin: yVal,
                yMax: yVal,
            }
        })
        return obj;
    }
    return {
        annotations: generateAnnotations(),
        data: {
            labels: stats.value.map(({ start_time }) =>
                format(toTimezone(start_time))
            ),
            datasets,
        },
        ticks: {
            callback: (index, _, all) => {
                if (index !== 0 && index !== all.length - 1) return "";
                const { start_time } = stats.value[index];

                return format(toTimezone(start_time), "MMM DD");
            },
        },
        tooltip: {
            callbacks: {
                afterTitle: ([d]) => {
                    const { dataIndex } = d;
                    const { opposition_name } = stats.value[dataIndex] || {};
                    if (!opposition_name) return "";
                    return `vs. ${opposition_name}`;
                },
                footer: ([d]) => {
                    const data = getPointData([d]);
                    const { average } = data;
                    return `Running avg: ${average.toFixed(1)}${
                        isPercent ? "%" : ""
                    }`;
                    // const { datasetIndex } = d;
                    // console.log('footer: ', d, data)
                    // return `This game: ${(
                    //     (data[
                    //         datasetParams[props.type][datasetIndex]?.numerator
                    //     ] /
                    //         data[
                    //             datasetParams[props.type][datasetIndex]
                    //                 ?.denominator
                    //         ]) *
                    //     100
                    // ).toFixed(1)}%`;
                },
                label: (d) => {
                    const { y } = d.raw;
                    return `${isPercent ? '' : y < 0 ? '-' : ''}${y.toFixed(1)}${isPercent ? "%" : ""}`;
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
