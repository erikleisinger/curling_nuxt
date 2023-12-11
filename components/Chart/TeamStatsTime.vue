<template>
    <div class="line-chart__container">
        <q-inner-loading :showing="isLoading" />

        <div class="row tabs__container no-wrap">
            <q-tabs
                v-model="currentIndex"
                active-bg-color="white"
                active-color="deep-purple"
                color="deep-purple"
                shrink
                class="text-deep-purple"
            >
                <q-tab label="Hammer efficiency" :name="0" />
                <q-tab label="Steal efficiency" :name="1" />
                <q-tab label="Force efficiency" :name="2" />
                <q-tab label="Steal defense" :name="3" />
            </q-tabs>
            <q-btn flat icon="filter_list" dense class="q-px-sm">
                <q-menu v-model="filterMenuOpen" auto-close>
                    <div class="column">
                    <q-btn @click="setMinMax(7, 'day')"  square flat>Past week</q-btn>
                    <q-btn @click="setMinMax(1, 'month')" flat square>Past month</q-btn>
                     <q-btn @click="setMinMax(0)" flat square>All time</q-btn>
                    </div>
                </q-menu>
            </q-btn>
        </div>

        <div class="row no-wrap" v-if="!isLoading && !refreshingData">
            <div class="col-12">
                <ChartTeamStatsTimeEfficiency
                    :opponentId="opponentId"
                    :teamId="teamId"
                    v-if="currentIndex === 0"
                    height="200px"
                    :minDate="minDate"
           
                />
                <ChartTeamStatsTimeSteal
                    :opponentId="opponentId"
                    :teamId="teamId"
                    v-if="currentIndex === 1"
                    height="200px"
                       :minDate="minDate"
                />
                <ChartTeamStatsTimeForce
                    :opponentId="opponentId"
                    :teamId="teamId"
                    v-if="currentIndex === 2"
                    height="200px"
                         :minDate="minDate"
                />
                <ChartTeamStatsTimeStealDefense
                    :opponentId="opponentId"
                    :teamId="teamId"
                    v-if="currentIndex === 3"
                    height="200px"
                         :minDate="minDate"
                />
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.line-chart__container {
    margin-left: auto;
    margin-right: auto;
    position: relative;
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

const props = defineProps({
    opponentId: Number,
    teamId: Number,
    visibleStats: Array,
});

const minDate = ref(null);


const refreshingData = ref(false)
const filterMenuOpen = ref(false)

const { toUTC } = useTime();

const setMinMax = (amount, unit) => {
    if (!amount) {
        minDate.value = null;
        
    } else {
 const now = toUTC(null, null, false, true);
    const min = now.subtract(amount, unit).toISOString();
    minDate.value = min;
    }
   
    refreshingData.value = true;
    nextTick(() => {
        refreshingData.value = false;
    })
};

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

const { isLoading } = useQuery({
    queryKey: ["team", "stats", props.teamId],
    queryFn: () => getTeamStats(props.teamId),
    refetchOnWindowFocus: false,
});

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
