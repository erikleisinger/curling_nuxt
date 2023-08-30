<template>
    <!-- -->
    <div ref="statsContainer" class="stats__container row">
        <q-inner-loading
            color="purple"
            label="Loading stats..."
            :showing="loading"
        />
        <!-- <ChartHammerPoints v-if="!loading"/> -->

        <ChartTeamWinLossCard
            :teamId="teamId"
            :wins="wins"
            :losses="losses"
            :ties="ties"
            v-if="!loading"
        />
        <ChartTeamPointsPerGameCard
            :teamId="teamId"
            v-if="!loading"
            :for="pointsForGame"
            :against="pointsAgainstGame"
        />
        <ChartTeamEndsPerGame
            :teamId="teamId"
            v-if="!loading"
            :for="endsForGame"
            :against="endsAgainstGame"
        />
        <ChartTeamHammerEfficiencyCard
            :teamId="teamId"
            v-if="!loading"
            :for="hammerConversions"
            :forces="forceWith"
            :steals="stealsWith"
            :totalEnds="hammerEnds"
        />
        <ChartTeamForceEfficiency
            :teamId="teamId"
            v-if="!loading"
            :for="forceWith"
            :against="forceWithout"
            :totalEnds="nonHammerEnds"
        />
        <ChartTeamStealEfficiency
            :teamId="teamId"
            v-if="!loading"
            :for="stealsWithout"
            :totalEnds="nonHammerEnds"
        />

        <!-- <section name="win loss tie" class="stats__section">
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
        </section> -->

        <!-- <section name="hammer conversion" class="stats__section">
            <div class="row items-center no-wrap total__card--wrap">
                <StatsAggregateCard :score="hammerEfficiencyScore" />
                <div class="column">
                    <h2 class="text-md text-bold">Scoring over time</h2>
                    <h3 class="text-sm">Scoring efficiency with hammer</h3>
                </div>
                :style="getMedalStyle(hammerEfficiencyScore)"
            </div>
            <ChartHammerPointsOverTime />
            <ChartBar
                :data="formattedHammerStats"
                v-if="!loadingStats && formattedHammerStats && visible"
                :max="100"
                percent
            />

            <q-inner-loading color="deep-purple" :showing="loadingStats" />
        </section> -->
        <!-- <section name="hammer conversion" class="stats__section">
            <div class="row items-center no-wrap total__card--wrap">
                <StatsAggregateCard :score="hammerEfficiencyScore" />
                <div class="column">
                    <h2 class="text-md text-bold">Big brain energy</h2>
                    <h3 class="text-sm">Scoring efficiency with hammer</h3>
                </div>
          
            </div>
       
       

            <q-inner-loading color="deep-purple" :showing="loadingStats" />
        </section> -->
        <!-- <section name="hammer conversion" class="stats__section">
            <div class="row items-center no-wrap total__card--wrap">
                <StatsAggregateCard :score="hammerEfficiencyScore" />
                <div class="column">
                    <h2 class="text-md text-bold">How small your ears are</h2>
                    <h3 class="text-sm">Scoring efficiency with hammer</h3>
                </div>
                :style="getMedalStyle(hammerEfficiencyScore)"
            </div>
            <div style="height: 100%">
            <ChartHammerPointsOverTime />
            <ChartBar
                :data="formattedHammerStats"
                v-if="!loadingStats && formattedHammerStats && visible"
                :max="100"
                percent
            />
            </div>

            <q-inner-loading color="deep-purple" :showing="loadingStats" />
        </section> -->

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
        <!-- <section name="defense" class="stats__section" >
            <div class="row items-center no-wrap total__card--wrap">
               <StatsAggregateCard :score="defenseScore"/>
                <div class="column">
                    <h2 class="text-md text-bold">Defense</h2>
                    <h3 class="text-sm">Performance without hammer</h3>
                </div>
                :style="getMedalStyle(hammerEfficiencyScore)" -->
        <!-- </div>

            <ChartBar
                :data="formattedNoHammerStats"
                v-if="!loadingStats && formattedNoHammerStats && visible"
                :max="100"
                percent
            />
            <q-inner-loading color="deep-purple" :showing="loadingStats" />
        </section>  -->

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
$section-margin: var(--space-xs);
.stats__container {
    // height: 100%;
    // padding-top: var(--space-xs);
    border-radius: 8px;
    overflow: auto;
    // scroll-snap-type: y mandatory;

    // scroll-snap-stop: always;

    .total__card--wrap {
        margin-bottom: var(--space-sm);
    }
}
</style>
<script setup>
import {
    useElementSize,
    useScroll,
    useElementVisibility,
    watchDebounced,
    useDebounceFn,
} from "@vueuse/core";

