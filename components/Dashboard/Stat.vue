<template>
    <DashboardTile
        :type="type"
        :style="{ width: expanded ? '100%' : '' }"
        :percent="totalTile"
        :total="totalAll"
        :expanded="expanded"
        :betterThanAverage="betterThanAverage"
 
    >

        <div class="stat-expanded__container" v-if="expanded" >
            <DashboardStatDetails :type="type" :total="totalAll" :filters="filters" :average="average" :betterThanAverage="betterThanAverage"/>
        </div>
    </DashboardTile>
</template>
<style lang="scss" scoped>
.stat-expanded__container {
    width: 100%;
   
}
</style>
<script setup>
import {
    NON_PERCENT_STATS,
    STAT_FIELDS_TOTAL,
    STAT_TYPES,
} from "@/constants/stats";
import TeamStats from "@/store/models/team-stats";
import TeamStatsTotal from "@/store/models/team-stats-total";

const props = defineProps({
    expanded: Boolean,
    filters: Object,
    type: String,
});

const isPercent = !NON_PERCENT_STATS.includes(props.type);

const cleanNumber = (num) => {
    return Number((num * (isPercent ? 100 : 1)).toFixed(isPercent ? 0 : 1));
};

const {userTeamIds} = useTeam();

const { getCumulativeStat } = useStats();

const filteredTeamIds = computed(() => {
    if (!props.filters?.teams?.length) return userTeamIds.value
    return [...userTeamIds.value].filter((id) => props.filters.teams.includes(id))
})

const totalTile = computed(() => {
    const all = useRepo(TeamStats)
        .query()
        .whereIn("team_id", filteredTeamIds.value)
        .get();

    return cleanNumber(getCumulativeStat(all, STAT_FIELDS_TOTAL[props.type]));
});

const totalAll = computed(() => {
    const all = useRepo(TeamStats)
        .query()
        .whereIn("team_id", userTeamIds.value)
        .get();

    return cleanNumber(getCumulativeStat(all, STAT_FIELDS_TOTAL[props.type]));
});

const STAT_RANK_ORDER = {
    [STAT_TYPES.WINS]: 'wins_average',
    [STAT_TYPES.BLANK_ENDS]: '',
    [STAT_TYPES.ENDS_PER_GAME]: '',
    [STAT_TYPES.FORCE_EFFICIENCY]: 'force_efficiency',
    [STAT_TYPES.HAMMER_EFFICIENCY]: 'hammer_conversion_average',
    [STAT_TYPES.POINTS_PER_GAME]: 'points_for',
    [STAT_TYPES.STEAL_DEFENSE]: 'steal_defense',
    [STAT_TYPES.STEAL_EFFICIENCY]: 'steal_efficiency'
}


const average = computed(() => {
    const all = useRepo(TeamStatsTotal).orderBy(STAT_RANK_ORDER[props.type], 'desc').get()

    const total = all.reduce((all, current) => {
        return all + current[STAT_RANK_ORDER[props.type]]
}, 0)



return total / all.length;
})

const allStats = computed(() => useRepo(TeamStatsTotal).query().get())

const betterThanAverage = computed(() => {
    
    return totalTile.value / 100 > average.value;
})


</script>
