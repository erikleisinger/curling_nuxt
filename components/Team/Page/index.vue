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
    <div class="row justify-around attributes" v-if="hasPlayedGames">
        <TeamAttribute title="Games played" color="amber"  :class="$q.screen.xs ? 'col-5' : 'col-2'">
            <span>
                {{ stats.games_played ?? 0 }}
            </span>
        </TeamAttribute>
        <TeamAttribute
            title="Win %"
            color="amber"
            :class="$q.screen.xs ? 'col-5' : 'col-2'"
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
           :class="$q.screen.xs ? 'col-5' : 'col-2'"
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
           :class="$q.screen.xs ? 'col-5' : 'col-2'"
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
 
</template>
<style lang="scss" scoped>
    .team-details__viewer {
        width: min(100vw, 500px); 
        height: min(100vh, 600px);

    }
    .attributes {
        margin: 0px var(--space-md)
    }
</style>
<script setup lang="ts">
import Team from "@/store/models/team";
import {useTeamRequestStore} from '@/store/team-requests'

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


const teamRequests = computed(() => useTeamRequestStore().requests?.filter(({team_id}) => team_id === Number(route.params.id) ?? []));
</script>
<script lang="ts">
export default {
    name: "TeamPage",
};
</script>
