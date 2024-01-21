<template>
    <DashboardTile
        :type="type"
        :style="{ width: expanded ? '100%' : '' }"
        :percent="totalTile"
        :expanded="expanded"
        :betterThanAverage="betterThanAverage"
        ref="tile"
        @close="emit('close')"
    >
        <template v-slot:stat>
            <div
                v-if="!expanded && chartPoints?.length && chartPoints[0]"
                :style="`width: ${tileWidth}px; height: 80px`"
            >
                <DashboardLineChart
                    :data="chartPointsPreview"
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
                    :comparisonType="showComparison"
                    v-model="showGameInfo"
                />

                <div style="height: 250px">
                    <div
                        class="game-line__indicator"
                        v-if="showGameInfo"
                        :style="{
                            left: `${leftPoint}px`,
                            borderColor: 'rgba(255,255,255,0.6)',
                        }"
                    />
                    <!-- borderColor: getColor(STAT_COLORS[type]), -->
                    <DashboardLineChart
                        :data="chartPoints"
                        :maintain="false"
                        labels
                        clickable
                        @click="onClick"
                        v-model="chart"
                        :color="getColor(STAT_COLORS[type] ?? 'blue')"
                    />
                </div>
                <div
                    class="full-width row justify-around clickable q-pt-lg text-caption"
                    
                >
                    <ButtonRings
                        @click="showCumulative = !showCumulative"
                        :active="showCumulative"
                        :color="STAT_COLORS[type]"
                       
                        >Cumulative</ButtonRings
                    >
                    <ButtonRings
                        @click="onCompareClick"
                       :active="!!showComparison"
                        :color="STAT_COLORS[type]"
                        >Compare
                        <q-menu auto-close v-model="showComparisonMenu" no-parent-event>
                            <q-list>
                                <q-item
                                clickable
                                v-ripple
                                    v-for="statType in comparisonOptions"
                                    :key="statType"
                                    @click="showComparison = statType"
                                >
                                    <q-item-section>
                                        <q-item-label
                                            >{{ STAT_NAMES[statType] }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </ButtonRings>
                </div>
            </div>
        </template>

        <div class="stat-expanded__container" v-if="expanded">
            <DashboardStatDetails
                :type="type"
                :filters="filters"
                :average="totalTile"
                :betterThanAverage="betterThanAverage"
                :worldwide="average"
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
    CUMULATIVE_CHART_STATS,
    NON_PERCENT_STATS,
    STAT_COLORS,
    STAT_NAMES,
    STAT_FIELDS_TOTAL,
    STAT_RANK_ORDER,
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

const slots = useSlots();

const { userTeamIds } = useTeam();

const { getCumulativeStat, getChartPoints } = useStats();

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
        .where("rink_id", (val) => {
            return props.filters.rink ? val === props.filters.rink : true;
        })
        .where("sheet_id", (val) => {
            return props.filters.sheet ? val === props.filters.sheet : true;
        })
        .orderBy("start_time", "asc")
        .get()
);

const isCumulative = CUMULATIVE_CHART_STATS.includes(props.type);
const showCumulative = ref(isCumulative);
const showComparison = ref(null);
const chartPoints = computed(() => {
    return [
       
        {
            points: getChartPoints(
                allStats.value,
                props.type,
                showCumulative.value,
                isPercent
            ),
            color: getColor(STAT_COLORS[props.type]),
            label: STAT_NAMES[props.type],
        },
         ...(showComparison.value
            ? [
                  {
                      points: getChartPoints(
                          allStats.value,
                          showComparison.value,
                          showCumulative.value,
                          isPercent
                      ),
                      color: STAT_COLORS[showComparison.value] === STAT_COLORS[props.type] ? '#FFFFFF' : getColor(STAT_COLORS[showComparison.value]),
                      label: STAT_NAMES[showComparison.value],
                  },
              ]
            : []),
        
    ];
});

const chartPointsPreview = computed(() => {
    const data = chartPoints.value[0];
    return [
        {
            points: data.points.slice(
                data.points.length < 5 ? 0 : data.points.length - 5
            ),
            color: data.color,
        },
    ];
});

const comparisonOptions = [
            STAT_TYPES.WINS,
            STAT_TYPES.POINTS_PER_END,
            STAT_TYPES.HAMMER_EFFICIENCY,
            STAT_TYPES.POINTS_FOR_PER_GAME,
            STAT_TYPES.ENDS_FOR_PER_GAME,
            STAT_TYPES.POINTS_AGAINST_PER_GAME,
            STAT_TYPES.ENDS_AGAINST_PER_GAME,
            STAT_TYPES.STEAL_EFFICIENCY,
            STAT_TYPES.FORCE_EFFICIENCY,
            STAT_TYPES.STEAL_DEFENSE,
            STAT_TYPES.BLANK_ENDS,
].filter((t) => t !== props.type)

const showComparisonMenu = ref(false);
const onCompareClick = () => {
    if (showComparison.value) {
        showComparison.value = null;
        return;
    }
    showComparisonMenu.value = true;
};

const totalTile = computed(() =>
    cleanNumber(
        getCumulativeStat(allStats.value, STAT_FIELDS_TOTAL[props.type])
    )
);

const average = computed(() => {
    const all = useRepo(TeamStatsTotal).query().get();
    // .orderBy(STAT_RANK_ORDER[props.type], "desc")

    const total = all.reduce((all, current) => {
        return all + STAT_RANK_ORDER[props.type](current);
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
    if (gameInfo.value) {
        gameInfo.value = null;
        return;
    }
    const { x, y, index, raw, raw2 } = e;
    if (x - 1.5 === leftPoint.value) return;
    showGameInfo.value = false;
    nextTick(() => {
        topPoint.value = y;
        leftPoint.value = x - 1.5;
        gameInfo.value = { ...allStats.value[index], raw, raw2 };
        showGameInfo.value = true;
    });
}, 50);

const chart = ref(null);

const viewOnChart = (index) => {
    const datasetMeta = chart.value?.getDatasetMeta(0);
    const { data } = datasetMeta ?? {};
    if (!data) return;

    const { x, y } = data[index];

    emit("scroll");
    onClick({ x, y, index });
};

watch(
    () => props.expanded,
    (val) => {
        if (val) return;
        showGameInfo.value = false;
        gameInfo.value = null;
        showComparison.value = false;
        showCumulative.value = isCumulative
    }
);
</script>
<script>
export default {
    name: "Stat",
};
</script>
