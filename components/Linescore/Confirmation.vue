<template>
    <h2 class="text-md text-bold title q-pa-md text-center">
        Review & confirm
    </h2>
    <div class="linescore-confirmation__wrap">
        <div class="linescore-confirmation__container">
            <div class="team-result__container">
                <div class="score__container">{{ score.home }}</div>
                <div class="team__container">
                    <div style="width: 5em">
                        <TeamAvatar
                            :team="gameParams.home?.id ? gameParams.home : {}"
                        />
                    </div>
                    <div class="text-center text-bold text-md">
                        {{ gameParams.home?.name || "Opposition team" }}
                    </div>
                    <div class="row justify-around full-width">
                        <RockIcon
                            :color="gameParams.homeColor"
                            style="height: 2em; width: 2em"
                            :draggable="false"
                        />

                        <q-icon
                            v-if="
                                gameParams.hammerFirstEndTeam ===
                                gameParams.home?.id
                            "
                            :name="'hardware'"
                            color="primary"
                            class="hammer-icon selected"
                            size="2em"
                        />
                        <div v-else />
                    </div>
                </div>
            </div>
            <div class="team-result__container">
                <div class="score__container" style="margin-top: -0.1em">:</div>
                <div />
            </div>
            <div class="team-result__container">
                <div class="score__container">{{ score.away }}</div>
                <div class="team__container">
                    <div style="width: 5em">
                        <TeamAvatar
                            :team="gameParams.away?.id ? gameParams.away : {}"
                        />
                    </div>
                    <div class="text-bold text-md text-center">
                        {{ gameParams.away?.name || "Opposition team" }}
                    </div>
                    <div class="row justify-around full-width">
                        <RockIcon
                            :color="gameParams.awayColor"
                            style="height: 2em; width: 2em"
                            :draggable="false"
                        />
                        <q-icon
                            v-if="
                                gameParams.hammerFirstEndTeam ===
                                gameParams.away?.id
                            "
                            :name="'hardware'"
                            color="primary"
                            class="hammer-icon selected"
                            size="2em"
                        />
                        <div v-else />
                    </div>
                </div>
            </div>
        </div>
        <div class="full-width row justify-center q-mt-lg q-mt-sm-xl">
      
            <div class="column items-center details__container full-width">
                <div class="line-header__container">
                      <h2 class="text-md text-bold">Start time</h2>
                      <!-- <div class="header-edit">
                         <q-btn flat round icon="edit" color="grey-8" size="sm" @click="emit('nav', views.DETAILS)"/>
                      </div> -->
                </div>
            <div class="q-mb-lg">
           {{ format(toTimezone(dayjs(startTime, "YYYY MM DD hh mm a"))) }}
           
            </div>

             <div class="line-header__container">
                      <h2 class="text-md text-bold">Rink</h2>
                      <!-- <div class="header-edit">
                         <q-btn flat round icon="edit" color="grey-8" size="sm" @click="emit('nav', views.DETAILS)"/>
                      </div> -->
                </div>
          
            <div class="row justify-center items-center full-width q-mb-lg no-wrap">
                <div class="row items-center rink-sheet__container">
                <q-icon name="location_on" color="red" size="2em" />
                <div class="column justify-center rink-selection__name">
                    <div>
                        {{ rink ? rink?.name : "No rink selected" }}
                    </div>
                    <div class="text-xs">
                        {{ rink?.city 
                        }}{{ rink && `, ${rink?.province}` }}
                    </div>
                    
                </div>
                 
                </div>
            </div>
       <div class="line-header__container">
                      <h2 class="text-md text-bold">Sheet</h2>
                      <!-- <div class="header-edit">
                         <q-btn flat round icon="edit" color="grey-8" size="sm" @click="emit('nav', views.DETAILS)"/>
                      </div> -->
                </div>

            <div class="row items-center full-width justify-center">
                <div class="row items-center rink-sheet__container" >
                <q-icon name="crop_portrait" color="primary" size="2em" />
                <div v-if="sheet">Sheet {{ sheet }} ({{ numberToLetter(sheet) }})</div>
                <div v-else>No sheet selected</div>
            
                </div>
            </div>
           
        </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.linescore-confirmation__wrap {
    width: min(100%,400px);
    margin: auto;
    height: 100%;
    display: grid;
    grid-template-rows: min-content min-content;

    .linescore-confirmation__container {
        display: grid;
        grid-template-columns: 1fr 2em 1fr;
        .team-result__container {
            display: grid;
            grid-template-rows: min-content min-content;

            .score__container {
                font-size: 5em;
                display: flex;
                justify-content: center;
            }
            .team__container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;
            }
           
        }
    }
    .confirm-button__container {
        // padding: var(--space-md);
        display: flex;
        justify-content: center;
        align-items: center;
        :deep(.q-btn) {
            width: 75%;
        }
    }
}
.details__container {
    max-width: min(90vw, 400px);
     .rink-sheet__container {
                width: 200px;
            }
            .line-header__container {
                position: relative;
                .header-edit {
                    position: absolute;
                    right: -2em;
                    top: 0;
                }
            }
}
</style>
<script setup>
import { parseAvatar } from "@/utils/avatar";
import { numberToLetter } from "@/utils/sheets";
import {views} from '@/constants/linescore'
const props = defineProps({
    score: Object,
    gameParams: Object,
    startTime: String,
    rink: Object,
    sheet: Number,
});

const emit = defineEmits(['nav', "save"]);

const { format, toTimezone } = useTime();
const dayjs = useDayjs();
</script>
