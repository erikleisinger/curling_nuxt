<template>
    <DashboardTile
        :type="STAT_TYPES.WINS"
        :percent="stats.wins.percent"
        ref="tile"
        :color="color"
        :stats="stats"
    >
     
      <template v-slot:expanded>
                <!-- GAMES PLAYED -->

                <DashboardStatDetailsItemTemplate>
                    <template v-slot:title>Games played</template>
                    <template v-slot:value>{{ stats?.gamesPlayed }}</template>
                </DashboardStatDetailsItemTemplate>

                <q-separator class="separator" />

                <!-- COLOR STATS -->

                <DashboardStatGroupColor
                isPercent
                    :stats="stats"
                    :type="STAT_TYPES.WINS"
                />

                <q-separator class="separator" />


                <DashboardStatDetailsItemHammer2 :stats="stats.wins" :endsRemaining="0" />
                  <q-separator class="separator" />
                 <DashboardStatDetailsItemHammer2 :stats="stats.wins" :endsRemaining="-1" />
                   <q-separator class="separator" />
                  <DashboardStatDetailsItemHammer2 :stats="stats.wins" :endsRemaining="1" />
                    <q-separator class="separator" />
                   <DashboardStatDetailsItemHammer2 :stats="stats.wins" :endsRemaining="2" />
   </template>
    </DashboardTile>
</template>
<style lang="scss" scoped>
.separator {
    background-color: v-bind(color);
    margin-bottom: var(--space-md);
    margin-top: calc(var(--space-md) - 4px);
}

</style>
<script setup>
import {
    STAT_COLORS,
    STAT_TYPES,
} from "@/constants/stats";
const props = defineProps({
    stats: Object,
});

const { getColor } = useColor();
const color = getColor(STAT_COLORS[STAT_TYPES.WINS]);

</script>
<script>
export default {
    name: "Wins",
};
</script>
