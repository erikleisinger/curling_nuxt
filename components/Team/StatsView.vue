<template>
    <!-- -->
    <div ref="statsContainer">
        <section name="win loss tie" class="stats__section">
            <h2 class="text-md text-bold">Wins / Losses</h2>
            <div
                class="row justify-center q-pa-lg"
                :style="{
                    marginTop: `-${winLossChartHeight / 4}px`,
                    marginBottom: `-${winLossChartHeight / 4}px`,
                }"
            >
                <ChartWinLossTie
                    style="max-height: 200px"
                    ref="winLossChart"
                    :data="[wins, losses, ties]"
                    v-if="!loadingRecord && visible"
                />
            </div>
        </section>
        <section name="hammer conversion" class="stats__section">
            <h2 class="text-md text-bold">Hammer conversion</h2>
            <h3 class="text-sm">
                Points scored when {{ props.teamName }} has hammer
            </h3>

          
                <ChartBar
                    :data="formattedHammerStats"
                    v-if="formattedHammerStats && visible"
                />
          
        </section>
        <section name="defense" class="stats__section">
            <h2 class="text-md text-bold">Defense</h2>
            <h3 class="text-sm">Performance without hammer</h3>
   
                <ChartBar
                    :data="formattedNoHammerStats"
                    v-if="formattedNoHammerStats && visible"
                />
      
        </section>

        <!-- <div>
        <h1>Offense</h1>
          <h2 >With hammer</h2>
   <label>Hammer possession</label>
    <div class="percent">{{controlOfGame}}</div> 

     <label>Hammer conversion</label>
    <div class="subtitle">2+ points scored</div>
    <div class="percent">{{hammerConversion}}</div>
      <label>Blank ends</label>
    <div class="percent">{{blankEnds}}</div>
        <label>Forced with hammer</label>
    <div class="percent">{{forcedWith}}</div>
    </div>
    <div class="text-right">
         <h1 >Defense</h1>
         <h2 >Without hammer</h2>
             <label>Steal efficiency</label>
    <div class="percent">{{stolenEnds}}</div>
          <label>Force efficiency</label>
    <div class="percent">{{forceWithout}}</div>
              <label>Average points conceded</label>
    <div>{{avgPointsConceded}}</div>
    </div>
-->
    </div>
</template>
<style lang="scss" scoped>
.stats__section {
    border-radius: 0px;
    box-shadow: $pretty-shadow;
    margin-bottom: var(--space-xs);
    margin-top: var(--space-xs);
    padding: var(--space-sm);
}
</style>
<script setup>
import { useElementSize, useElementVisibility } from "@vueuse/core";

const props = defineProps({
    teamId: Number,
    teamName: {
        type: String,
        default: "<TEAM>",
    },
});

const winLossChart = ref(null);
const { height: winLossChartHeight } = useElementSize(winLossChart);

