<template>
    <div class="line-chart__container">
        <!-- <q-inner-loading :showing="isLoading" /> -->

        <div class="row tabs__container no-wrap justify-between">
            <q-tabs
                v-model="currentIndex"
                active-bg-color="white"
                :active-color="tabColor"
                :color="tabColor"
                shrink
            >
                <q-tab label="Hammer efficiency" :name="0" />
                <q-tab label="Steal efficiency" :name="1" />
                <q-tab label="Force efficiency" :name="2" />
                <q-tab label="Steal defense" :name="3" />
                <q-tab label="Scoring" :name="4" />
                       <q-tab label="Hammer FE" :name="5" />
                   <q-tab label="Hammer LE" :name="6" />
                   
            </q-tabs>
            <q-btn flat icon="filter_list" dense class="q-px-sm">
                <q-menu v-model="filterMenuOpen" auto-close>
                    <q-item
                        clickable
                        v-ripple
                        @click="setMinMax('week')"
                        :active="timeframe === 'week'"
                    >
                        <q-item-section no-wrap>Past week</q-item-section>
                    </q-item>
                    <q-item
                        clickable
                        v-ripple
                        @click="setMinMax('month')"
                        :active="timeframe === 'month'"
                    >
                        <q-item-section no-wrap>Past month</q-item-section>
                    </q-item>
                    <q-item
                        clickable
                        v-ripple
                        @click="setMinMax(null)"
                        :active="!timeframe"
                    >
                        <q-item-section no-wrap>All time</q-item-section>
                    </q-item>
                </q-menu>
            </q-btn>
        </div>

        <div class="row no-wrap" v-if="!refreshingData">
            <div class="col-12 relative-position">
                <div class="no-stats__overlay" v-if="!stats">
                    No stats were found.
                </div>
                <ChartTeamStatsTimeLine
                    :teamId="teamId"
                    v-if="currentIndex === 0"
                    :height="chartHeight"
                    :minDate="minDate"
                    type="efficiency"
                />
                <ChartTeamStatsTimeLine
                    :teamId="teamId"
                    v-if="currentIndex === 1"
                    :height="chartHeight"
                    :minDate="minDate"
                    type="steal_efficiency"
                />
                <ChartTeamStatsTimeLine
                    :teamId="teamId"
                    v-if="currentIndex === 2"
                    :height="chartHeight"
                    :minDate="minDate"
                    type="force_efficiency"
                />
                <ChartTeamStatsTimeLine
                    :teamId="teamId"
                    v-if="currentIndex === 3"
                    :height="chartHeight"
                    :minDate="minDate"
                    type="steal_defense"
                />
                <ChartTeamStatsTimeLine
                    :teamId="teamId"
                    v-if="currentIndex === 4"
                    :height="chartHeight"
                    :minDate="minDate"
                    type="points"
                    calculateMinMax
                    :percent="false"
                />
                  <ChartTeamStatsTimeLine
                    :teamId="teamId"
                    v-if="currentIndex === 5"
                    :height="chartHeight"
                    :minDate="minDate"
                    type="hammer_fe"
                />
                 <ChartTeamStatsTimeLine
                    :teamId="teamId"
                    v-if="currentIndex === 6"
                    :height="chartHeight"
                    :minDate="minDate"
                    type="hammer_le"
                />
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.no-stats__overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;

    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
.line-chart__container {
    margin-left: auto;
    margin-right: auto;
    position: relative;
    min-height: v-bind(chartHeight);
    .chart-options__container {
        height: 100%;
        width: 100%;
        padding: var(--space-sm);
        padding-bottom: 0px;
    }
    .legend__container {
        padding: 0px var(--space-sm);
    }
    .tabs__container {
        margin-right: auto;
        margin-left: auto;
        padding-left: var(--space-xs);

        max-width: 100vw;
        .q-tabs {
            flex-grow: 0;
            flex-shrink: 1;
            .q-tab {
                &.red {
                    color: red !important;
                }
            }
        }
    }
}
</style>
<script setup>
import {
    BADGE_COLORS,
    BADGE_TITLES_PLAIN,
    BADGE_TITLE_CONVERT,
    BADGE_DESCRIPTIONS_PLAIN,
} from "@/constants/badges";
import { useDebounceFn } from "@vueuse/core";
import { useQuery } from "@tanstack/vue-query";
import TeamStats from "@/store/models/team-stats";

