<template>
    <!-- -->
    <div ref="statsContainer" class="stats__container row">
            <div class="row justify-center full-width q-px-sm" style="">
               <Badge badge="showoff"/>
                                     <Badge />
                                       <Badge badge="bulwark"/>
        </div>
        <section name="win loss tie" class="stats__section">
            <h2 class="text-md text-bold">Wins / Losses</h2>
            <div
                class="row justify-center q-pa-lg"
                :style="{
                    marginTop: `-${winLossChartHeight / 3.5}px`,
                    marginBottom: `-${winLossChartHeight / 3.5}px`,
                }"
            >
                <ChartWinLossTie
                    ref="winLossChart"
                    :data="[wins, losses, ties]"
                    v-if="!loadingRecord && visible"
                />
            </div>
        </section>
    
        <section name="hammer conversion" class="stats__section">
            <div class="row items-center no-wrap total__card--wrap">
                   <div
                    class="row justify-center items-center total__card col-grow"
                >
                    <!-- <q-icon name="hotel_class" size="lg"/> -->
                    <div class="total__card--inner text-bold">
                        {{ hammerEfficiencyScore }}
                    </div>
                </div>
                <div class="column">
                    <h2 class="text-md text-bold">Hammer efficiency</h2>
                    <h3 class="text-sm">Scoring efficiency with hammer</h3>
                </div>
                <!-- :style="getMedalStyle(hammerEfficiencyScore)" -->
             
            </div>

            <ChartBar
                :data="formattedHammerStats"
                v-if="!loadingStats && formattedHammerStats && visible"
                :max="100"
                percent
            />

            <q-inner-loading color="deep-purple" :showing="loadingStats" />
        </section>
        <!-- <section name="hammer scoring" class="stats__section">
            <div class="row items-center no-wrap total__card--wrap">
                 <div
                    class="row justify-center items-center total__card col-grow"
                >
          
                    <div class="total__card--inner text-bold">
                        {{ hammerEfficiencyScore }}
                    </div>
                </div>
                <div class="column">
                    <h2 class="text-md text-bold">Hammer scoring</h2>
                    <h3 class="text-sm">
                        Points scored when {{ props.teamName }} has hammer
                    </h3>
                </div>
               
            </div>
            <ChartBarVertical
                :data="formattedHammerPoints"
                v-if="!loadingStats && formattedHammerPoints && visible"
                axis="x"
            />
            <q-inner-loading color="deep-purple" :showing="loadingStats" />
        </section> -->
        <section name="defense" class="stats__section">
             <div class="row items-center no-wrap total__card--wrap">
                   <div
                    class="row justify-center items-center total__card col-grow"
                >
                    <!-- <q-icon name="hotel_class" size="lg"/> -->
                    <div class="total__card--inner text-bold">
                        {{ defenseScore }}
                    </div>
                </div>
                <div class="column">
                      <h2 class="text-md text-bold">Defense</h2>
            <h3 class="text-sm">Performance without hammer</h3>
                </div>
                <!-- :style="getMedalStyle(hammerEfficiencyScore)" -->
             
            </div>

       
            <ChartBar
                :data="formattedNoHammerStats"
                v-if="!loadingStats && formattedNoHammerStats && visible"
                :max="100"
                percent
            />
            <q-inner-loading color="deep-purple" :showing="loadingStats" />
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
.stats__container {
    padding-top: var(--space-xs);
    border-radius: 8px;
    .stats__section {
        border-radius: 0px;
        box-shadow: $pretty-shadow;
        margin: var(--space-xs);
        padding: var(--space-sm);
        aspect-ratio: 3/2;
        position: relative;
        width: calc(100% - var(--space-md));
        @include sm {
            width: calc(50% - var(--space-md));
        }
    }
    .total__card--wrap {
        margin-bottom: var(--space-sm);
  .total__card {
        border-radius: 24px;
        border: 1px solid $grey-5;
        padding: var(--space-xxs);
        aspect-ratio: 1/1;
        font-size: 2em;
        width: 25%;
        max-width: 25%;
        margin-right: var(--space-xxs);
        position: relative;
        box-shadow: $pretty-shadow-2;
        .total__card--inner {
            position: relative;
            color: rgba(0, 0, 0, 0.8);
            &:after {
                position: absolute;
                content: "/10";
                font-size: 0.3em !important;
                bottom: 0.5em;
                right: -1em;
                margin-left: calc(var(--space-sm) * -1);
                font-weight: normal;
            }
        }
    }
    }
  
}
</style>
<script setup>
import {
    useElementSize,
    useElementVisibility,
    watchDebounced,
} from "@vueuse/core";

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
const stats = ref(null);

const getMedalStyle = (score) => {
    console.log("medal style: ", score);
    if (Number.isNaN(score)) return "white";
    if (score > 5) {
        return {
            backgroundColor: "yellow",
            color: "black",
        };
    } else if (score > 3) {
        return {
            backgroundColor: "orange",
            color: "black",
        };
    }
};

const wins = ref(0);
const losses = ref(0);
const ties = ref(0);

const formattedHammerStats = ref(null);
const formattedNoHammerStats = ref(null);
const formattedHammerPoints = ref(null);
const hammerEfficiencyScore = ref(0);
const defenseScore = ref(0)

const loadingStats = ref(false);

