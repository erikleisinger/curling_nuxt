<template>
    <DashboardTile
        :type="STAT_TYPES.STEAL_EFFICIENCY"
        :percent="average"
        :color="color"
        :stats="stats"
    >

       <template v-slot:expanded>
                <!-- GAMES PLAYED -->

                <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                        <q-icon
                            name="o_hardware"
                            size="0.8em"
                            color="white"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title>Winning average</template>
                    <template v-slot:subtitle>
                        Median steal efficiency when winning
                    </template>
                    <template v-slot:value>
                        <DashboardStatValue
                            isPercent
                            :value="stats[STAT_TYPES.STEAL_EFFICIENCY].winAverage"
                        />
                    </template>
                </DashboardStatDetailsItemTemplate>
                <DashboardStatDetailsItemTemplate>
                    <template v-slot:icon>
                        <q-icon
                            name="o_hardware"
                            size="0.8em"
                            color="white"
                            class="q-mr-sm"
                        />
                    </template>
                    <template v-slot:title>Losing Average</template>
                    <template v-slot:subtitle>
                        Median steal efficiency when losing
                    </template>

                    <template v-slot:value>
                        <DashboardStatValue
                            isPercent
                            :value="stats[STAT_TYPES.STEAL_EFFICIENCY].lossAverage"
                        />
                    </template>
                </DashboardStatDetailsItemTemplate>

                <q-separator class="separator" />

                  <DashboardStatGroupSeasonHighLow :type="STAT_TYPES.STEAL_EFFICIENCY" :stats="stats" isPercent/>
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
} from "@/presentation/constants/stats";

const props = defineProps({
    stats: Object,
});

const { getColor } = useColor();
const color = getColor(STAT_COLORS[STAT_TYPES.STEAL_EFFICIENCY]);

const average = computed(
    () => props.stats[STAT_TYPES.STEAL_EFFICIENCY].percent
);
const seasonHigh = computed(
    () => props.stats[STAT_TYPES.STEAL_EFFICIENCY].seasonHigh
);
const seasonLow = computed(
    () => props.stats[STAT_TYPES.STEAL_EFFICIENCY].seasonLow
);






</script>
<script>
export default {
    name: "StealEfficiency",
};
</script>