const props = defineProps({
    teamId: Number,
    teamName: {
        type: String,
        default: "<TEAM>",
    },
});

const chart = ref(null);
const index = ref(0);

const winLossChart = ref(null);
const { height: winLossChartHeight } = useElementSize(winLossChart);

const statsContainer = ref(null);
const visible = useElementVisibility(statsContainer);
const disableScroll = ref(false);

const { height: containerHeight } = useElementSize(statsContainer);

const stats = ref(null);

const getMedalStyle = (score) => {
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

const loadingRecord = ref(false);
const getWinsLossess = async () => {
    loadingRecord.value = true;
    const { client, fetchHandler } = useSupabaseFetch();
    const { data } = await fetchHandler(
        () =>
            client.rpc("get_team_wins", {
                team_ids_param: [props.teamId],
            }),
        { onError: "Error fetching data" }
    );
    data.forEach((team) => {
        wins.value += team.wins;
        losses.value += team.losses;
        ties.value += team.ties;
    })

    loadingRecord.value = false;
};

const formattedHammerStats = ref(null);
const formattedNoHammerStats = ref(null);
const formattedHammerPoints = ref(null);
const hammerEfficiencyScore = ref(0);
const defenseScore = ref(0);

const loadingStats = ref(false);

const bandit = ref(0);
const bulwark = ref(0);
const control_freak = ref(0);
const minimalist = ref(0);
const showoff = ref(0);
const strategist = ref(0);
const survivor = ref(0);



const pointsForGame = ref(0);
const pointsAgainstGame = ref(0);
const endsForGame = ref(0);
const endsAgainstGame = ref(0);
const endsPlayed = ref(0);
const forceWith = ref(0);
const forceWithout = ref(0);
const nonHammerEnds = ref(0);
const hammerConversions = ref(0);
const hammerEnds = ref(0);
const blankEnds = ref(0);
const stealsWith = ref(0);
const stealsWithout = ref(0);
const getTeamRecord = async () => {
    const dayjs = useDayjs();

    const client = useSupabaseClient();
    const { data } = await client.from('team_stats').select(`
    *,
    games:game_id (
        start_time
    )
    `).eq('team_id', props.teamId).order('start_time', { foreignTable: 'game_id', ascending: false }).limit(1)
    
    // await client.rpc("get_team_game_statistics", {
    //     team_id_param: props.teamId,
    //     start_time_param: dayjs().toISOString(),
    // }).order('start_time', {ascending: false}).limit(1)
    // 

    const [teamRecord] = data;
    if (!teamRecord) return;
    const {
        hammer_steal_count,
        non_hammer_steal_count,
        blank_ends,
        points_for,
        points_against,
        ends_against,
        ends_for,
        hammer_force_count,
        non_hammer_force_count,
        ends_played,
        non_hammer_end_count,
        hammer_end_count,
        hammer_conversion_count,
    } = teamRecord;

    pointsForGame.value = points_for;
    pointsAgainstGame.value = points_against;
    endsForGame.value = ends_for;
    endsAgainstGame.value = ends_against;
    forceWith.value = hammer_force_count;
    forceWithout.value = non_hammer_force_count;
    endsPlayed.value = ends_played;
    nonHammerEnds.value = non_hammer_end_count;
    hammerConversions.value = hammer_conversion_count;
    hammerEnds.value = hammer_end_count;
    blankEnds.value = blank_ends;
    stealsWith.value = hammer_steal_count;
    stealsWithout.value = non_hammer_steal_count;
};

const currentTeamId = computed(() => props.teamId);
const loading = ref(true);
watchDebounced(
    currentTeamId,
    async () => {
        loading.value = true;

        await Promise.all([getTeamRecord(), getWinsLossess()]);

        loading.value = false;
    },
    { debounce: 1, immediate: true }
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
