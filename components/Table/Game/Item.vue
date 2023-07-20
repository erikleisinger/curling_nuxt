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
            </div>
          
        </q-item-section>
    </q-item>
</template>
<style lang="scss">
.score-display {
    width:100%;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: calc(33% - 32px) 33% calc(33% - 32px);
    column-gap: 32px;
}
</style>
<script setup lang="ts">
import type Game from "@/types/game";

const props = defineProps<{
    game: Game;
}>();
const emit = defineEmits(["delete", "edit", "select"]);

const { toTimezone } = useTime();

</script>
