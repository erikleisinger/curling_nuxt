<template>
    <div class="row justify-between stats-overview__container">
        <div class="col-12">
 <SeasonOverview :teamIds="[teamId]" />
        </div>
         <!-- <div class="col-6 knob-container">
          
            <div class="full-width row justify-center">
                <q-knob
                    show-value
                
                    :model-value="stats.winPercent"
                    :size="$q.screen.xs ? '100px' : '150px'"
                    thickness="0.3"
                    :angle="35"
                    
                   style="margin: unset" 
                   :style="{color: getColor('yellow')}"      
                   readonly
                >
                    <div class="knob--text">
                        <h2>{{ stats.winPercent }}%</h2>
                    </div>
                </q-knob>
            </div>
              <h2 class="text-center text-sm" style="height: fit-content">
                Win percent
            </h2>
      
        </div>
        <div class="col-6 knob-container">
          
            <div class="full-width row justify-center">
                <q-knob
                    show-value
                
                    :model-value="stats.winPercent"
                    :size="$q.screen.xs ? '100px' : '150px'"
                    thickness="0.3"
                    :angle="35"
                    
                   style="margin: unset" 
                   :style="{color: getColor('yellow')}"      
                   readonly
                >
                    <div class="knob--text">
                        <h2>{{ stats.winPercent }}%</h2>
                    </div>
                </q-knob>
            </div>
              <h2 class="text-center text-sm" style="height: fit-content">
                Win percent
            </h2>
      
        </div> -->
        <div class="col-12" v-if="false">
            <!-- HAMMER EFFICIENCY -->
            <div class=" stat-header">
                      <label>Hammer efficiency</label>
                <div class="row">
             <Percentage
                color="yellow"
                :percent="stats.hammer_conversion_average * 100"
                height="16px"
              style="flex-grow: 1; margin-right: 32px"
            />
                <h4 class="text-bold" :style="{color: getColor('slate')}">
                    {{ (stats.hammer_conversion_average * 100).toFixed()
                    }}<span class="text-caption text-regular">%</span>
                </h4>

                </div>
            </div>
         
            <!-- FORCE -->
            <div class="stat-header">
                <label>Force efficiency</label>
                <div class="row">
                
              
                     <Percentage
                color="blue"
                :percent="stats.force_efficiency * 100"
                height="16px"
                style="flex-grow: 1; margin-right: 32px"
            />
              <h4 class="text-bold" :style="{color: getColor('slate')}">
                    {{ (stats.force_efficiency * 100).toFixed()
                    }}<span class="text-caption text-regular">%</span>
                </h4>
                </div>
            </div>
       
            <!-- STEAL -->
            <div class="stat-header">
                     <label>Steal efficiency</label>
                <div class="row">
           
             
                  <Percentage
                color="red"
                :percent="stats.steal_efficiency * 100"
                height="16px"
                style="flex-grow: 1; margin-right: 32px"
            />
               <h4 class="text-bold" :style="{color: getColor('slate')}">
                    {{ (stats.steal_efficiency * 100).toFixed()
                    }}<span class="text-caption text-regular">%</span>
                </h4>
                </div>
            </div>
          
            <!-- STEAL DEFENSE -->

            <div class="stat-header">
                <label>Steal defense </label>
                <div class="row">
                   
                    <Percentage
                        color="slate"
                        :percent="stats.steal_defense * 100"
                        height="16px"
                        style="flex-grow: 1; margin-right: 32px"
                    />
                     <h4 class="text-bold" :style="{color: getColor('slate')}">
                        {{ (stats.steal_defense * 100).toFixed()
                        }}<span class="text-caption text-regular">%</span>
                    </h4>
                </div>
            </div>
        </div>
       
    </div>
</template>
<style lang="scss" scoped>
.stats-overview__container {
    .knob--text {
        color: $app-slate;
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
            margin-top: var(--space-sm);
        }
        label {
            //    font-family: $font-family-header;
            color: $app-slate;
            @include text-caption;
            line-height: 0.1;
        }
        h4 {
            @include lg-text;
            font-weight: normal;
            @include line-tight;
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

const {getColor} = useColor();

const team = computed(() =>
    useRepo(Team).withAll().where("id", props.teamId).first()
);

const gamesPlayed = computed(() => team.value?.totalStats?.games_played ?? 0)

const stats = computed(() => team.value?.totalStats ?? {});
</script>
