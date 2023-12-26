<template>
    <div class="row no-wrap justify-between  stats-overview__container">
        <div class="col-6">
            <!-- HAMMER EFFICIENCY -->
            <div class="row justify-between no-wrap items-center stat-header">
                <label>Hammer efficiency</label>
                <h4 class="text-bold">
                    {{ (stats.hammer_conversion_average * 100).toFixed() }}<span class="text-xs text-regular">%</span>
                </h4>
            </div>
            <Percentage
                color="purple"
                :percent="stats.hammer_conversion_average * 100"
                height="6px"
                style="width: 100%"
            />
<!-- FORCE -->
            <div class="row justify-between no-wrap items-center stat-header">
                <label>Force efficiency</label>
                <h4 class="text-bold">
                    {{ (stats.force_efficiency * 100).toFixed() }}<span class="text-xs text-regular">%</span>
                </h4>
            </div>
            <Percentage
                color="blue"
                :percent="stats.force_efficiency * 100"
                height="6px"
                style="width: 100%"
            />
            <!-- STEAL -->
             <div class="row justify-between no-wrap items-center stat-header">
                <label>Steal efficiency</label>
                <h4 class="text-bold">
                    {{ (stats.steal_efficiency * 100).toFixed() }}<span class="text-xs text-regular">%</span>
                </h4>
            </div>
            <Percentage
                color="red"
                :percent="stats.steal_efficiency * 100"
                height="6px"
                style="width: 100%"
            />
                <!-- STEAL DEFENSE -->
             <div class="row justify-between no-wrap items-center stat-header">
                <label>Steal defense </label>
                <h4 class="text-bold">
                    {{ (stats.steal_defense * 100).toFixed() }}<span class="text-xs text-regular">%</span>
                </h4>
            </div>
            <Percentage
                color="blue-grey"
                :percent="stats.steal_defense * 100"
                height="6px"
                style="width: 100%"
            />
        </div>
        <div class="col-6 knob-container">
            <h2 class="text-center text-sm " style="height: fit-content">
                Win percent
            </h2>
            <div class="full-width row justify-center q-mt-sm">
            <q-knob
                show-value
                class="text-blue-10 q-ma-md"
                :model-value="stats.winPercent"
                :size="$q.screen.xs ? '100px' : '150px'"
                color="blue-10"
                :angle="45"
                track-color="grey-3"
                style="margin: auto"
                readonly
            >
                <div class="knob--text">
                    <h2>{{ stats.winPercent }}%</h2>
                </div>
            </q-knob>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.stats-overview__container {

.knob--text {
    h2 {
        font-weight: bold;
        font-size: calc(var(--text-md) * 1);
        text-align: center;
    }
    h3 {
        font-size: 0.5em;
        text-align: center;
    }
}
.stat-header {
    &:not(:first-child) {
        margin-top: var(--space-xs);
    }
    label {
        font-size: calc(var(--text-xs) * 1.1);
    }
    h4 {
        font-size: calc(var(--text-sm) * 1.2) ;
    }
    @include sm {
        font-size: var(--text-lg);
    }
}
.knob-container {
     margin-right: -20px;
    // margin-bottom: var(--space-sm);
    @include sm {
   
          margin: unset;
            margin-right: 0px;
    }
}
}

</style>
<script setup>
import Team from "@/store/models/team";
const props = defineProps({
    teamId: Number,
});

const $q = useQuasar();

const team = computed(() =>
    useRepo(Team).withAll().where("id", props.teamId).first()
);

const stats = computed(() => team.value?.totalStats ?? {});
</script>
