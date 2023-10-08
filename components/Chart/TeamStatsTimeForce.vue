<template>
    <ChartLineOverTime v-bind="chartData()" height="200px">
    </ChartLineOverTime>
</template>
<script setup>
import {
    BADGE_COLORS,
    BADGE_TITLES_PLAIN,
    BADGE_TITLE_CONVERT,
} from "@/constants/badges";
import { useUserTeamStore } from "@/store/user-teams";
import TeamStats from "@/store/models/team-stats";
import Game from '@/store/models/game'

const props = defineProps({
    opponentId: Number,
    teamId: Number,
});

const { setBgGradient } = useColor();

const stats = computed(() => {
     if (!props.opponentId)
        return useRepo(TeamStats)
            .where("team_id", props.teamId)
            .whereIn("game_id", (val) => val !== 0)
             .orderBy('start_time', 'asc')
            .get()
            

    const allStats = useRepo(TeamStats)
        .where("team_id", props.teamId)
        .where("game_id", (val) => val !== 0)
        .get();

    const games = useRepo(Game)
        .with("teams")
        .whereIn(
            "id",
            allStats.map(({ game_id }) => game_id)
        )
        .whereHas("teams", (query) => {
            query.whereIn("team_id", props.opponentId);
        })
        .get()
        .map(({ id }) => id);

    return useRepo(TeamStats)
        .where("team_id", props.teamId)
        .whereIn("game_id", games)
         .orderBy('start_time', 'asc')
        .get();

    
}
    
);


const chartData = () => {
    const { format, toTimezone } = useTime();

    const getPointData = ([d]) => {
        const point = d.dataset.data[d.dataIndex];
        const { data } = point;

        return data;
    };

    const team = useRepo(TeamStats)
        .where("team_id", props.teamId)
        .where("game_id", 0)
        .first();

    const hammerConversionAvg =
        (team.non_hammer_force_count / team.non_hammer_end_count) * 100;

    const conversions = {
        label: BADGE_TITLES_PLAIN.bulwark,

        data: stats.value.map((d, index) => {
            const previous = [...stats.value].splice(0, index);
            previous.push({
                non_hammer_end_count: d.non_hammer_end_count,
                non_hammer_force_count: d.non_hammer_force_count,
            });

            const sums = previous.reduce(
                (
                    all,
                    {
                        non_hammer_end_count,
                        non_hammer_force_count,
                    }
                ) => {
                    return {
                        non_hammer_end_count:
                            all.non_hammer_end_count + non_hammer_end_count,
                        non_hammer_force_count:
                            all.non_hammer_force_count +
                            non_hammer_force_count
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
                ({
                    non_hammer_force_count,
                    non_hammer_end_count,
                 
                }) =>
                    (non_hammer_force_count /
                        non_hammer_end_count) *
                    100
            );
            const max = Math.max(...all);

            return {
                x: index,
                y,
                data: {
                    start_time: d.start_time,
                    non_hammer_force_count: d.non_hammer_force_count,
                    non_hammer_end_count: d.non_hammer_end_count,
                    average: hammerConversionAvg,
                    max,
                },
            };
        }),

        borderColor: "rgba(33, 150, 243, 1)",
        backgroundColor: (context) => setBgGradient(context, "#2196f3"),
        tension: 0.4,
        fill: true,
        pointStyle: false,
    };

    const datasets = {
        efficiency: {
            datasets: conversions,
            average: hammerConversionAvg,
        },
    };

    const generateAnnotations = () => {
        const { getColor } = useColor();
        const annotations = {

                borderColor: getColor(BADGE_COLORS.bulwark),
                opacity: 0.1,
                borderWidth: 2,

                type: "label",
                callout: {
                    display: true,
                },
                content: `${datasets.bulwark.average.toFixed(1)}%`,
                position: {
                    x: "end",
                    y: "end",
                },
                xValue: datasets.bulwark.datasets.data.length - 1,
                yValue: datasets.bulwark.average,
                yAdjust: (e, e1, e2) => {
                    return datasets.bulwark.average < 30 ? -70 : 70;
                },
                xAdjust: -20,

              
            };
      
        return annotations;
    };

    return {
        data: {
            labels: stats.value.map(({ start_time }) =>
                format(toTimezone(start_time))
            ),
            datasets: [conversions]
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
                 afterLabel: (d) => {
                    const { y } = d.raw;
         
                    return `Cumulative average: ${y.toFixed(1)}%`;
                },
                label: (d) => {
                    const data = getPointData([d]);
                    return `${data.non_hammer_force_count}/${
                        data.non_hammer_end_count
                    } ends (${(
                        (data.non_hammer_force_count / data.non_hammer_end_count) *
                        100
                    ).toFixed(1)}%)`;
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
