<template>
    <div class="linescore-grid__container" :style="columns" ref="nav">
        <div
            class="row justify-center items-center text-xl linescore-grid__container--item"
            :style="{
                backgroundColor: transparent ? '' : 'rgba(255,255,255, 0.8)',
            }"
        >
            <div class="grid__column">
                <div><div style="visibility: hidden">H</div></div>
                <div class="row items-center justify-center color-column">
                    <div class="team-avatar__container">
                    <TeamAvatar
                        style="height: 100%; width: 100%"
                        :team="game?.home"
                    />

                    <q-badge
                        class="hammer__badge"
                        color="deep-purple"
                        rounded
                        v-if="game.home?.id === game.hammerFirstEnd"
                    >
                        <q-icon name="hardware" color="white"></q-icon
                    ></q-badge>
                    <q-badge
                        :color="game?.homeColor || game?.home?.color"
                        rounded
                    >
                        <q-icon name="circle" :color="game?.homeColor"
                    /></q-badge>
                    </div>
                </div>
                <slot name="header" />
                <div
                    class="row items-center justify-center color-column"
    
                >
                <div class="team-avatar__container">
                    <TeamAvatar
                        style="height: 100%; width: 100%"
                        :team="game?.away"
                    />
                    <q-badge
                        class="hammer__badge"
                        color="deep-purple"
                        rounded
                        v-if="game.away?.id === game.hammerFirstEnd"
                    >
                        <q-icon name="hardware" color="white"></q-icon
                    ></q-badge>
                    <q-badge
                        :color="game?.awayColor || game?.away?.color"
                        rounded
                        ><q-icon name="circle" :color="game?.awayColor"
                    /></q-badge>
                </div>
                </div>
            </div>
        </div>
        <div
            v-for="end in ends"
            :key="`${end}-label`"
            class="row justify-center items-center text-xl linescore-grid__container--item"
            :class="{ selected: selected === end }"
            @click="emit('select', end)"
        >
            <div class="grid__column">
                <div class="end-column">{{ end }}</div>
                <div class="score-column color-column">{{ score[end]?.home ?? 0 }}</div>
                <slot v-bind:end="end" name="row" />
                <div class="score-column color-column">{{ score[end]?.away ?? 0 }}</div>
            </div>
        </div>
        <div
            class="row justify-center items-center text-xl linescore-grid__container--item"
        >
            <div class="grid__column final">
                <div class="end-column">T</div>
                <!-- :class="{ selected: awayTotal < homeTotal }" -->
                <div class="score-column color-column">
                    {{ homeTotal }}
                </div>

                <slot name="footer" />

                <!-- :class="{ selected: homeTotal < awayTotal }" -->
                <div class="score-column color-column">
                    {{ awayTotal }}
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.linescore-grid__container {
    width: 100%;
    display: grid;
    column-gap: 1px;
    .linescore-grid__container--item {
        border-bottom: 1px solid $grey-4;
        height: 100%;
        position: relative;
        &.selected {
            background-color: #00cd93;
            color: white;
            font-weight: bold;
        }
        &:not(:nth-child(1)) {
            .grid__column {
                grid-template-rows: repeat(5, auto);
            }
        }
        &:nth-child(1) {
            .grid__column {
                grid-template-rows: auto 1fr 1fr;
            }
        }

        .grid__column {
            display: grid;
            width: 100%;
            overflow: visible;
            height: 100%;
            .end-column {
                font-family: $font-family-main;
                border-bottom: 1px solid $grey-4;
                font-weight: bold;
            }
            .score-column {
                font-size: 0.8em;
                // background-color: red;
              
            }
            .color-column {
                  &:nth-child(2) {
                    background-color: v-bind(homeBackground);
                }
                &:nth-child(3):not(:last-child) {
                    background-color: v-bind(homeBackground);
                }
                &:nth-last-child(2):not(:nth-child(2)) {
                    background-color: v-bind(awayBackground);
                }
                &:last-child {
                     background-color: v-bind(awayBackground);
                }
            }
            > div {
                text-align: center;
            }
            .team-avatar__container {
                overflow: visible;
                position: relative;
                width: 30px;
                .q-badge {
                    position: absolute;
                    &.hammer__badge {
                        bottom: -2px;
                        padding: 2px;
                        right: -4px;
                    }
                    &:not(.hammer__badge) {
                        bottom: 0;
                        padding: 0px;
                        left: -2px;
                    }
                }
            }
        }
    }
}
</style>

<script setup lang="ts">
import { parseAvatar } from "@/utils/avatar";
import { GameScoreInfo, GameScore } from "@/types/game";

const props = defineProps<{
    colorCode: boolean;
    game: GameScoreInfo;
    endCount: number;
    score: GameScore;
    selected: number;
    transparent?: Boolean;
}>();

const ends = computed(() =>
    Array.from({ length: props.endCount }, (_, i) => i + 1)
);

const emit = defineEmits(["select"]);

const homeTotal = computed(() =>
    ends.value.reduce((acc, current) => {
        if (typeof props.score[current]?.home !== "number") return acc;
        return (acc += props.score[current]?.home);
    }, 0)
);
const awayTotal = computed(() =>
    ends.value.reduce((acc, current) => {
        if (typeof props.score[current]?.away !== "number") return acc;
        return (acc += props.score[current]?.away);
    }, 0)
);

const columns = computed(
    () => `grid-template-columns: 2fr repeat(${ends.value.length}, 1fr) 2fr`
);

const colors = {
    'red': 'rgba(253, 79, 79, 0.2)',
    'blue': 'rgba(79, 91, 253, 0.2)',
    'yellow': 'rgba(253, 212, 79, 0.2)'
}

const homeBackground = computed(() => {
    if (!props.colorCode) return;
    return colors[props.game.homeColor]
})
const awayBackground = computed(() => {
    if (!props.colorCode) return;
    return colors[props.game.awayColor]
})
</script>
