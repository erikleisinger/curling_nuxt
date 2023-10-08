<template>
    <div class="line-chart__container">
        <q-inner-loading :showing="loading" color="primary" />

        <div class="row justify-between no-wrap q-mb-md">
            <div class="row full-width">
                <div class="row justify-between full-width items-center">
                    <div>
                    <q-btn
                        icon="chevron_left"
                        flat
                        round
                        size="sm"
                        @click="changeStat(-1)"
                        :style="{
                            visibility:
                                currentIndex === 0 ? 'hidden' : 'visible',
                        }"
                    />
                    </div>
                    <div class="column">
                        <h1 class="text-md text-bold text-center">
                            {{ options[currentIndex].title }}
                        </h1>
                        <div class="text-sm text-center">{{options[currentIndex].description}}</div>
                    </div>
                    <div>
                    <q-btn
                        icon="chevron_right"
                        flat
                        round
                        size="sm"
                        @click="changeStat(+1)"
                        :style="{
                            visibility:
                                currentIndex >= options.length - 1
                                    ? 'hidden'
                                    : 'visible',
                        }"
                    />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!loading">
            <ChartTeamStatsTimeEfficiency
                :teamId="teamId"
                v-show="currentIndex === 0"
                height="200px"
            />
            <ChartTeamStatsTimeSteal
                :teamId="teamId"
                v-show="currentIndex === 1"
                  height="200px"
            />
            <ChartTeamStatsTimeForce
                :teamId="teamId"
                v-show="currentIndex === 2"
                  height="200px"
            />
            <ChartTeamStatsTimeStealDefense
                :teamId="teamId"
                v-show="currentIndex === 3"
                  height="200px"
            />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.line-chart__container {
    width: 100%;
    height: 100%;
    .chart-options__container {
        height: 100%;
        width: 100%;
        padding: var(--space-sm);
        padding-bottom: 0px;
    }
    .legend__container {
        padding: 0px var(--space-sm);
    }
}
</style>
<script setup>
import {
    BADGE_COLORS,
    BADGE_TITLES_PLAIN,
    BADGE_TITLE_CONVERT,
    BADGE_DESCRIPTIONS_PLAIN
} from "@/constants/badges";
import {useDebounceFn} from '@vueuse/core'
import TeamStats from "@/store/models/team-stats";

const props = defineProps({
    teamId: Number,
    visibleStats: Array,
});

const currentIndex = ref(0);



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


const limitFilter = ref(null);
const rangeFilter = ref(null);

const getTeamStats = async () => {
    const { data } = await useSupabaseClient().rpc("get_team_stats", {
        team_id_param: props.teamId,
        range_start_param: !rangeFilter.value
            ? null
            : getRange(rangeFilter.value)?.range_start_param,
        range_end_param: !rangeFilter.value
            ? null
            : getRange(rangeFilter.value)?.range_end_param,
        limit_param: limitFilter.value,
    });

    data.forEach((stat) => {
        useRepo(TeamStats).save({
            ...stat,
            team_id: props.teamId,
        });
    });

};

const loading = ref(true);

onMounted(async () => {
    loading.value = true;
    await getTeamStats();
    loading.value = false;
});
</script>
