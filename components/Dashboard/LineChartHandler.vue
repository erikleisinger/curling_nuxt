<template>
    <div style="height: 100%" :style="{width: preview ? `${tileWidth}px` : '100%'}" class="line-chart__container">
        <DashboardStatGameDetails
            :data="gameInfo"
            :type="type"
            :comparisonType="showComparison"
            v-model="showGameInfo"
            v-if="!preview"
        />

        <div class="chart-handler__container relative-position">
            <div
                class="game-line__indicator"
                v-if="showGameInfo"
                :style="{
                    left: `${leftPoint}px`,
                    borderColor: 'rgba(255,255,255,0.6)',
                }"
                :class="`tile-chart-${type}`"
                :data-flip-id="`tile-chart-${type}`"
            />
            <div class="no-data__overlay" v-if="!enoughData">
                <div class="column items-center">
                    <q-icon name="query_stats" size="2em" class="q-mb-sm" />
                    <div class="text-sm q-px-lg text-center">
                        At least 2 games are required to show graph statistics
                    </div>
                </div>
            </div>
            <DashboardLineChart
                :data="chartPoints"
                :maintain="false"
                labels
                clickable
                @click="onClick"
                :color="getColor(color)"
                :start="startEnd.start"
                :end="startEnd.end"
                v-memo="[chartPoints.length, stats.id, showCumulative]"
            />
        </div>
        <div
            class="full-width row justify-around clickable q-pt-lg text-caption"
            v-if="enoughData"
        >
            <ButtonRings
                @click="showCumulative = !showCumulative"
                :active="showCumulative"
                :color="color"
                >Cumulative</ButtonRings
            >
            <ButtonRings
                @click="onCompareClick"
                :active="!!showComparison"
                :color="color"
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
<script setup>
import { STAT_COLORS, STAT_NAMES, STAT_TYPES } from "@/constants/stats";
import {useElementSize} from '@vueuse/core'
const props = defineProps({
    /**
     * Should show cumulative or not by default
     */
    cumulative: Boolean,
    preview: Boolean,
    stats: Object,
    type: String,
});

const { getColor } = useColor();
const color = STAT_COLORS[props.type];

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
        gameInfo.value = { ...props.stats[props.type].stats[index], raw, raw2 };
        showGameInfo.value = true;
    });
}, 50);

const showCumulative = ref(props.cumulative);

const chartPoints = computed(() => {
    let comparison;
    /**
     * need to initialize the comparison type before calling chartPoints()
     */
    if (showComparison.value) comparison = props.stats[showComparison.value];
    return [
        props.stats[props.type].chartPoints(showCumulative.value),
        ...(showComparison.value ? [comparison.chartPoints(false)] : []),
    ];
});

const comparisonOptions = [
    STAT_TYPES.WINS,
    STAT_TYPES.POINTS_PER_END,
    STAT_TYPES.HAMMER_EFFICIENCY,
    // STAT_TYPES.POINTS_FOR_PER_GAME,
    // STAT_TYPES.ENDS_FOR_PER_GAME,
    // STAT_TYPES.POINTS_AGAINST_PER_GAME,
    // STAT_TYPES.ENDS_AGAINST_PER_GAME,
    STAT_TYPES.STEAL_EFFICIENCY,
    STAT_TYPES.FORCE_EFFICIENCY,
    STAT_TYPES.STEAL_DEFENSE,
    // STAT_TYPES.BLANK_ENDS,
].filter((t) => t !== props.type);

const showComparisonMenu = ref(false);
const showComparison = ref(null);
const onCompareClick = () => {
    if (showComparisonMenu.value) {
        showComparisonMenu.value = false;
        return;
    }
    if (showComparison.value) {
        showComparison.value = null;
        return;
    }
    showComparisonMenu.value = true;
};

const { toTimezone } = useTime();

const startEnd = computed(() => {
    const stats = props.stats[props.type].stats;
    return {
        start: toTimezone(stats[0]?.start_time, "MMM D"),
        end: toTimezone(stats[stats.length - 1]?.start_time, "MMM D"),
    };
});

const enoughData = computed(
    () => chartPoints.value[0] && chartPoints.value[0]?.points?.length > 2
);



</script>
<style lang="scss" scoped>
.line-chart__container {
    position: relative;
    .chart-handler__container {
        height: 250px;
        @include sm {
            height: 400px;
        }
    }

    .game-line__indicator {
        position: absolute;
        height: 100%;
        width: 3px;
        border-left: 1px solid;
        border-right: 1px solid;
        animation: scale 0.2s forwards;
    }
}

.no-data__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 16px;
}
</style>
