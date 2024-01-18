<template>
    <DashboardTile
        :type="type"
        :style="{ width: expanded ? '100%' : '' }"
        :percent="totalTile"
        :total="totalAll"
        :expanded="expanded"
        :betterThanAverage="betterThanAverage"
        ref="tile"
        @close="emit('close')"
    >
        <template v-slot:stat>
            <div
                :style="`width: ${tileWidth}px; height: 80px`"
                v-if="!expanded"
            >
                <DashboardLineChart
                    :data="
                        [...chartPoints].slice(
                            chartPoints.length < 5 ? 0 : chartPoints.length - 5
                        )
                    "
                    :maintain="false"
                    :color="getColor(STAT_COLORS[type])"
                 
                />
             
            </div>
        </template>
        <template v-slot:stat-expanded>
            <div
                style="width: 100%; height: 100%"
                class="line-chart__container"
            >
                <!--  -->
                <DashboardStatGameDetails
                    :data="gameInfo"
                    :type="type"
                    v-model="showGameInfo"
                   
                />
                <div style="height: 250px">
                    <div
                        class="game-line__indicator"
                        v-if="showGameInfo"
                        :style="{
                            left: `${leftPoint}px`,
                            borderColor: 'rgba(255,255,255,0.6)'
                        }"
                    />
                    <!-- borderColor: getColor(STAT_COLORS[type]), -->
                    <DashboardLineChart
                        :data="chartPoints"
                        :maintain="false"
                        labels
                        clickable
                        @click="onClick"
                       
                        :color="getColor(STAT_COLORS[type] ?? 'blue')"
                        v-model="chart"
                 
                    />
                     
                 
                </div>
                <div
                    class="full-width row justify-center clickable q-pt-lg text-caption"
                    v-if="!isCumulative"
                    @click="showCumulative = !showCumulative"
                >
                    <Rings
                        :twelveft="
                            showCumulative
                                ? getColor(STAT_COLORS[type])
                                : getColor('slate')
                        "
                        :fourft="
                            showCumulative
                                ? getColor(STAT_COLORS[type])
                                : getColor('slate')
                        "
                        size="1.5em"
                        class="q-mr-xs"
                    />Cumulative
                </div>
            </div>
        </template>

        <div class="stat-expanded__container" v-if="expanded">
            <DashboardStatDetails
                :type="type"
                :total="totalAll"
                :filters="filters"
                :average="totalTile"
                :betterThanAverage="betterThanAverage"
                :worldwide="average"
                 @view="viewOnChart"
            />
        </div>
    </DashboardTile>
</template>
<style lang="scss" scoped>
.stat-expanded__container {
    width: 100%;
}
.line-chart__container {
    position: relative;
}
.game-line__indicator {
    position: absolute;
    height: 100%;
    width: 3px;
    border-left: 1px solid;
    border-right: 1px solid;
    animation: scale 0.2s forwards;
}
@keyframes scale {
    0% {
        transform: scaleY(0);
    }
    100% {
        transform: scaleY(1);
    }
}
</style>
<script setup>
import {
    NON_PERCENT_STATS,
    STAT_COLORS,
    STAT_FIELDS_TOTAL,
    STAT_TYPES,
} from "@/constants/stats";
import TeamStats from "@/store/models/team-stats";
import TeamStatsTotal from "@/store/models/team-stats-total";
import { useElementSize, onClickOutside, useDebounceFn } from "@vueuse/core";
const props = defineProps({
    expanded: Boolean,
    filters: Object,
    type: String,
});

const { getColor } = useColor();
const emit = defineEmits(["close", "scroll"]);

const isPercent = !NON_PERCENT_STATS.includes(props.type);

const cleanNumber = (num) => {
    if (Number.isNaN(num)) return 0;
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
    useRepo(TeamStats)
        .query()
        .whereIn("team_id", filteredTeamIds.value)
         .where('rink_id', (val) => {
            return props.filters.rink ? val === props.filters.rink : true
        })
        .where('sheet_id', (val) => {
            return props.filters.sheet ? val === props.filters.sheet : true
        })
        .orderBy("start_time")
        .get()
);

