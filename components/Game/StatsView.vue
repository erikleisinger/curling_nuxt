<template>
    <div
        class="full-height no-wrap column"

        v-if="!isLoading && teams?.home?.stats"
    >
        <div
            class="stats__container column no-wrap col-12"
        >
            <div
                class="column no-wrap"
                v-for="(stat, index) in statTypes"
                :key="`percentage-${stat}`"
            >
                <div class="q-mt-md row no-wrap">
                    <div class="row col-grow justify-start items-center">
                        <div class="team-avatar__container">
                            <TeamAvatar
                                :teamId="teams.home.team_id"
                                :color="teams.home.color"
                                :viewable="false"
                            />
                        </div>
                    </div>
                    <div>
                        <h2 class="text-lg q-mr-md text-center">
                            {{STAT_NAMES[stat]}}
                        </h2>
 
                    </div>
                    <div class="row col-grow justify-end items-center">
                        <div class="team-avatar__container">
                            <TeamAvatar
                                :teamId="teams.away.team_id"
                                :color="teams.away.color"
                                :viewable="false"
                            />
                        </div>
                    </div>
                </div>

                <div class="row no-wrap" >
                    <div
                        class="col-6"
                    >
                        <StatsPercent
                            class="full-width"
                            :stat="stat"
                            dense
                            :color="teams.home.color"
                            prependPercent
                            :stats="teams.home.stats"
                        />
                    </div>
                    <div
                     class="col-6"
                    >
                        <StatsPercent
                            class="full-width"
                            :stat="stat"
                            reverse
                              :color="teams.away.color"
                             :stats="teams.away.stats"
                        />
                    </div>
                </div>
                <q-separator v-if="index !== statTypes.length - 1" />
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.team-avatar__container {
    width: 2.5em;
}
.stats__container {
    padding: 0px var(--space-md);
    border-radius: 8px;
}

</style>
<script setup>
import {STAT_NAMES, STAT_TYPES} from '@/constants/stats'
import GameTeam from '@/store/models/game-team'
import TeamStats from '@/store/models/team-stats'
import {useQuery} from '@tanstack/vue-query'

const props = defineProps({
    gameId: Number,
});

const EXCLUDE = ['hammer_fe', 'hammer_le']
const statTypes = Object.values(STAT_TYPES).filter((type) => !EXCLUDE.includes(type))

const teams = computed(() => {
    return {
        home: useRepo(GameTeam).with('stats').where('game_id', props.gameId).where('home_team', true).first(),
        away: useRepo(GameTeam).with('stats').where('game_id', props.gameId).where('home_team', false).first()
    }
})

const getStatsForGame = async () => {
    const { data } = await useSupabaseClient()
        .from("team_stats")
        .select(
            `
            *,
            team:team_id (
                name,
                avatar_url
            )
            `
        )
        .eq("game_id", props.gameId);
    if (!data?.length) return null;
    data.forEach((stat) => {
        if (!stat.team_id) cleanupOpposition.value = true;
        useRepo(TeamStats).save({
            ...stat,
            team_id: stat.team_id ?? teams.value?.away?.team_id,
            games_played: 1,
        });
    });
    return data;
};

const {isLoading} = useQuery({
    queryKey: ['game', 'stats', props.gameId],
    queryFn: getStatsForGame,
    refetchOnWindowFocus: false,
})

const $q = useQuasar();
const reloading = ref(false);


// Var that indicates we should remove
// The team-stat from piniaOrm for the opposition
// when component unmounts
const cleanupOpposition = ref(false);
const cleanupOppositionStats = () => {
    useRepo(TeamStats).destroy(`[${teams.value?.away?.id},${props.gameId}]`);
};
onBeforeUnmount(() => {
    if (cleanupOpposition.value) cleanupOppositionStats();
});

</script>
<script>
export default {
    name: "GameStatsView",
};
</script>
