<template>
<div v-if="teamRequests && teamRequests.length">
    <div v-for="request in teamRequests" :key="request.id">
    <TeamRequest :request="request" >
    </TeamRequest>
    </div>
</div>
    <TeamPageHeader
        :teamId="Number(route.params.id)"
        @click="viewing = true"
        style="cursor: pointer"
    />
    <div :class="{'column': $q.screen.xs, 'row no-wrap': !$q.screen.xs}" class="team-info">
    <div class=" team-badges__container " :class="$q.screen.xs ? 'col-12' : 'col-6'" v-if="badges">
        <div class="row items-center" :class="{'col-6 justify-around': !$q.screen.xs, 'justify-between': $q.screen.xs}">
        <Badge v-for="badge in badgesLimited" :key="badge.id" :badge="badge"/>
        </div>
            <div class="text-sm  q-mt-xs text-underline" :class="$q.screen.xs ? 'text-right' : 'text-center'" style="cursor: pointer" @click="badgesOpen = true">View all badges</div>
    </div>

    <div class="row  attributes justify-around" :class="{'col-6 ': !$q.screen.xs}" v-if="hasPlayedGames">
        <TeamAttribute title="Games played" color="amber"    class="col-5">
            <span>
                {{ stats.games_played ?? 0 }}
            </span>
        </TeamAttribute>
        <TeamAttribute
            title="Win %"
            color="amber"
            class="col-5"
            :percent="stats.winPercentile"
        >
            <span> {{ stats.winPercent }}% </span>
            <template v-slot:extra>
                <q-icon
                    :name="getIcon(stats.winPercentile)"
                    :color="getPercentileColor(stats.winPercentile)"
                />
                <span
                    :style="{
                        color: getPercentileColor(stats.winPercentile),
                    }"
                    >{{ stats.winPercentile }}%</span
                >
            </template>
        </TeamAttribute>
        <TeamAttribute
            title="Hammer first end"
            color="amber"
            class="col-5"
            :percent="stats.HFEPercentile"
        >
            <span> {{ stats.HFEPercent }}% </span>
            <template v-slot:extra>
                <q-icon
                    :name="getIcon(stats.HFEPercentile)"
                    :color="getPercentileColor(stats.HFEPercentile)"
                />
                <span
                    :style="{
                        color: getPercentileColor(stats.HFEPercentile),
                    }"
                    >{{ stats.HFEPercentile }}%</span
                >
            </template>
        </TeamAttribute>
        <TeamAttribute
            title="Hammer last end"
            color="amber"
            class="col-5"
            :percent="stats.HLEPercentile"
        >
            <span> {{ stats.HLEPercent }}% </span>
            <template v-slot:extra>
                <q-icon
                    :name="getIcon(stats.HLEPercentile)"
                    :color="getPercentileColor(stats.HLEPercentile)"
                />
                <span
                    :style="{
                        color: getPercentileColor(stats.HLEPercentile),
                    }"
                    >{{ stats.HLEPercentile }}%</span
                >
            </template>
        </TeamAttribute>
    </div>
    </div>

    <ChartTeamStatsTime
    v-if="hasPlayedGames"
        :teamId="Number(route.params.id)"
        :visibleStats="['Hammer efficiency']"
        class="q-mb-md"
    />

    <GameResultList :teamId="Number(route.params.id)" />

    <div v-if="!hasPlayedGames" class="full-width text-center q-pa-lg">
        {{team.name}} hasn't played any games!
    </div>
       <q-dialog v-model="viewing" persistent  >
        <q-card class="team-details__viewer">
          <TeamPageDetails
        @back="viewing = false"
        v-if="viewing"
        :teamId="Number(route.params.id)"
    />
        </q-card>
    </q-dialog>
      <q-dialog v-model="badgesOpen" v-if="badges && badges.length" :persistent="$q.platform.is.mobile"  >
        <q-card class="badges-viewer ">
            <h3 class="text-md text-bold  badges-viewer__header">Badges ({{badges.length}})</h3>
            <q-separator/>
            <div class="row justify-between items-start badges-view">
          <Badge v-for="badge in badges" :key="badge.id" :badge="badge" class="q-mb-sm"/>
            </div>
        </q-card>
    </q-dialog>
 
</template>
<style lang="scss" scoped>
.team-info {
    @include sm {
        margin-top: var(--space-xl)
    }
}
    .team-details__viewer,
    .badges-viewer {
        width: min(100vw, 500px); 
        height: min(100vh, 600px);
        padding: var(--space-xs);
        

    }

    .badges-viewer {
        padding-top: 0px;
        .badges-viewer__header {
            padding: var(--space-sm);
            
        }
        .badges-view {
            margin-top: var(--space-sm)
        }
    }
     .attributes {
        margin: 0px var(--space-md)
    }
    @include sm {
 .attributes {
        margin: unset;
    }
    }
   
    .team-badges__container {
        padding: 0px calc(var(--space-md) + var(--space-xs));
        margin-bottom: var(--space-md);
    }
</style>
<script setup lang="ts">
import Team from "@/store/models/team";
import {useTeamRequestStore} from '@/store/team-requests'
import {useQuery} from '@tanstack/vue-query'
import {useEventListener} from '@vueuse/core'
import { Console } from 'console';

const $q = useQuasar();

const route = useRoute();

const hasPlayedGames = computed(() => !!team.value?.games?.length)

const team = computed(() => useRepo(Team).withAll().where("id", route.params.id).first())

const stats = computed(
    () =>
            team.value
            ?.totalStats ?? {}
);

const toPercent = (val: number) => {
    return Number.parseInt((val * 100).toFixed(2));
};

const getIcon = (val: number) => {
    return val > 50 ? "arrow_drop_up" : "arrow_drop_down";
};
const getPercentileColor = (val: number) => {
    return val > 50 ? "green" : "red";
};
const viewing = ref(false);
const badgesOpen = ref(false)

const teamRequests = computed(() => useTeamRequestStore().requests?.filter(({team_id}) => team_id === Number(route.params.id) ?? []));


const getBadges = async (team_id: number) => {
    const client = useSupabaseClient();
    const {data} = await client.from('badges').select('*').eq('team_id', team_id).order('created_at', {ascending:false})
    return data;
}

const badgesLimited = computed(() => [...badges.value].splice(0,$q.screen.xs ? 2 : 4))

const {isLoading, data: badges} = useQuery({
    queryKey: ['team', 'badges', Number(route.params.id)],
    queryFn: () => getBadges(Number(route.params.id))
})

useEventListener(
    window,
    "popstate",
    () => {
        if (badgesOpen.value) {
            history.go(1)
            badgesOpen.value = false;
        } 
        if (viewing.value) {
            history.go(1)
            viewing.value = false;
        }
    }
);

</script>
<script lang="ts">
export default {
    name: "TeamPage",
};
</script>
