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
    minDate: String,
    opponentId: Number,
    teamId: Number,
});

const { setBgGradient } = useColor();
const {toUTC} = useTime();

const stats = computed(() => {
    return useRepo(TeamStats)
        .where("team_id", props.teamId)
        .where('start_time', (val) => {
            if (!props.minDate) return true;
            return toUTC(val, null, false, true).unix() > toUTC(props.minDate, null, false, true).unix()
        })
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

    const average =
        (team.hammer_steal_count / team.hammer_end_count) * 100;

    const conversions = {
        label: BADGE_TITLES_PLAIN.bulwark,

        data: stats.value.map((d, index) => {
            const previous = [...stats.value].splice(0, index);
            previous.push({
                hammer_end_count: d.hammer_end_count,
                hammer_steal_count: d.hammer_steal_count,
            });

            const sums = previous.reduce(
                (
                    all,
                    {
                        hammer_end_count,
                        hammer_steal_count,
                    }
                ) => {
                    return {
                        hammer_end_count:
                            all.hammer_end_count + hammer_end_count,
                        hammer_steal_count:
                            all.hammer_steal_count +
                            hammer_steal_count
                    };
                },
                {
                    hammer_end_count: 0,
                    hammer_steal_count: 0,
                }
            );

            const y =
                (sums.hammer_steal_count / sums.hammer_end_count) * 100;

            const all = previous.map(
                ({
                    hammer_steal_count,
                    hammer_end_count,
                 
                }) =>
                    (hammer_steal_count /
                        hammer_end_count) *
                    100
            );
            const max = Math.max(...all);

            return {
                x: index,
                y,
                data: {
                    start_time: d.start_time,
                    hammer_steal_count: d.hammer_steal_count,
                    hammer_end_count: d.hammer_end_count,
                    average: average,
                    max,
                },
            };
        }),

        borderColor: "rgba(96, 125, 139, 1)",
   
        backgroundColor: (context) => setBgGradient(context, "#607d8b"),
        tension: 0.4,
        fill: true,
        pointStyle: false,
    };

    const datasets = {
        efficiency: {
            datasets: conversions,
            average: average,
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
                    return `${data.hammer_steal_count}/${
                        data.hammer_end_count
                    } ends (${(
                        (data.hammer_steal_count / data.hammer_end_count) *
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
