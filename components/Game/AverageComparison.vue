<template>
    <div class="row items-center" :class="{ reverse }" v-if="total && diff">
        <q-icon
            dense
            name="arrow_drop_up"
            :style="{ color: getColor('mint') }"
            v-if="diff > 0"
        />
        <q-icon
            dense
            name="arrow_drop_down"
            :style="{ color: getColor('red') }"
            v-else-if="diff < 0"
        />
        {{ diff }}%
    </div>
</template>
<script setup>
import TeamStatsTotal from "@/store/models/team-stats-total";
import { STAT_TYPES } from "@/constants/stats";
import { Stats } from "@/store/models/stats/stats";

const props = defineProps({
    reverse: Boolean,
    statName: String,
    stats: Object,
});

const { getColor } = useColor();

const teamId = computed(() => props.stats.team_id);

const total = computed(() =>
    useRepo(TeamStatsTotal).where("team_id", teamId.value).first()
);

const totalPercentMap = {
    [STAT_TYPES.HAMMER_EFFICIENCY]: "hammer_conversion_average",
    [STAT_TYPES.FORCE_EFFICIENCY]: "force_efficiency",
    [STAT_TYPES.STEAL_EFFICIENCY]: "steal_efficiency",
    [STAT_TYPES.STEAL_DEFENSE]: "steal_defense",
};

const diff = computed(() => {
    const currentPercent = new Stats([props.stats])[props.statName].percent;
    const totalPercent = total.value[totalPercentMap[props.statName]];
    return Number((currentPercent - totalPercent).toFixed(1));
});
</script>
