<template>
    <div class="team__container">
        <section name="players" class="section">
            <h3 class="truncate-text" v-if="team.name">{{ team.name }}</h3>
            <div v-if="team.fourth_player_id">
                {{ team.fourth_player_name }}
            </div>
            <div v-if="team.third_player_id">{{ team.third_player_name }}</div>

            <div v-if="team.second_player_id">
                {{ team.second_player_name }}
            </div>
            <div v-if="team.lead_player_id">{{ team.lead_player_name }}</div>

            <div v-if="team.fifth_player_id">{{ team.fifth_player_name }}</div>
            <div v-if="team.sixth_player_id">{{ team.sixth_player_name }}</div>
            <div v-if="team.seventh_player_id">
                {{ team.seventh_player_name }}
            </div>
        </section>
        <section name="stats" class="stats__section">
            <div class="row justify-around">
                <div style="width: 33%">
                <StatsCard label="Wins" :value="team.wins" size="100%" />
                </div>
                 <div style="width: 33%">
                <StatsCard label="Draws" :value="team.ties" size="100%" />
                  </div>
                    <div style="width: 33%">
                <StatsCard label="Losses" :value="team.losses" size="100%"  />
                  </div>
            </div>
            <div class="row justify-center items-center">
                <StatsWheel
                    label="Team"
                    style="width: 60%; height: 60%"
                    :value="teamAverage"
                  
                />
            </div>
        </section>
    </div>
</template>
<style lang="scss" scoped>
.team__container {
    display: grid;
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: 1fr;
    .section {
        border: 1px solid black;
        overflow: hidden;
    }
    .stats__section {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: repeat(2, 50%);
        min-height: 250px;
    }
}
</style>
<script setup>
import { calculateTeamStats } from "@/utils/stats";
const props = defineProps({
    team: Object,
});
const teamAverage = ref(0);
onMounted(() => {
    const { teamAverage: ta } = calculateTeamStats(props.team);
    teamAverage.value = parseInt(ta);
});
</script>
