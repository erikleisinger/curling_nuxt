<template>
    <ChartLineOverTime v-bind="chartData()" class="col-12">
        <template v-slot:annotation>
            <h5>{{ title[props.type] }}</h5>
            <h3>
                {{ cumulativeAvg
                }}<span
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
import {
    BADGE_COLORS,
    BADGE_TITLES_PLAIN,
    BADGE_TITLE_CONVERT,
} from "@/constants/badges";
import { useUserTeamStore } from "@/store/user-teams";
import Team from "@/store/models/team";
import TeamStats from "@/store/models/team-stats";
import Game from "@/store/models/game";

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
    points: "Average points per end",
};

const showAppend = computed(() => props.type !== "points");
const { setBgGradient } = useColor();
const datasetParams = {
    efficiency: [
        {
            numerator: "hammer_conversion_count",
            denominator: "hammer_end_count",
            label: "Hammer efficiency",
            borderColor: "rgba(156, 39, 176, 1)",
            backgroundColor: (context) => setBgGradient(context, "#9c27b0"),
        },
    ],
    steal_efficiency: [
        {
            numerator: "non_hammer_steal_count",
            denominator: "non_hammer_end_count",
            label: "Steal efficiency",
            borderColor: "rgba(244, 67, 54, 1)",

            backgroundColor: (context) => setBgGradient(context, "#f44336"),
        },
    ],
    force_efficiency: [
        {
            numerator: "non_hammer_force_count",
            denominator: "non_hammer_end_count",
            label: "Force efficiency",
            borderColor: "rgba(33, 150, 243, 1)",
            backgroundColor: (context) => setBgGradient(context, "#2196f3"),
        },
    ],
    steal_defense: [
        {
            numerator: "hammer_steal_count",
            denominator: "hammer_end_count",
            label: "Steal defense",
            borderColor: "rgba(96, 125, 139, 1)",
            backgroundColor: (context) => setBgGradient(context, "#607d8b"),
        },
    ],
    points: [
        {
            numerator: "points_for",
            denominator: null,
            label: "Points for",
            borderColor: "rgba(33, 150, 243, 1)",
            backgroundColor: (context) => setBgGradient(context, "#2196f3"),
        },
        {
            numerator: "points_against",
            denominator: null,
            label: "Points against",
            borderColor: "rgba(244, 67, 54, 1)",

            backgroundColor: (context) => setBgGradient(context, "#f44336"),
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
        percentile: 'steal_efficiency_percentile',
        average: 'steal_efficiency',
        isPercent: true,
    },
    force_efficiency: {
        percentile: 'force_efficiency_percentile',
        average: 'force_efficiency',
        isPercent: true,
    },
    steal_defense: {
        percentile: 'steal_defense_percentile',
        average: 'steal_defense',
        isPercent: true
    },
    points: {
        percentile: "points_for_percentile",
        average: "points_for",
        isPercent: false,
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

const cumulativeAvg = computed(() => {
    const params = avgParams[props.type];
    const { average, isPercent } = params;
    let val = "";
    if (isPercent) {
        val = (t.value?.totalStats[average] * 100).toFixed(1);
    } else {
        val = t.value?.totalStats[average].toFixed(1);
    }
    return `${val}${isPercent ? "%" : ""}`;
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
            const average = denominator
                ? (team[numerator] / team[denominator]) * 100
                : team.totalStats[numerator];
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

                    const y = denominator
                        ? (sums[numerator] / sums[denominator]) * 100
                        : sums[numerator] / (index + 1);

                    const all = previous.map((i, index) =>
                        denominator
                            ? (i[numerator] / i[denominator]) * 100
                            : i[numerator] / (index + 1)
                    );

                    const max = Math.max(...all);

                    return {
                        x: index,
                        y,
                        data: {
                            start_time: d.start_time,
                            [numerator]: d[numerator],
                            [denominator]: d[denominator],
                            average,
                            max,
                        },
                    };
                }),
                borderColor,
                backgroundColor,
                tension: 0.4,
                fill: true,
                pointStyle: false,
                label,
            };
        }
    );

    return {
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
                    const { datasetIndex } = d;

                    return `This game: ${(
                        (data[
                            datasetParams[props.type][datasetIndex]?.numerator
                        ] /
                            data[
                                datasetParams[props.type][datasetIndex]
                                    ?.denominator
                            ]) *
                        100
                    ).toFixed(1)}%`;
                },
                label: (d) => {
                    const { y } = d.raw;
                    return `${y.toFixed(1)}%`;
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
