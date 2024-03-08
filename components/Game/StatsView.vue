<template>
    <div
        class="full-height no-wrap column"

       
    >
        <div
            class="stats__container column no-wrap col-12"
        >
            <div
                class="column no-wrap stat-column"
                v-for="(stat, index) in statTypes"
                :key="`percentage-${stat}`"
            >
                <div class=" row no-wrap justify-center">
                    <div>
                        <h2 class=" text-center full-width">
                            {{STAT_NAMES[stat]}}
                        </h2>
                        <h3>{{STAT_DESCRIPTIONS[stat]}}</h3>
                    </div>
                </div>

                <div class="row no-wrap" >
                    <div
                        class="col-6"
                    >
                        <StatsPercent
                            class="full-width"
                            :stat="stat"
                            dense
                            :color="teams?.home?.color"
                            prependPercent
                            reverse
                            :stats="homeStats || {}"
                            oneWay
                            height="20px"
                        />
                    </div>
                    <div
                     class="col-6"
                    >
                        <StatsPercent
                            class="full-width"
                            :stat="stat"
                          height="20px"
                              :color="teams?.away?.color"
                             :stats="awayStats || {}"
                             oneWay
                        />
                    </div>
                </div>
                <div class="full-width row justify-between text-caption"  v-if="!isLoading && teams?.home?.stats">
                    <GameAverageComparison v-if="teams?.home?.team_id" :stats="teams.home.stats" :statName="stat"/>
             <GameAverageComparison v-if="teams?.away?.team_id" :stats="teams.away.stats" :statName="stat" reverse />
      
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.team-avatar__container {
    width: 2.5em;
}
.stats__container {
    padding: 0px var(--space-md);
    border-radius: 8px;
}
.stat-column {
    padding: var(--space-md) 0px;
    h2 {
        @include smmd-text;
    }
    h3 {
        font-family: $font-family-secondary;
        text-align:center;
        @include text-caption;
        margin-bottom: var(--space-xs);
    }
}

</style>
<script setup>
import {STAT_DESCRIPTIONS, STAT_NAMES, STAT_TYPES} from '@/constants/stats'
import GameTeam from '@/store/models/game-team'
import TeamStats from '@/store/models/team-stats'
import TeamStatsTotal from '@/store/models/team-stats-total'
import {useQuery} from '@tanstack/vue-query'
import {Stats} from '@/store/models/stats/stats'

const props = defineProps({
    gameId: Number,
});

const EXCLUDE = [STAT_TYPES.BLANK_ENDS, STAT_TYPES.HAMMER_PERFORMANCE, STAT_TYPES.HAMMER_FIRST_END, STAT_TYPES.HAMMER_LAST_END, STAT_TYPES.WINS, STAT_TYPES.POINTS_FOR_PER_GAME, STAT_TYPES.ENDS_FOR_PER_GAME, STAT_TYPES.ENDS_AGAINST_PER_GAME, STAT_TYPES.POINTS_AGAINST_PER_GAME, STAT_TYPES.POINTS_FOR_PER_GAME, STAT_TYPES.POINTS_PER_END]
const statTypes = Object.values(STAT_TYPES).filter((type) => !EXCLUDE.includes(type))

const teams = computed(() => {
    return {
        home: useRepo(GameTeam).with('stats').where('game_id', props.gameId).offset(0).first(),
        away: useRepo(GameTeam).with('stats').where('game_id', props.gameId).offset(1).first()
    }
})

const homeStats = computed(() => new Stats([teams.value?.home?.stats ?? {}] ));
const awayStats = computed(() => new Stats([teams.value?.away?.stats ?? {}] ));

const getStatsForGame = async () => {
    const { data } = await useSupabaseClient()
        .from("team_stats")
        .select(
            `
            *
            
            `
        )
        .eq("game_id", props.gameId);
    if (!data?.length) return null;
    data.forEach((stat) => {
        if (!stat.team_id) cleanupOpposition.value = true;
        useRepo(TeamStats).save(stat);
    });

    const { data: totalData } = await useSupabaseClient()
        .from("team_stats_total")
        .select(
            `
            *
            `
        )
        .in("id", [teams.value.home.team_id, teams.value.away.team_id]);

        totalData.forEach((total) => {
            useRepo(TeamStatsTotal).save({
                ...total,
                team_id: total.id,
            })
        })


    return data;
};



const {isLoading} = useQuery({
    queryKey: ['game', 'stats', props.gameId],
    queryFn: getStatsForGame,
    refetchOnWindowFocus: false,
})

const $q = useQuasar();
const reloading = ref(false);


// Var that indicates we should remove
// The team-stat from piniaOrm for the opposition
// when component unmounts
const cleanupOpposition = ref(false);
const cleanupOppositionStats = () => {
    useRepo(TeamStats).destroy(`[${teams.value?.away?.id},${props.gameId}]`);
};
onBeforeUnmount(() => {
    if (cleanupOpposition.value) cleanupOppositionStats();
});

</script>
<script>
export default {
    name: "GameStatsView",
};
</script>
