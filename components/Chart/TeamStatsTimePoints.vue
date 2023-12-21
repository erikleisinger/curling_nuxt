<template>

    <ChartLineOverTime v-bind="chartData()"  class="col-12" calculateMinMax :percent="false">
        <template v-slot:annotation>
              <h5 >Average points per end</h5>
            <h3 ><span >{{cumulativeAvg > 0 ? '+' : ''}}</span>{{cumulativeAvg}}<span style="font-size: 10px; font-weight:normal; visibility: hidden">of the time</span></h3>
           <h4 class="q-mt-sm">top {{((100 - percentile) || 1).toFixed()}}% worldwide</h4>
        </template>
    </ChartLineOverTime>

</template>
<script setup>
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
            if (!val) return;
            if (!props.minDate) return true;
            return toUTC(val, null, false, true).unix() > toUTC(props.minDate, null, false, true).unix()
        })
         .orderBy('start_time', 'asc')
        .get();
}
    
);



const t = computed(() => useRepo(Team)
        .where("id", props.teamId)
        .with('totalStats')
        .first())

const percentile = computed(() => t.value?.totalStats?.points_for_percentile * 100)

const cumulativeAvg = computed(() => t.value?.totalStats?.points_for.toFixed(1))


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



    const pointsForAvg = team.totalStats.points_for;

    const points_for = {
        label: 'Points for',

        data: stats.value.map((d, index) => {
      
            const previous = [...stats.value].splice(0, index);
            previous.push({
                points_for: d.points_for
            
            });
     

            const sums = previous.reduce(
                (
                    all,
                    {
                        points_for,
                    
                    }
                ) => {
                    return {
                        points_for: all.points_for + points_for
                    };
                },
                {
                   points_for: 0,
                }
            );

            const y =
                sums.points_for / (index + 1);

            const all = previous.map(
                ({
                    points_for
               
                }, index) =>
                    points_for / (index + 1)
            );
          
            const max = Math.max(...all);

            return {
                x: index,
                y,
                data: {
                    start_time: d.start_time,
                    points_for: d.points_for,
                    average: pointsForAvg,
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

    const pointsAgainstAvg = team.totalStats.points_against;

    const points_against = {
        label:'Points against',

        data: stats.value.map((d, index) => {
      
            const previous = [...stats.value].splice(0, index);
            previous.push({
                points_against: d.points_against
            
            });
     

            const sums = previous.reduce(
                (
                    all,
                    {
                        points_against,
                    
                    }
                ) => {
                    return {
                        points_against: all.points_against + points_against
                    };
                },
                {
                   points_against: 0,
                }
            );

            const y =
                sums.points_against / (index + 1);

            const all = previous.map(
                ({
                    points_against
               
                }, index) =>
                    points_against / (index + 1)
            );
          
            const max = Math.max(...all);

            return {
                x: index,
                y,
                data: {
                    start_time: d.start_time,
                    points_against: d.points_against,
                    average: pointsAgainstAvg,
                    max,
                },
            };
        }),
       borderColor: "rgba(244, 67, 54, 1)",
     
        backgroundColor: (context) => setBgGradient(context, "#f44336"),
        tension: 0.4,
        fill: true,
        pointStyle: false,
    };


    return {
        data: {
            labels: stats.value.map(({ start_time }) =>
                format(toTimezone(start_time))
            ),
            datasets: [points_for, points_against]
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
                afterTitle: ([{dataset}]) => {
                    return dataset.label
                },
                 footer: ([d]) => {
                    const data = getPointData([d]);

                     return `This game: ${data.points_for ?? data.points_against}`;
                },

               label: (d) => {
                    const {y} = d.raw;
                    return `${y.toFixed(1)}`
                },
                title: (d) => {
                    const data = getPointData(d);
                    return `${toTimezone(data.start_time, "MMM DD YYYY")}`;
                },
            },
            mode: "x",
            display: false,
            intersect: true,
        },
    };
};


</script>