const tabColor = computed(() => {
    return ["purple", "red", "blue", "blue-grey", '', 'amber', 'green-10', ][currentIndex.value];
});

const $q = useQuasar();

const chartHeight = computed(() => ($q.screen.xs ? "250px" : "400px"));

const props = defineProps({
    opponentId: Number,
    teamId: Number,
    visibleStats: Array,
});

const stats = computed(() => {
    return (
        useRepo(TeamStats)
            .where("team_id", props.teamId)
            .where("start_time", (val) => {
                if (!val) return false;
                if (!minDate.value) return true;
                return (
                    toUTC(val, null, false, true).unix() >
                    toUTC(minDate.value, null, false, true).unix()
                );
            })
            .get()?.length ?? 0
    );
});

const refreshingData = ref(false);
const filterMenuOpen = ref(false);

const { toUTC } = useTime();

const timeframe = ref(null);

const setMinMax = (tf) => {
    timeframe.value = tf;
};

const minDate = computed(() => {
    if (!timeframe.value) return null;
    const now = toUTC(null, null, false, true);
    return now.subtract(1, timeframe.value).toISOString();
});

watch(minDate, () => {
    refreshingData.value = true;
    nextTick(() => {
        refreshingData.value = false;
    });
});

const currentIndex = ref(0);

const getTeamStats = async (teamId) => {
    const { data } = await useSupabaseClient().rpc("get_team_stats", {
        team_id_param: teamId,
        range_start_param: null,
        range_end_param: null,
        limit_param: null,
    });

    data.forEach((stat) => {
        useRepo(TeamStats).save({
            ...stat,
            team_id: teamId,
        });
    });

    return data;
};

// const { isLoading } = useQuery({
//     queryKey: ["team", "stats", props.teamId],
//     queryFn: () => getTeamStats(props.teamId),
//     refetchOnWindowFocus: false,
// });

const changeStat = (inc) => {
    if (
        currentIndex.value + inc < 0 ||
        currentIndex.value + inc > options.length - 1
    )
        return;
    currentIndex.value += inc;
};

const showAverages = ref(true);

const options = [
    {
        color: BADGE_COLORS.efficiency,
        title: BADGE_TITLES_PLAIN.efficiency,
        description: BADGE_DESCRIPTIONS_PLAIN.efficiency,
        visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.efficiency),
    },
    {
        color: BADGE_COLORS.bandit,
        title: BADGE_TITLES_PLAIN.bandit,
        description: BADGE_DESCRIPTIONS_PLAIN.bandit,
        visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.bandit),
    },
    {
        color: BADGE_COLORS.bulwark,
        title: BADGE_TITLES_PLAIN.bulwark,
        description: BADGE_DESCRIPTIONS_PLAIN.bulwark,
        visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.bulwark),
    },
    {
        color: BADGE_COLORS.stealdefense,
        title: BADGE_TITLES_PLAIN.stealdefense,
        description: BADGE_DESCRIPTIONS_PLAIN.stealdefense,
        visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.stealdefense),
    },
    // {
    //     color: BADGE_COLORS.minimalist,
    //     title: BADGE_TITLES_PLAIN.minimalist,
    //     visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.minimalist),
    // },
    // {
    //     color: BADGE_COLORS.firstend,
    //     title: BADGE_TITLES_PLAIN.firstend,
    //     visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.firstend),
    // },
    // {
    //     color: BADGE_COLORS.strategist,
    //     title: BADGE_TITLES_PLAIN.strategist,
    //     visible: props.visibleStats.includes(BADGE_TITLES_PLAIN.strategist),
    // },
];
</script>
