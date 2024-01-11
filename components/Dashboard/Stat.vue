<template>
    <DashboardTile
        :type="type"
        :style="{ width: expanded ? '100%' : '' }"
        :percent="total"
    >
        <div class="stat-expanded__container" v-if="expanded">
            <DashboardStatDetails :type="type" :total="total" :filters="filters"/>
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
const props = defineProps({
    expanded: Boolean,
    filters: Object,
    percent: Number,
    type: String,
});

const isPercent = !NON_PERCENT_STATS.includes(props.type);

const cleanNumber = (num) => {
    return Number((num * (isPercent ? 100 : 1)).toFixed(isPercent ? 0 : 1));
};

const {userTeamIds} = useTeam();

const { getCumulativeStat } = useStats();
const total = computed(() => {
    const all = useRepo(TeamStats)
        .query()
        .whereIn("team_id", userTeamIds.value)
        .get();
        // if (props.type === STAT_TYPES.POINTS_PER_GAME) {
        //     console.log(getCumulativeStat(all, STAT_FIELDS_TOTAL[props.type]))
        //     console.log(STAT_FIELDS_TOTAL[props.type])
        // }
    return cleanNumber(getCumulativeStat(all, STAT_FIELDS_TOTAL[props.type]));
});
</script>
