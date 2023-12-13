<template>

    <ChartLineOverTime v-bind="chartData()" height="200px" class="col-10">
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

    const team = useRepo(Team)
        .where("id", props.teamId)
        .with('totalStats')
        .first()
        



    const hammerConversionAvg =
        (team.hammer_conversion_count / team.hammer_end_count) * 100;

    const conversions = {
        label: BADGE_TITLES_PLAIN.efficiency,

        data: stats.value.map((d, index) => {
            const previous = [...stats.value].splice(0, index);
            previous.push({
                hammer_end_count: d.hammer_end_count,
                hammer_conversion_count: d.hammer_conversion_count,
            
            });

            const sums = previous.reduce(
                (
                    all,
                    {
                        hammer_end_count,
                        hammer_conversion_count,
                    
                    }
                ) => {
                    return {
                        hammer_end_count:
                            all.hammer_end_count + hammer_end_count,
                        hammer_conversion_count:
                            all.hammer_conversion_count +
                            hammer_conversion_count,
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
               
                }) =>
                    (hammer_conversion_count /
                        hammer_end_count) *
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

                borderColor: getColor(BADGE_COLORS.efficiency),
                opacity: 0.1,
                borderWidth: 2,

                type: "label",
                callout: {
                    display: true,
                },
                content: `${datasets.efficiency.average.toFixed(1)}%`,
                position: {
                    x: "end",
                    y: "end",
                },
                xValue: datasets.efficiency.datasets.data.length - 1,
                yValue: datasets.efficiency.average,
                yAdjust: (e, e1, e2) => {
                    return datasets.efficiency.average < 30 ? -70 : 70;
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
                    return `${data.hammer_conversion_count}/${
                        data.hammer_end_count
                    } ends (${(
                        (data.hammer_conversion_count / data.hammer_end_count) *
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