const getGameStats = async () => {
    loadingStats.value = true;
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
        failed_force_end_count,
        forced_end_count,
        hammer_1_point_count,
        hammer_blank_count,
        hammer_ends_count,
        hammer_steal_count,
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

    const getHammerEfficiencyScore = () => {
        const totalEnds = hammer_ends_count - hammer_blank_count;
        const twoPts = addPointCounts(2,8);
        console.log('two: ', twoPts, totalEnds)
        // const twoPts = 3;
        const forces = hammer_1_point_count;
        console.log('forces: ', forces)
        const subtotal = twoPts * 1 + forces * 0.5;
        return ((subtotal / totalEnds) * 10).toFixed(1);
    };

       const getDefenseScore = () => {
        const totalEnds = total_ends_played - hammer_ends_count;
        const stolen = stolen_end_count;
        const forces = forced_end_count;
        const subtotal = stolen * 1 + forces * 0.5;
        return ((subtotal / totalEnds) * 10).toFixed(1);
    };



    hammerEfficiencyScore.value = getHammerEfficiencyScore();

    defenseScore.value = getDefenseScore();

    formattedHammerStats.value = [
        {
            y: "2+",
            percent: toPercent(
                addPointCounts(2, 8) / (hammer_ends_count - hammer_blank_count)
            ),
            rawValue: addPointCounts(2, 8),
            total: hammer_ends_count - hammer_blank_count,
            description: `Scored 2+ points`,
            title: "Hammer conversion",
        },
        {
            y: "Force",
            percent: toPercent(
                hammer_1_point_count / (hammer_ends_count - hammer_blank_count)
            ),
            rawValue: hammer_1_point_count,
            total: hammer_ends_count - hammer_blank_count,
            title: "Forced",
            description: `Forced to take 1 point`,
        },
        {
            y: "Blank",
            percent: toPercent(hammer_blank_count / hammer_ends_count),
            rawValue: hammer_blank_count,
            total: hammer_ends_count,
            description: `Elected to blank the end (0 points)`,
            title: "Blank end",
        },
        {
            y: "Steal",
            percent: toPercent(
                hammer_steal_count / (hammer_ends_count - hammer_blank_count)
            ),
            rawValue: hammer_steal_count,
            total: hammer_ends_count,
            description: `Opposition stole 1+ points`,
            title: "Stolen end",
        },
    ];
    //
    formattedHammerPoints.value = Array.from(Array(9).keys()).map((key) => {
        return {
            x: `${key}`,
            y: `${key}`,
            percent: toPercent(
                stats.value[
                    key === 0
                        ? "hammer_blank_count"
                        : `hammer_${key}_point_count`
                ] /
                    (hammer_ends_count - hammer_steal_count)
            ),
            rawValue:
                stats.value[
                    key === 0
                        ? "hammer_blank_count"
                        : `hammer_${key}_point_count`
                ],
            total: hammer_ends_count - hammer_steal_count,
            description: "",
            title: `Scored ${key} point${key !== 1 ? "s" : ""} ${
                key === 0 ? "(blanked)" : ""
            }`,
        };
    });

    //  [
    //     {
    //         y: "0",
    //         percent: toPercent(
    //             addPointCounts(2, 8) / (hammer_ends_count - hammer_blank_count)
    //         ),
    //         rawValue: addPointCounts(2, 8),
    //         total: hammer_ends_count - hammer_blank_count,
    //         description: `Scored 2+ points with hammer`,
    //         title: "Hammer conversion",
    //     },
    // ];

    formattedNoHammerStats.value = [
        {
            y: "Steal",
            percent: toPercent(
                stolen_end_count / (total_ends_played - hammer_ends_count)
            ),
            rawValue: stolen_end_count,
            total: total_ends_played - hammer_ends_count,
            description: `Stole 1+ points`,
            title: "Stolen ends",
        },
        {
            y: "Force",
            percent: toPercent(
                forced_end_count / (total_ends_played - hammer_ends_count)
            ),
            rawValue: forced_end_count,
            total: total_ends_played - hammer_ends_count,
            description: `Forced opposition to take 1 point`,
            title: "Forced end",
        },
        {
            y: "2+",
            percent: toPercent(
                failed_force_end_count / (total_ends_played - hammer_ends_count)
            ),
            rawValue: failed_force_end_count,
            total: total_ends_played - hammer_ends_count,
            description: `Opposition took 2+ points`,
            title: "Failed to force",
        },

        //    {
        //     y: "Hammer possession",
        //     percent: toPercent(hammer_ends_count / total_ends_played),
        //     rawValue: hammer_ends_count,
        //     total: total_ends_played,
        //     description: `Ends where ${props.teamName} had hammer`,
        // },
    ];

    // // Of all ends played, what % of the time did the team have the hammer?
    // controlOfGame.value = toPercent(hammer_ends_count / total_ends_played); // DONE

    // // How many ends did they steal?
    // stolenEnds.value = toPercent(
    //     stolen_end_count / (total_ends_played - hammer_ends_count) // DONE
    // );

    // // Hammer efficiency -- scored 2+ points with hammer. NOT INCLUDING blanks
    // hammerConversion.value = toPercent(
    //     addPointCounts(2, 8) / (hammer_ends_count - hammer_blank_count) // DONE
    // );

    // // Blank ends: % of ends with hammer when score was 0
    // blankEnds.value = toPercent(hammer_blank_count / hammer_ends_count); // DONE

    // // forced with hammer: % of ends with hammer when team only scored 1
    // forcedWith.value = toPercent(
    //     hammer_1_point_count / (hammer_ends_count - hammer_blank_count)
    // );

    // // forced opposition to take one when they had hammer
    // forceWithout.value = toPercent(
    //     forced_end_count / (total_ends_played - hammer_ends_count) // DONE
    // );

    // // Average points conceded without hammer
    // avgPointsConceded.value = avg_points_conceded.toFixed(2);
    loadingStats.value = false;
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

const currentTeamId = computed(() => props.teamId);
watchDebounced(
    currentTeamId,
    () => {
        getGameStats();

        getWinsLossess();
    },
    { debounce: 500, immediate: true }
);

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
