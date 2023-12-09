<template>
    <TeamPageHeader :teamId="Number(route.params.id)" />
    <div class="row justify-around ">
        <TeamAttribute title="Games played" color="amber" class="col-5">
            <span>
                {{ stats.games_played ?? 0 }}
            </span>
        </TeamAttribute>
        <TeamAttribute title="Win %" color="amber" class="col-5" :percent="stats.winPercentile" >
            <span>
                {{ stats.winPercent }}%
            </span>
             <template v-slot:extra>
                <q-icon :name="getIcon(stats.winPercentile)" :color="getPercentileColor(stats.winPercentile)"/>
                <span :style="{color: getPercentileColor(stats.winPercentile)}">{{stats.winPercentile}}%</span>
            </template>
        </TeamAttribute>
         <TeamAttribute title="Hammer first end" color="amber" class="col-5" :percent="stats.HFEPercentile" >
            <span>
                {{ stats.HFEPercent }}%
            </span>
             <template v-slot:extra>
                <q-icon :name="getIcon(stats.HFEPercentile)" :color="getPercentileColor(stats.HFEPercentile)"/>
                <span :style="{color: getPercentileColor(stats.HFEPercentile)}">{{stats.HFEPercentile}}%</span>
            </template>
        </TeamAttribute>
           <TeamAttribute title="Hammer last end" color="amber" class="col-5" :percent="stats.HLEPercentile" >
            <span>
                {{ stats.HLEPercent }}%
            </span>
            <template v-slot:extra>
                <q-icon :name="getIcon(stats.HLEPercentile)" :color="getPercentileColor(stats.HLEPercentile)"/>
                <span :style="{color: getPercentileColor(stats.HLEPercentile)}">{{stats.HLEPercentile}}%</span>
            </template>
        </TeamAttribute>
    </div>

    <ChartTeamStatsTime
        :teamId="Number(route.params.id)"
        :visibleStats="['Hammer efficiency']"
    />
    <GameResultList :teamId="Number(route.params.id)"/>
</template>
<script setup lang="ts">
import Team from "@/store/models/team";

const route = useRoute();

const stats = computed(
    () =>
        useRepo(Team).withAll().where("id", route.params.id).first()
            ?.totalStats ?? {}
);

const toPercent = (val: number) => {
    return Number.parseInt((val * 100).toFixed(2));
};

const getIcon = (val: number) => {
    console.log('VALUE: ', val)
    return val > 50 ? 'arrow_drop_up' : 'arrow_drop_down'
}
const getPercentileColor = (val:number) => {
    return val > 50 ? 'green' : 'red'
}
</script>
<script lang="ts">
export default {
    name: "TeamPage",
};
</script>
