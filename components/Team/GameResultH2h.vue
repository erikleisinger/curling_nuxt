<template>
    <div class="h2h-container">
        <div class="text-center text-bold h2h__header">
            {{ title }}
        </div>
        <div class="text-center h2h__header text-sm text-italic">
            {{ subtitle }}
        </div>
        <div class="h2h-percentage--wrap">
            <percentage
                :percent="homePercent"
                :color="game.homeColor"
                label=""
                reverse
                v-if="!loading"
            />
            <div>
                <q-btn
                    flat
                    round
                    icon="visibility"
                    :color="expanded ? 'primary' : 'grey-9'"
                    @click.prevent.stop="expanded = !expanded"
                />
            </div>
            <percentage
                :percent="awayPercent"
                :color="game.awayColor"
                label=""
                v-if="!loading"
            />
        </div>
         <div class="details-container"  :class="{expanded}">
            <KeepAlive>
                <LinescoreGridView
                    :game="game"
                    :endCount="endCount"
                    :score="score"
                    :selected="0"
                    class="grid-container"
                    :transparent="true"
                    colorCode
                    v-if="expanded"
                >
                    <template v-slot:header>
                    </template>
                    <template v-slot:row="{ end }">
                        <div class="score-column color-column">
                            <q-icon
                                class="scoreboard__icon"
                                :name="
                                    getIcon(score[end][`home_${stat}`])
                                "
                                :color="
                                    getIconColor(
                                        score[end][`home_${stat}`]
                                    )
                                "
                            />
                        </div>
                        <div class="score-column color-column">
                            <q-icon
                                class="scoreboard__icon"
                                :name="
                                    getIcon(score[end][`away_${stat}`])
                                "
                                :color="
                                    getIconColor(
                                        score[end][`away_${stat}`]
                                    )
                                "
                            />
                        </div>
                    </template>
                    <template v-slot:footer>
                        <div class="score-column color-column">
                            {{ homePercent.toFixed() }}%
                        </div>
                        <div class="score-column color-column">
                            {{ awayPercent.toFixed() }}%
                        </div>
                    </template>
                </LinescoreGridView>
            </KeepAlive>
            </div>
    </div>
</template>
<style lang="scss" scoped>
.expandDown-enter-active,
.expandDown-leave-active {
  transition: max-height 1s, opacity 1s;
}

.expandDown-enter,
.expandDown-leave-to {
  max-height: 0;
  opacity: 0;
}
.h2h-container {
    border: 1px solid $grey-4;
    box-shadow: $pretty-shadow;
    margin-top: var(--space-sm);
    padding: var(--space-xs);
    border-radius: 16px;
    background-color: rgba(255, 255, 255, 0.8);
    height: fit-content;
    .h2h-percentage--wrap {
        display: grid;
        grid-template-columns: calc(50% - 40px) auto calc(50% - 40px);
        grid-column-gap: 1em;
    }
    .h2h__header {
        margin-bottom: calc(-1 * var(--space-xs));
    }
    .scoreboard__icon {
        font-size: 1em;
    }
    .total__score {
        font-size: 1em;
    }
    .grid-container {
        margin: var(--space-xs) 0px;
     
    }
    .details-container {
        overflow: hidden;
        transition: all 0.4s;
        max-height: 0px;
        &.expanded {
            max-height: 1000px;
        }
    }
}
</style>
<script setup lang="ts">
import { GameScoreInfo, GameScore } from "@/types/game";

type GameTeamType = "home" | "away";

type StatType = "conversions" | "forces" | "hammer" | "steals";

const props = defineProps<{
    game: GameScoreInfo;
    endCount: number;
    score: GameScore;
    stat: StatType;
    subtitle: string;
    title: string;
}>();

const expanded = ref(false);

const homePercent = ref(0);
const awayPercent = ref(0);

const loading = ref(true);

const getPercents = () => {
    const totals = Object.entries(props.score).reduce(
        (all, [endNumber, value]) => {
            return {
                home: all.home + (value[`home_${props.stat}`] === true ? 1 : 0),
                homeEndCount:
                    all.homeEndCount +
                    (typeof value[`home_${props.stat}`] === "boolean" ? 1 : 0),
                away: all.away + (value[`away_${props.stat}`] === true ? 1 : 0),
                awayEndCount:
                    all.awayEndCount +
                    (typeof value[`away_${props.stat}`] === "boolean" ? 1 : 0),
            };
        },
        {
            home: 0,
            homeEndCount: 0,
            away: 0,
            awayEndCount: 0,
        }
    );

    homePercent.value = (totals.home / totals.homeEndCount) * 100;
    awayPercent.value = (totals.away / totals.awayEndCount) * 100;
    loading.value = false;
};
onBeforeMount(() => {
    getPercents();
});

const getIcon = (val: boolean) => {
    if (val === true) {
        return "check_circle";
    } else if (val === false) {
        return "cancel";
    }
    return "remove";
};

const getIconColor = (val: boolean) => {
    if (val === true) {
        return "positive";
    } else if (val === false) {
        return "negative";
    }
    return "";
};
</script>
