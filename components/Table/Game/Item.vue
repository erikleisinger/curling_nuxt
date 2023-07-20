<template>
    <q-item style="max-width:100vw">
        <div style="position: absolute; top: 0; right: 0" class="q-pa-xs row">
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
        </div>
        <q-item-section>
            <div style="width:100%">
                <div class="column items-center">
                    <div>{{ toTimezone(game.start_time) }}</div>
                    <div v-if="game.rink_id">{{ game.rink_id.name }}</div>
                    <div v-if="game.sheet_id">{{ game.sheet_id.name }}</div>
                </div>
            </div>
            <div class="score-display">
                <!-- Home team -->
                <div class="column items-center justify-center">
                    <RockIcon
                        :draggable="false"
                        style="height: 50px; width: 50px"
                        :color="game.home_color"
                    />
                    <div class="truncate-text text-center" style="width: 100%">
                        {{ game.home.name }}
                    </div>
               
                </div>
                <!-- Score -->
                <div class="column">
                <div
                    class="row justify-between items-center"
                    style="min-width: 50px; font-size: 3em"
                >
                    <div >{{ game.score_home ?? 0 }}</div>
                    <div >:</div>
                    <div >{{ game.score_away ?? 0 }}</div>
                   
                </div>
                 <div class="row justify-center" >After {{game.ends ?? 0}} ends</div>
                </div>
                <!-- Away team -->
                <div class="column items-center justify-center">
                    <RockIcon
                        :draggable="false"
                        style="height: 50px; width: 50px"
                        :color="game.away_color"
                    />
                    <div class="truncate-text text-center" style="width: 100%">
                        {{ game.away.name }}
                    </div>
                   
                </div>
                       <div style="width:100%"  class="percent-container">
                      <percentage :percent="getPercent(game.home_percentage)" :color="game.home_color" label="All"/>
                     <percentage :percent="getPercent(game.home_percentage_lead)" :color="game.home_color" label="Lead"/>
                     <percentage :percent="getPercent(game.home_percentage_second)" :color="game.home_color" label="Second"/>
                     <percentage :percent="getPercent(game.home_percentage_third)" :color="game.home_color" label="Third"/>
                     <percentage :percent="getPercent(game.home_percentage_fourth)" :color="game.home_color" label="Fourth"/>
                     <percentage :percent="getPercent(game.home_percentage_fifth)" :color="game.home_color" label="Fifth"/>
                     </div>
                     <div/>
                 <div style="width:100%" class="percent-container">
                   <percentage :percent="getPercent(game.away_percentage)" :color="game.away_color" label="All" reverse/>
                     <percentage :percent="getPercent(game.away_percentage_lead)" :color="game.away_color" label="Lead" reverse/>
                     <percentage :percent="getPercent(game.away_percentage_second)" :color="game.away_color" label="Second" reverse/>
                     <percentage :percent="getPercent(game.away_percentage_third)" :color="game.away_color" label="Third" reverse/>
                     <percentage :percent="getPercent(game.away_percentage_fourth)" :color="game.away_color" label="Fourth" reverse/>
                     <percentage :percent="getPercent(game.away_percentage_fifth)" :color="game.away_color" label="Fifth" reverse/>

                         </div>
            </div>
          
        </q-item-section>
    </q-item>
</template>
<style lang="scss">
.score-display {
    width:100%;
    display: grid;
    grid-template-rows: 1fr auto;
    grid-template-columns: calc(33% - 32px) 33% calc(33% - 32px);
    column-gap: 32px;
    .percent-container {
        grid-column : span 1
    }

}
</style>
<script setup lang="ts">
import type Game from "@/types/game";

const props = defineProps<{
    game: Game;
}>();
const emit = defineEmits(["delete", "edit", "select"]);

const { toTimezone } = useTime();
const getPercent = (score: number | null) => {
    if (!score) return 0
    const percent = score / 4 *100
    return Number(percent.toFixed())
}

</script>
