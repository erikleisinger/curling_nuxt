<template>
    <!-- -->
    <div class="row full-height">
    <div  class="stats__container row" v-if="$q.screen.gt.xs || !viewDetails" :class="{'col-12': $q.screen.xs || !viewDetails, 'col-6': viewDetails && !$q.screen.xs}">
        <q-inner-loading
            color="purple"
            label="Loading stats..."
            :showing="loading"
        />
       <TeamStatsViewPercentage class="col-12" badge="efficiency" :numerator="team.hammer_conversion_count" :denominator="team.hammer_end_count" @click="viewMore('conversions')"/>
          <TeamStatsViewPercentage class="col-12" badge="bulwark" :numerator="team.non_hammer_force_count" :denominator="team.non_hammer_end_count"/>
       <TeamStatsViewPercentage  class="col-12" badge="bandit" :numerator="team.non_hammer_steal_count" :denominator="team.non_hammer_end_count"/>
      <TeamStatsViewPercentage  class="col-12" badge="firstend" :numerator="team.hammer_first_end_count" :denominator="team.games_played" gameStat/>
        <TeamStatsViewPercentage  class="col-12" badge="strategist" :numerator="team.hammer_last_end_count" :denominator="team.games_played" gameStat/>
        <TeamStatsViewPercentage  class="col-12" badge="minimalist" :numerator="team.hammer_blank_count" :denominator="team.hammer_end_count" />
      <TeamStatsViewPercentage  class="col-12" badge="survivalist" :numerator="team.hammer_force_count" :denominator="team.hammer_end_count" />
    </div>
    <transition appear enter-active-class="animted slideInRight" leave-active-class="animated slideOutRight">
    <div  class="col-12 col-sm-6 row full-height view-more__container" v-show="!!viewDetails" >
        <div class="view-details-back__container" @click="viewDetails = null" v-if="$q.screen.xs">
            <q-btn  icon="close" round flat />
        </div>
        <KeepAlive>
        <ChartTeamHammerEfficiencyTime :teamId="team.id" v-if="viewDetails === 'conversions'"/>
        </KeepAlive>
    </div>
    </transition>
    </div>
</template>
<style lang="scss" scoped>
.stats__container {
    padding: 0px var(--space-md);
    border-radius: 8px;
    overflow: auto;
    height: 100%;
 
  
}
.view-more__container {
    overflow: auto;
    position: relative;
      .view-details-back__container {
        position: absolute;
        padding: var(--space-xs);
        right: 0;
    }
}
</style>
<script setup>
import {
    useElementSize,
    useScroll,
    watchDebounced,
    useDebounceFn,
} from "@vueuse/core";
import { useUserTeamStore } from "@/store/user-teams";
import { BADGE_THRESHOLDS } from "@/constants/badges";

const props = defineProps({
    teamId: Number,
    teamName: {
        type: String,
        default: "<TEAM>",
    },
});

const $q = useQuasar();

const viewDetails = ref(false)
const detailsType = ref(null);

const viewMore = (str) => {
    if (viewDetails.value === str) {
        viewDetails.value = null
    } else {
        viewDetails.value = str;
    }
}

const stats = ref(null);
const wins = ref(0);
const losses = ref(0);
const ties = ref(0);

const loadingRecord = ref(false);
const getWinsLossess = async () => {
    loadingRecord.value = true;
    const { client, fetchHandler } = useSupabaseFetch();
    const { data } = await fetchHandler(
        () =>
            client.rpc("get_team_wins", {
                team_ids_param: [props.teamId],
            }),
        { onError: "Error fetching data" }
    );
    data.forEach((team) => {
        wins.value += team.wins;
        losses.value += team.losses;
        ties.value += team.ties;
    });

    loadingRecord.value = false;
};

const team = useUserTeamStore().userTeams.find((t) => t.id === props.teamId);

const currentTeamId = computed(() => props.teamId);
const loading = ref(true);
watchDebounced(
    currentTeamId,
    async () => {
        loading.value = true;
        await getWinsLossess();

        loading.value = false;
    },
    { debounce: 1, immediate: true }
);

</script>
