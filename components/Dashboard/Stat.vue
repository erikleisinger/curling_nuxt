<template>

        <DashboardTile
            :type="type"
            :style="{ width: expanded ? '100%' : '' }"
            :percent="totalTile"
            :total="totalAll"
            :expanded="expanded"
            :betterThanAverage="betterThanAverage"
            ref="tile"
        >
            <template v-slot:stat>
                <div
                    :style="`width: ${tileWidth}px; height: 80px`"
                    v-if="!expanded"
                >
                    <DashboardLineChart
                        :data="[...chartPoints].slice(chartPoints.length < 5 ? 0 : chartPoints.length - 5)"
                        :maintain="false"
                    />
                </div>
            </template>
            <template v-slot:stat-expanded>
                <div style="width: 100%; height: 100%">
                <DashboardLineChart
                    :data="chartPoints"
                    :maintain="false"
                    labels
                />
                </div>
            </template>

            <div class="stat-expanded__container" v-if="expanded">
                <!-- <DashboardLineChart :data="chartPoints" /> -->
                <DashboardStatDetails
                    :type="type"
                    :total="totalAll"
                    :filters="filters"
                    :average="average"
                    :betterThanAverage="betterThanAverage"
                />
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
import { useElementSize } from "@vueuse/core";
const props = defineProps({
    expanded: Boolean,
    filters: Object,
    type: String,
});

const isPercent = !NON_PERCENT_STATS.includes(props.type);

const cleanNumber = (num) => {
    return Number((num * (isPercent ? 100 : 1)).toFixed(isPercent ? 0 : 1));
};

const { userTeamIds } = useTeam();

const { getCumulativeStat } = useStats();

const filteredTeamIds = computed(() => {
    if (!props.filters?.teams?.length) return userTeamIds.value;
    return [...userTeamIds.value].filter((id) =>
        props.filters.teams.includes(id)
    );
});

const allStats = computed(() =>
    useRepo(TeamStats).query().whereIn("team_id", filteredTeamIds.value).get()
);

const CUMULATIVE_CHART_STATS = [STAT_TYPES.WINS, STAT_TYPES.HAMMER_LAST_END];

const chartPoints = computed(() => {
    return allStats.value.map((data, index) => {
        if (CUMULATIVE_CHART_STATS.includes(props.type))
            return getCumulativeStat(
                allStats.value.slice(0, index + 1),
                STAT_FIELDS_TOTAL[props.type]
            );
        return STAT_FIELDS_TOTAL[props.type](data);
    });
});

const totalTile = computed(() =>
    cleanNumber(
        getCumulativeStat(allStats.value, STAT_FIELDS_TOTAL[props.type])
    )
);

const totalAll = computed(() => {
    const all = useRepo(TeamStats)
        .query()
        .whereIn("team_id", userTeamIds.value)
        .get();

    return cleanNumber(getCumulativeStat(all, STAT_FIELDS_TOTAL[props.type]));
});

const STAT_RANK_ORDER = {
    [STAT_TYPES.WINS]: "wins_average",
    [STAT_TYPES.BLANK_ENDS]: "",
    [STAT_TYPES.ENDS_PER_GAME]: "",
    [STAT_TYPES.HAMMER_LAST_END]: "hammer_last_end",
    [STAT_TYPES.FORCE_EFFICIENCY]: "force_efficiency",
    [STAT_TYPES.HAMMER_EFFICIENCY]: "hammer_conversion_average",
    [STAT_TYPES.POINTS_PER_GAME]: "points_for",
    [STAT_TYPES.STEAL_DEFENSE]: "steal_defense",
    [STAT_TYPES.STEAL_EFFICIENCY]: "steal_efficiency",
};

const average = computed(() => {
    const all = useRepo(TeamStatsTotal)
        .orderBy(STAT_RANK_ORDER[props.type], "desc")
        .get();

    const total = all.reduce((all, current) => {
        return all + current[STAT_RANK_ORDER[props.type]];
    }, 0);

    return total / all.length;
});

const betterThanAverage = computed(() => {
    return totalTile.value / 100 > average.value;
});

const tile = ref(null);

const { width } = useElementSize(document.getElementById("dashboard"));

const $q = useQuasar();

const tileWidth = computed(
    () => ($q.screen.xs ? width.value / 2 : width.value / 3) - 30
);
</script>