const statsContainer = ref(null);
const visible = useElementVisibility(statsContainer);
const route = useRoute();
const stats = ref(null);
const wins = ref(0);
const losses = ref(0);
const ties = ref(0);
const controlOfGame = ref(null);
const stolenEnds = ref(null);
const hammerConversion = ref(null);
const blankEnds = ref(null);
const forcedWith = ref(null);
const forceWithout = ref(null);
const avgPointsConceded = ref(null);
const formattedHammerStats = ref(null);
const formattedNoHammerStats = ref(null);
const getGameStats = async () => {
    const { client, fetchHandler } = useSupabaseFetch();
    const { data } = await fetchHandler(
        () =>
            client.rpc("get_team_stats", {
                team_id_param: props.teamId,
            }),
        { onError: "Error fetching game stats." }
    );
    const [s] = data;
    stats.value = s;
    const {
        avg_points_conceded,
        forced_end_count,
        hammer_1_point_count,
        hammer_blank_count,
        hammer_ends_count,
        stolen_end_count,
        total_ends_played,
    } = stats.value;

    //  {
    //             y: "Hammer possession",
    //             percent: 20,
    //             rawValue: "2",
    //             total: "3",
    //             description: "Ends where you had hammer",
    //         },

    formattedHammerStats.value = [
        {
            y: "2+",
            percent: toPercent(
                addPointCounts(2, 8) / (hammer_ends_count - hammer_blank_count)
            ),
            rawValue: addPointCounts(2, 8),
            total: hammer_ends_count - hammer_blank_count,
            description: `Scored 2+ points with hammer`,
            title: "Hammer conversion",
        },
        {
            y: "1",
            percent: toPercent(
                hammer_1_point_count / (hammer_ends_count - hammer_blank_count)
            ),
            rawValue: hammer_1_point_count,
            total: hammer_ends_count - hammer_blank_count,
            title: "Forces",
            description: `Ends where ${props.teamName} was forced to 1`,
        },
        {
            y: "0",
            percent: toPercent(hammer_blank_count / hammer_ends_count),
            rawValue: hammer_blank_count,
            total: hammer_ends_count,
            description: ``,
            title: "Blank frequency",
        },
    ];

    formattedNoHammerStats.value = [
        {
            y: "Steals",
            percent: toPercent(
                stolen_end_count / (total_ends_played - hammer_ends_count)
            ),
            rawValue: stolen_end_count,
            total: total_ends_played - hammer_ends_count,
            description: `Ends stolen by ${props.teamName}`,
            title: "Stolen ends",
        },
        {
            y: "Forces",
            percent: toPercent(
                forced_end_count / (total_ends_played - hammer_ends_count)
            ),
            rawValue: forced_end_count,
            total: total_ends_played - hammer_ends_count,
            description: `Opposition forced to take 1 point`,
            title: "Forces",
        },

        //    {
        //     y: "Hammer possession",
        //     percent: toPercent(hammer_ends_count / total_ends_played),
        //     rawValue: hammer_ends_count,
        //     total: total_ends_played,
        //     description: `Ends where ${props.teamName} had hammer`,
        // },
    ];

    // Of all ends played, what % of the time did the team have the hammer?
    controlOfGame.value = toPercent(hammer_ends_count / total_ends_played); // DONE

    // How many ends did they steal?
    stolenEnds.value = toPercent(
        stolen_end_count / (total_ends_played - hammer_ends_count) // DONE
    );

    // Hammer efficiency -- scored 2+ points with hammer. NOT INCLUDING blanks
    hammerConversion.value = toPercent(
        addPointCounts(2, 8) / (hammer_ends_count - hammer_blank_count) // DONE
    );

    // Blank ends: % of ends with hammer when score was 0
    blankEnds.value = toPercent(hammer_blank_count / hammer_ends_count); // DONE

    // forced with hammer: % of ends with hammer when team only scored 1
    forcedWith.value = toPercent(
        hammer_1_point_count / (hammer_ends_count - hammer_blank_count)
    );

    // forced opposition to take one when they had hammer
    forceWithout.value = toPercent(
        forced_end_count / (total_ends_played - hammer_ends_count) // DONE
    );

    // Average points conceded without hammer
    avgPointsConceded.value = avg_points_conceded.toFixed(2);
};
const loadingRecord = ref(false);
const getWinsLossess = async () => {
    loadingRecord.value = true;
    const { client, fetchHandler } = useSupabaseFetch();
    const { data } = await fetchHandler(
        () =>
            client.rpc("get_team_wins", {
                team_id_param: props.teamId,
            }),
        { onError: "Error fetching data" }
    );
    wins.value = data.wins;
    losses.value = data.losses;
    ties.value = data.ties;
    loadingRecord.value = false;
};
onBeforeMount(async () => {
    getGameStats();

    getWinsLossess();
});

// Utils

const addPointCounts = (start, end) => {
    if (start < 1 || end > 8) return;
    let sum = 0;
    for (let x = start; x < end; x++) {
        sum += stats.value[`hammer_${x}_point_count`];
    }
    return sum;
};

const toPercent = (num) => {
    return (num * 100).toFixed();
};
</script>
