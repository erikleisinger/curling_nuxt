<template>
    <div class="linescore-grid__container" :style="columns" ref="nav">
        <div
            class="row justify-center items-center text-xl linescore-grid__container--item"
            :style="{
                backgroundColor: transparent ? '' : 'rgba(255,255,255, 0.8)',
            }"
        >
            <div class="grid__column" :style="hideScoreStyle">
                <div>
                    <slot name="prependHeader">
                        <div style="visibility: hidden">H</div>
                    </slot>
                </div>
                <div class="row items-center justify-center" v-if="!headerOnly">
                        <slot name="avatarHome">
                    <div class="team-avatar__container">
                    
                        <TeamAvatar
                            style="height: 100%; width: 100%"
                            :teamId="game?.home?.id"
                            :viewable="false"
                            :color="game?.home_color"
                        />

                        <q-badge
                            class="hammer__badge"
                            color="deep-purple"
                            rounded
                            v-if="game.home?.id === game.hammerFirstEnd"
                        >
                            <q-icon name="hardware" color="white"></q-icon
                        ></q-badge>
                    </div>
                        </slot>
                </div>
                <slot name="header" />
          
                <div class="row items-center justify-center" v-if="!headerOnly">
                          <slot name="avatarAway">
                    <div class="team-avatar__container">
                        <TeamAvatar
                            style="height: 100%; width: 100%"
                            :teamId="game?.away?.id"
                            :viewable="false"
                            :color="game?.away_color"
                        />
                        <q-badge
                            class="hammer__badge"
                            color="deep-purple"
                            rounded
                            v-if="game.away?.id === game.hammerFirstEnd"
                        >
                            <q-icon name="hardware" color="white"></q-icon
                        ></q-badge>
                    </div>
                        </slot>
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
            <div class="grid__column" :style="hideScoreStyle">
                <div class="end-column">{{ end }}</div>
                <div class="score-column" v-if="!headerOnly">
                    {{ score[end]?.home ?? 0 }}
                </div>
                <slot v-bind:end="end" name="row" />
                <div class="score-column" v-if="!headerOnly">
                    {{ score[end]?.away ?? 0 }}
                </div>
            </div>
        </div>
        <div
            class="row justify-center items-center text-xl linescore-grid__container--item"
        >
            <div class="grid__column final" :style="hideScoreStyle">
                <div class="end-column">
                    <slot name="appendHeader"> T </slot>
                </div>
                <div class="score-column" v-if="!headerOnly">
                    {{ homeTotal }}
                </div>

                <slot name="footer" />
                <div class="score-column" v-if="!headerOnly">
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
    headerOnly?: boolean;
    score: GameScore;
    selected?: number;
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
const hideScoreStyle = computed(() =>
    props.headerOnly ? { "grid-template-rows": "1fr" } : {}
);
</script>
