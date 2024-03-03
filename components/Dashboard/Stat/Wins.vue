<template>
    <DashboardTile
        :type="type"
        :percent="stats.wins.percent"
        :expanded="expanded"
        ref="tile"
        @close="emit('close')"
        :name="STAT_NAMES[STAT_TYPES.WINS]"
        :color="color"
    >
        <template v-slot:value>
            <DashboardStatValue isPercent>
                {{ stats.wins.percent }}
            </DashboardStatValue>
        </template>
        <template v-slot:stat>
            <div
                v-if="
                    !expanded && chartPointsPreview && chartPointsPreview.length
                "
                :style="`width: ${tileWidth}px; height: 80px`"
                :class="`tile-chart-${type}`"
                :data-flip-id="`tile-chart-${type}`"
            >
                <DashboardLineChart
                    :data="chartPointsPreview"
                    :maintain="false"
                    :color="color"
                />
            </div>
        </template>
        <template v-slot:stat-expanded>
            <DashboardLineChartHandler
                :type="STAT_TYPES.WINS"
                :cumulative="true"
                :stats="stats"
            />
        </template>
        <div class="details__container" v-if="expanded">
            <div class="stat-expanded__container">
                <!-- GAMES PLAYED -->

                <DashboardStatDetailsItemTemplate>
                    <template v-slot:title>Games played</template>
                    <template v-slot:value>{{ stats?.gamesPlayed }}</template>
                </DashboardStatDetailsItemTemplate>

                <q-separator class="separator" />

                <!-- COLOR STATS -->

                <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                        <q-icon
                            name="circle"
                            size="0.8em"
                            :style="{ color: getColor('yellow') }"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title>Yellow rocks</template>
                    <template v-slot:value>
                        <DashboardStatValue isPercent>
                            {{ stats?.wins.yellow }}
                        </DashboardStatValue>
                    </template>
                </DashboardStatDetailsItemTemplate>
                <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                        <q-icon
                            name="circle"
                            size="0.8em"
                            :style="{ color: getColor('blue') }"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title>Blue rocks</template>
                    <template v-slot:value>
                        <DashboardStatValue isPercent>
                            {{ stats?.wins.blue }}
                        </DashboardStatValue>
                    </template>
                </DashboardStatDetailsItemTemplate>
                <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                        <q-icon
                            name="circle"
                            size="0.8em"
                            :style="{ color: getColor('red') }"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title>Red rocks</template>
                    <template v-slot:value>
                        <DashboardStatValue isPercent>
                            {{ stats?.wins.red }}
                        </DashboardStatValue>
                    </template>
                </DashboardStatDetailsItemTemplate>

                <q-separator class="separator" />

                <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                        <q-icon
                            name="o_hardware"
                            size="0.8em"
                            color="white"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title
                        >Median Winning Hammer efficiency</template
                    >
                    <template v-slot:value>
                        <DashboardStatValue isPercent>
                            {{ stats?.wins.hammerEfficiency }}
                        </DashboardStatValue>
                    </template>
                    <template v-slot:more>
                        <DashboardStatDetailsItemTemplate>
                            <template v-slot:icon>
                                <q-icon
                                    name="o_hardware"
                                    size="0.8em"
                                    color="white"
                                    class="q-mr-sm"
                                />
                            </template>
                            <template v-slot:title
                                >Lowest winning Hammer efficiency</template
                            >
                            <template v-slot:value>
                                <DashboardStatValue isPercent>
                                    {{
                                        stats?.wins
                                            .lowestWinningHammerEfficiency
                                    }}
                                </DashboardStatValue>
                            </template>
                        </DashboardStatDetailsItemTemplate>
                    </template>
                </DashboardStatDetailsItemTemplate>
                <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                        <q-icon
                            name="o_hardware"
                            size="0.8em"
                            color="white"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title
                        >Median Losing Hammer efficiency</template
                    >

                    <template v-slot:value>
                        <DashboardStatValue isPercent>
                            {{ stats?.wins.lossHammerEfficiency }}
                        </DashboardStatValue>
                    </template>
                    <template v-slot:more>
                          <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                        <q-icon
                            name="o_hardware"
                            size="0.8em"
                            color="white"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title
                        >highest losing Hammer efficiency</template
                    >
                    <template v-slot:value>
                        <DashboardStatValue isPercent>
                            {{ stats?.wins.highestLosingHammerEfficiency }}
                        </DashboardStatValue>
                    </template>
                </DashboardStatDetailsItemTemplate>
                    </template>
                </DashboardStatDetailsItemTemplate>

                       <q-separator class="separator" />

              <DashboardStatDetailsItemTemplate>
                  
                    <template v-slot:title
                        >Median Winning steal efficiency</template
                    >
                    <template v-slot:value>
                        <DashboardStatValue isPercent>
                            {{ stats?.wins.stealEfficiency }}
                        </DashboardStatValue>
                    </template>
                  
                </DashboardStatDetailsItemTemplate>

                   <DashboardStatDetailsItemTemplate>
                  
                    <template v-slot:title
                        >Median losing steal efficiency</template
                    >
                    <template v-slot:value>
                        <DashboardStatValue isPercent>
                            {{ stats?.wins.lossStealEfficiency }}
                        </DashboardStatValue>
                    </template>
                  
                </DashboardStatDetailsItemTemplate>

                <!-- <DashboardStatDetails
                :type="type"
                :filters="filters"
                :average="stats.percent"
            /> -->
            </div>
        </div>
        <div></div>
    </DashboardTile>
</template>
<style lang="scss" scoped>
.details__container {
    margin-top: var(--space-lg);
}
.stat-expanded__container {
    width: 100%;
}
.line-chart__container {
    position: relative;
}
.separator {
    background-color: v-bind(color);
    margin-bottom: var(--space-md);
    margin-top: calc(var(--space-md) - 4px);
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
import Team from "@/store/models/team";
import Player from "@/store/models/player";
import { useElementSize, onClickOutside, useDebounceFn } from "@vueuse/core";

const props = defineProps({
    expanded: Boolean,
    filters: Object,
    type: String,
});

const { getColor } = useColor();
const color = getColor(STAT_COLORS[STAT_TYPES.WINS]);

const emit = defineEmits(["close", "scroll"]);

const slots = useSlots();

const { user: userId } = useUser();
const stats = computed(() => {
    if (props.filters?.teams?.length) {
        return useRepo(Team)
            .query()
            .with("stats")
            .whereIn("id", props.filters.teams)
            .first();
    }
    return useRepo(Player).withAllRecursive().where("id", userId.value).first();
});

const chartPointsPreview = computed(() => {
    const data = stats.value.wins.chartPoints();
    const points = data.points.slice(
        data.points.length < 5 ? 0 : data.points.length - 5
    );
    return [
        {
            points,
            color: data.color,
        },
    ];
});

const tile = ref(null);

const { width } = useElementSize(document.getElementById("dashboard"));

const $q = useQuasar();

const tileWidth = computed(
    () => ($q.screen.xs ? width.value / 2 : width.value / 3) - 30
);
</script>
<script>
export default {
    name: "Wins",
};
</script>
