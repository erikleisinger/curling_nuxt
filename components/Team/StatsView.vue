<template>
    <div class="column full-height no-wrap">
    <div  class="stats__container row" v-if="$q.screen.gt.xs || !viewDetails?.length" :class="{'col-12': $q.screen.xs || !viewDetails.length, 'col-6': viewDetails.length && !$q.screen.xs}">
       <TeamStatsViewPercentage class="col-12" badge="efficiency" :teamId="team.id" :numerator="team[BADGE_FIELDS.efficiency.numerator]" :denominator="team[BADGE_FIELDS.efficiency.denominator]" @showMore="viewMore(BADGE_TITLES_PLAIN.efficiency)" :visible="viewDetails.includes(BADGE_TITLES_PLAIN.efficiency)"/>
          <TeamStatsViewPercentage class="col-12" badge="bulwark" :teamId="team.id" :numerator="team[BADGE_FIELDS.bulwark.numerator]" :denominator="team[BADGE_FIELDS.bulwark.denominator]" @showMore="viewMore(BADGE_TITLES_PLAIN.bulwark)" :visible="viewDetails.includes(BADGE_TITLES_PLAIN.bulwark)"/>
       <TeamStatsViewPercentage  class="col-12" badge="bandit" :teamId="team.id" :numerator="team[BADGE_FIELDS.bandit.numerator]" :denominator="team[BADGE_FIELDS.bandit.denominator]"  @showMore="viewMore(BADGE_TITLES_PLAIN.bandit)" :visible="viewDetails.includes(BADGE_TITLES_PLAIN.bandit)"/>
        <TeamStatsViewPercentage  class="col-12" reverse badge="stealdefense" :teamId="team.id" :numerator="team[BADGE_FIELDS.stealdefense.numerator]" :denominator="team[BADGE_FIELDS.stealdefense.denominator]"  @showMore="viewMore(BADGE_TITLES_PLAIN.stealdefense)" :visible="viewDetails.includes(BADGE_TITLES_PLAIN.stealdefense)"/>
      <TeamStatsViewPercentage  class="col-12" badge="firstend" :teamId="team.id" :numerator="team[BADGE_FIELDS.firstend.numerator]" :denominator="team[BADGE_FIELDS.firstend.denominator]" gameStat   @showMore="viewMore(BADGE_TITLES_PLAIN.firstend)" :visible="viewDetails.includes(BADGE_TITLES_PLAIN.firstend)"/>
        <TeamStatsViewPercentage  class="col-12" badge="strategist" :teamId="team.id" :numerator="team[BADGE_FIELDS.strategist.numerator]" :denominator="team[BADGE_FIELDS.strategist.denominator]" gameStat @showMore="viewMore(BADGE_TITLES_PLAIN.strategist)" :visible="viewDetails.includes(BADGE_TITLES_PLAIN.strategist)" />
       
      <TeamStatsViewPercentage  class="col-12" badge="minimalist" :teamId="team.id" :numerator="team[BADGE_FIELDS.minimalist.numerator]" :denominator="team[BADGE_FIELDS.minimalist.denominator]"  @showMore="viewMore(BADGE_TITLES_PLAIN.minimalist)" :visible="viewDetails.includes(BADGE_TITLES_PLAIN.minimalist)"/>
    </div>
    <transition appear enter-active-class="animted slideInRight" leave-active-class="animated slideOutRight">
    <div  class="col-12 col-sm-6 row full-width view-more__container" v-show="!!viewDetails?.length" >
        <ChartTeamHammerEfficiencyTime :teamId="team.id" v-if="!!viewDetails.length" :visibleStats="viewDetails" @close="viewDetails = []"/>
    </div>
    </transition>
    </div>
</template>
<style lang="scss" scoped>
.stats__container {
    padding: 0px var(--space-md);
    border-radius: 8px;
    overflow: auto;
    // height: 100%;
 
  
}
.view-more__container {
    overflow: auto;
    position: relative;
      .view-details-back__container {
        position: absolute;
        padding: var(--space-xs);
        right: 0;
    }
    @include sm {
        border-top: 1px solid $grey-5;
    }
}
</style>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import { BADGE_FIELDS, BADGE_THRESHOLDS, BADGE_TITLES_PLAIN } from "@/constants/badges";


const props = defineProps({
    teamId: Number,
    teamName: {
        type: String,
        default: "<TEAM>",
    },
});

const $q = useQuasar();

const viewDetails = ref([])
const detailsType = ref(null);

const viewMore = (str) => {
    if (viewDetails.value.includes(str)) {
        const index = viewDetails.value.indexOf(str)
        viewDetails.value.splice(index, 1)
    } else {
        viewDetails.value.push(str)
    }
}


const team = useUserTeamStore().userTeams.find((t) => t.id === props.teamId);


</script>
