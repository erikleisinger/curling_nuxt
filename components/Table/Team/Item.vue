<template>
    <div class="team__container" >
         <h3 class="truncate-text text-bold text-center q-px-lg" v-if="team.name">Team {{ team.name }}</h3>
        
        <section name="stats" class="stats__section row items-center">
            <div class="row justify-around items-center full-width">
               
                    <!-- <h2>{{team.wins}}</h2>
                    <h2>W</h2> -->
                <StatsCard label="Wins" :value="team.wins" :size="5" />
             
                     <!-- <h2>{{team.losses}}</h2>
                    <h2>L</h2> -->
                <StatsCard label="Draws" :value="team.ties" :size="5"/>
           
                            <!-- <h2>{{team.ties}}</h2>
                    <h2>T</h2> -->
                <StatsCard label="Losses" :value="team.losses" :size="5"  />
              
            </div>
       
          
        </section>
             <section name="players" class="section">
           
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
    </div>
</template>
<style lang="scss" scoped>
.team__container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr 1fr;
    column-gap: 1em;
      border-bottom: 1px solid rgba(0,0,0,0.3);
      padding-right: var(--space-sm);
       padding-left: var(--space-sm);
    .section {
        overflow: hidden;
       
         padding-top: var(--space-sm);
          padding-bottom: var(--space-sm);
    }
    .stats__section {
        // display: grid;
        // grid-template-columns: 1fr;
        // grid-template-rows: repeat(2, 50%);
        min-height: 100px;
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