const CUMULATIVE_CHART_STATS = [STAT_TYPES.WINS, STAT_TYPES.HAMMER_LAST_END];
const isCumulative = CUMULATIVE_CHART_STATS.includes(props.type);
const showCumulative = ref(false);
const chartPoints = computed(() => {
    const points = allStats.value.map((data, index) => {
        if (isCumulative || showCumulative.value) {
            return (
                getCumulativeStat(
                    allStats.value.slice(0, index + 1),
                    STAT_FIELDS_TOTAL[props.type]
                ) * (isPercent ? 100 : 1)
            );
        }

        return STAT_FIELDS_TOTAL[props.type](data) * (isPercent ? 100 : 1);
    });
    if (points.length === 1) return [points[0], points[0]]
    return points;
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
    [STAT_TYPES.ENDS_FOR_PER_GAME]: "",
    [STAT_TYPES.HAMMER_LAST_END]: "hammer_last_end",
    [STAT_TYPES.FORCE_EFFICIENCY]: "force_efficiency",
    [STAT_TYPES.HAMMER_EFFICIENCY]: "hammer_conversion_average",
    [STAT_TYPES.POINTS_FOR_PER_GAME]: "points_for",
    [STAT_TYPES.POINTS_AGAINST_PER_GAME]: "points_against",
    [STAT_TYPES.ENDS_FOR_PER_GAME]: "ends_for",
    [STAT_TYPES.ENDS_AGAINST_PER_GAME]: "ends_against",
    [STAT_TYPES.STEAL_DEFENSE]: "steal_defense",
    [STAT_TYPES.STEAL_EFFICIENCY]: "steal_efficiency",
    [STAT_TYPES.POINTS_PER_END]: (data) => {
        const { points_for, ends_played } = data;

        return points_for / ends_played;
    },
};

const average = computed(() => {
    const all = useRepo(TeamStatsTotal).query().get();
    // .orderBy(STAT_RANK_ORDER[props.type], "desc")

    const total = all.reduce((all, current) => {
        if (typeof STAT_RANK_ORDER[props.type] === "function") {
            return all + STAT_RANK_ORDER[props.type](current);
        }
        return all + current[STAT_RANK_ORDER[props.type]];
    }, 0);

    return total / all.length;
});

const LESS_THAN_STATS = [
    STAT_TYPES.ENDS_AGAINST_PER_GAME,
    STAT_TYPES.POINTS_AGAINST_PER_GAME,
];

const betterThanAverage = computed(() => {
    if (LESS_THAN_STATS.includes(props.type))
        return totalTile.value / (isPercent ? 100 : 1) < average.value;
    return totalTile.value / (isPercent ? 100 : 1) > average.value;
});

const tile = ref(null);

const { width } = useElementSize(document.getElementById("dashboard"));

const $q = useQuasar();

const tileWidth = computed(
    () => ($q.screen.xs ? width.value / 2 : width.value / 3) - 30
);

const topPoint = ref(0);
const leftPoint = ref(0);
const gameInfo = ref(null);
const showGameInfo = ref(false);

const onClick = useDebounceFn((e) => {
    const { x, y, index, raw } = e;
    if (x - 1.5 === leftPoint.value) return;
    showGameInfo.value = false;
    nextTick(() => {
        topPoint.value = y;
        leftPoint.value = x - 1.5;
        gameInfo.value = {...allStats.value[index], raw};
        showGameInfo.value = true;
    });
},50);

const chart = ref(null);

onClickOutside(chart, () => {
    gameInfo.value = null;
    showGameInfo.value = false;
});

const viewOnChart = (index) => {
    const datasetMeta = chart.value?.getDatasetMeta(0)
    const {data} = datasetMeta ?? {};
    if (!data)return;

    const {x,y} = data[index];

    emit('scroll')
    onClick({x,y,index})
}
</script>
