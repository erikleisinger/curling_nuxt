<template>
    <DashboardStatDetailsItemTemplate positive v-model="expanded" :color="getColor(STAT_COLORS[type])">
        <template v-slot:title>
            {{ rinkName }}
        </template>
        <template v-slot:subtitle> Click to show leaderboard </template>
        <template v-slot:value>
                 <h5>#{{ teamIndex + 1}}</h5>
        </template>
        <template v-slot:more> 
            <div v-if="expanded">
                 <div class="full-width row justify-center show-less__container">
                <Button flat @click="showLess" v-if="!!firstIndex">Show less</Button>
            </div>
            <DashboardStatRinkRank v-for="stat in rinkStats.slice(firstIndex, firstIndex + CURSOR_INCREMENT)" :key="stat.team_id" :rank="stat.rank" :stat="stat" :type="type" :color="getColor(STAT_COLORS[type])"/>
            <div class="full-width row justify-center show-more__container">
                <Button flat @click="showMore" v-if="toShow < rinkStats?.length">Show more</Button>
            </div>
            </div>
        </template>
    </DashboardStatDetailsItemTemplate>
</template>
<style lang="scss" scoped>
.row__container {

    h5 {
        @include md-text;
    }


 
}
   .show-more__container {
        margin-top: var(--space-sm);
    }
    .show-less__container {

    }
</style>
<script setup>
import TeamStatsTotal from "@/store/models/team-stats-total";
import TeamStats from "@/store/models/team-stats";
import Rink from "@/store/models/rink";
import { INVERTED_STATS, NON_PERCENT_STATS, STAT_RANK_ORDER, STAT_FIELDS_TOTAL , STAT_COLORS } from "@/constants/stats";

const props = defineProps({
    average: Number,
    rinkId: Number,
    teamId: Number,
    type: String,
});

const { getColor } = useColor();


const rinkStats = computed(() =>
    useRepo(TeamStatsTotal)
        .query()
        .with("team")
        .where("rink_id", props.rinkId)
        .orderBy((val) => STAT_RANK_ORDER[props.type](val), INVERTED_STATS.includes(props.type) ? 'asc' : 'desc')
        .get().map((i, index) => ({
        rank: index + 1,
        ...i
    }))
);

const all = computed(() => useRepo(TeamStatsTotal)
        .query()
        .with("team")
        .where("rink_id", props.rinkId)
        .get()
)

// const {getCumulativeStat} = useStats()

// const avgAtThisRink = computed(() => 
//     Number((getCumulativeStat(useRepo(TeamStats).
//     query()
//     .where('rink_id', props.rinkId)
//     .whereIn('team_id', props.teamId ? [props.teamId] : userTeamIds.value)
//     .get(), STAT_FIELDS_TOTAL[props.type]) * (isPercent ? 100 : 1)).toFixed(isPercent ? 0 : 1))
// )

const {userTeamIds} = useTeam();

const getTeamIndex = () => {
    let index;
    if (props.teamId) {
        index = rinkStats.value.findIndex(({team_id}) => team_id === props.teamId);
    } else {
        index = rinkStats.value.findIndex(({team_id}) => userTeamIds.value.includes(team_id))
    }

    return index;
}

const getFirstIndex = () => {
    const index = getTeamIndex();
    if ((index - CURSOR_INCREMENT / 2) < 0)  return 0;
    return index - CURSOR_INCREMENT / 2
}

const firstIndex = ref(getFirstIndex())
const teamIndex = ref(getTeamIndex())

const rinkAvg = computed(() => {
    const total = rinkStats.value.reduce((all, current) => {
        return all + STAT_RANK_ORDER[props.type](current);
    }, 0);

    return total / rinkStats.value.length;
});

const rinkName = computed(
    () =>
        useRepo(Rink).where("id", props.rinkId).first()?.name ?? "Unknown rink"
);

const isPercent = !NON_PERCENT_STATS.includes(props.type);

// const diff = computed(() => avgAtThisRink.value - props.average);

const expanded = ref(false);

const CURSOR_INCREMENT = 6;
const toShow = ref(firstIndex.value + CURSOR_INCREMENT)

const showMore = () => {
    // if (toShow.value >= rinkStats.value?.length) return;
    // toShow.value += CURSOR_INCREMENT;
    //  if (!firstIndex.value) return;
    if (firstIndex.value + CURSOR_INCREMENT > rinkStats.length) {
        firstIndex.value = rinkStats.length - CURSOR_INCREMENT;
    } else {
            firstIndex.value += CURSOR_INCREMENT;
    }
    
}

const showLess = () => {
    if (!firstIndex.value) return;
    if (firstIndex.value - CURSOR_INCREMENT < 0){
firstIndex.value = 0;
    } else {
firstIndex.value -= CURSOR_INCREMENT;
    }
    
}

watch(() => props.teamId, () => {
    firstIndex.value = getFirstIndex();
    teamIndex.value = getTeamIndex();
    toShow.value = firstIndex.value + CURSOR_INCREMENT
})
</script>
