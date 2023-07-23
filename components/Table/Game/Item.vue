<template>
<TableGameItemContainer :selected="selected" @click="selected = true"         ref="gameContainer">
    <template v-slot:label>
            <!-- Game info: date, rink, sheet -->
          
                    <div class="column items-center" style="font-size: 0.85em">
                        <div>{{ toTimezone(game.start_time) }}</div>
                        <div class="row">
                            <div v-if="game.rink_id" class="q-pr-xs">
                                {{ game.rink_id.name }}
                            </div>
                            <div v-if="game.rink_id && game.sheet_id">/</div>
                            <div v-if="game.sheet_id" class="q-pl-xs">
                                {{ game.sheet_id.name }}
                            </div>
                        </div>
                    </div>
        
    </template>
            <!-- Begin score display -->
            <div class="score-display">
                <!-- Home team -->
                <div class="column items-center justify-center">
                    <RockIcon
                        :draggable="false"
                        style="height: 50px; width: 50px"
                        :color="game.home_color"
                    />
                    <div
                        class="truncate-text text-center"
                        style="width: 100%; padding-top: 8px"
                    >
                        {{ game.home.name }}
                    </div>
                </div>
                <!-- Score -->
                <!-- Score Home -->
                <div style="font-size: 3em; text-align: right">
                    {{ game.score_home ?? 0 }}
                </div>
                <div
                    style="
                        font-size: 3em;
                        text-align: center;
                        position: relative;
                    "
                >
                    :
                    <div
                        style="
                            position: absolute;
                            width: 60px;
                            left: -9px;
                            bottom: 2px;
                            overflow: visible;
                            font-size: 12px;
                        "
                    >
                        After 10
                    </div>
                </div>
                <!-- Score Away -->
                <div style="font-size: 3em; text-align: left">
                    {{ game.score_away ?? 0 }}
                </div>

                <!-- Away team -->
                <div class="column items-center justify-center">
                    <RockIcon
                        :draggable="false"
                        style="height: 50px; width: 50px"
                        :color="game.away_color"
                    />
                    <div
                        class="truncate-text text-center"
                        style="width: 100%; padding-top: 8px"
                    >
                        {{ game.away.name }}
                    </div>
                </div>
                <div
                    class="percent-container col-6"
                    :style="{ maxHeight: showStats ? '1000px' : '0px' }"
                >
                    <percentage
                        :percent="getPercent(game.home_percentage)"
                        :color="game.home_color"
                        label="Total"
                    />
                    <percentage
                        :percent="getPercent(game.home_percentage_fourth)"
                        :color="game.home_color"
                        label="Fourth"
                    />
                    <percentage
                        :percent="getPercent(game.home_percentage_third)"
                        :color="game.home_color"
                        label="Third"
                    />
                    <percentage
                        :percent="getPercent(game.home_percentage_second)"
                        :color="game.home_color"
                        label="Second"
                    />

                    <percentage
                        :percent="getPercent(game.home_percentage_lead)"
                        :color="game.home_color"
                        label="Lead"
                    />
                </div>
                <div />
                <div
                    class="percent-container col-6"
                    :style="{ maxHeight: showStats ? '1000px' : '0px' }"
                >
                    <percentage
                        :percent="getPercent(game.away_percentage)"
                        :color="game.away_color"
                        label="Total"
                        reverse
                    />
                    <percentage
                        :percent="getPercent(game.away_percentage_fourth)"
                        :color="game.away_color"
                        label="Fourth"
                        reverse
                    />

                    <percentage
                        :percent="getPercent(game.away_percentage_third)"
                        :color="game.away_color"
                        label="Third"
                        reverse
                    />

                    <percentage
                        :percent="getPercent(game.away_percentage_second)"
                        :color="game.away_color"
                        label="Second"
                        reverse
                    />
                    <percentage
                        :percent="getPercent(game.away_percentage_lead)"
                        :color="game.away_color"
                        label="Lead"
                        reverse
                    />
                </div>
            </div>
            <!-- <transition appear enter-active-class="animated slideInLeft" leave-active-class=" animated slideOutRight"> -->
            <div v-if="selected" class="row justify-center">
                <q-btn
                    flat
                    round
                    @click.stop="emit('select', props.game)"
                    icon="launch"
                    color="primary"
                />
                <q-btn
                    size="12px"
                    flat
                    dense
                    round
                    icon="edit"
                    color="primary"
                    @click.stop="emit('edit', props.game)"
                ></q-btn>
                <q-btn
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete"
                    color="primary"
                    @click.stop="emit('delete', props.game)"
                ></q-btn>
                <q-btn flat @click="showStats = !showStats">{{
                    showStats ? "Hide stats" : "Show stats"
                }}</q-btn>
            </div>
            <!-- </transition> -->
</TableGameItemContainer>
</template>
<style lang="scss">

   
          
    .score-display {
        width: 100%;
        display: grid;
        grid-template-rows: 1fr auto;
        // grid-template-columns: calc(33% - 32px) 33% calc(33% - 32px);
        grid-template-columns: minmax(0, 1fr) 50px 3em 50px minmax(0, 1fr);
        row-gap: 16px;

        .percent-container {
            grid-column: span 2;
            transition: all 1s;
            overflow: hidden;
        }
    }

  
</style>
<script setup lang="ts">
import type Game from "@/types/game";
import { onClickOutside } from "@vueuse/core";

const props = defineProps<{
    game: Game;
}>();

const showStats = ref(false);

const emit = defineEmits(["delete", "edit", "select"]);

const { toTimezone } = useTime();
const {getPercent} = useConvert();
    const selected = ref(false);
const gameContainer = ref(null);
onClickOutside(gameContainer, () => {
    selected.value = false;
});
</script>
