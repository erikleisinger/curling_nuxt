<template>
    <div class="linescore-grid__container" ref="nav">
        <div
            class="row justify-center items-center text-xl linescore-grid__container--item"
        >
            <div class="grid__column">
                <div></div>
                <div class="row items-center team-avatar__container">
                    <Avataaar
                        style="height: 100%; width: 100%"
                        v-bind="parseAvatar(game.home?.avatar)"
                    >
                    </Avataaar>
                    <q-badge
                        class="hammer__badge"
                        color="deep-purple"
                        rounded
                        v-if="game.home?.id === game.hammerFirstEnd"
                    >
                        <q-icon name="hardware" color="white"></q-icon
                    ></q-badge>
                    <q-badge :color="game?.home?.color" rounded></q-badge>
                </div>
                <div
                    class="row items-center team-avatar__container"
                    style="width: 1em"
                >
                    <Avataaar
                        style="height: 100%; width: 100%"
                        v-bind="parseAvatar(game.away?.avatar)"
                    />
                    <q-badge
                        class="hammer__badge"
                        color="deep-purple"
                        rounded
                        v-if="game.away?.id === game.hammerFirstEnd"
                    >
                        <q-icon name="hardware" color="white"></q-icon
                    ></q-badge>
                    <q-badge :color="game?.away?.color" rounded></q-badge>
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
                <div>{{ end }}</div>
                <div>{{ score[end].home }}</div>
                <div>{{ score[end].away }}</div>
            </div>
        </div>
        <div
            class="row justify-center items-center text-xl linescore-grid__container--item"
        >
            <div class="grid__column full-width total">
                <div class="row justify-center items-center">T</div>
                <!-- :class="{ selected: awayTotal < homeTotal }" -->
                <div class="row justify-center items-center">
                    {{ homeTotal }}
                </div>
                <!-- :class="{ selected: homeTotal < awayTotal }" -->
                <div class="row justify-center items-center">
                    {{ awayTotal }}
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.linescore-grid__container {
    // height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 2fr repeat(10, 1fr) 2fr;
    column-gap: 1px;
    background-color: $grey-4;
    .linescore-grid__container--item {
        border-bottom: 1px solid $grey-4;
        background-color: white;
        height: 100%;
        position: relative;
        &.selected {
            background-color: #00cd93;
            color: white;
            font-weight: bold;
        }

        .grid__column {
            display: grid;
            grid-template-rows: repeat(3, 33%);
            overflow: visible;
            height: 100%;
            &.total {
                // background-color: rgba(0, 0, 0, 0.1);
            }
            > div {
                text-align: center;
            }
            .team-avatar__container {
                overflow: visible;
                position: relative;
                .q-badge {
                    position: absolute;

                    right: 0;
                    &.hammer__badge {
                        top: 0;
                        padding: 2px;
                        right: -2px;
                    }
                    &:not(.hammer__badge) {
                        bottom: 0.4em;
                    }
                }
            }
        }
    }
}
</style>

<script setup lang="ts">
import { parseAvatar } from "@/utils/avatar";
interface GameScoreTeam {
    id: number;
    avatar: string;
    color: string;
}

interface GameScoreInfo {
    home: GameScoreTeam;
    away: GameScoreTeam;
    hammerFirstEnd: number;
}

interface EndScore {
    home: number;
    away: number;
}

interface GameScore {
    [key: number]: EndScore;
}

const props = defineProps<{
    game: GameScoreInfo;
    endCount: number;
    score: GameScore;
    selected: number
}>();

const ends = computed(() => Array.from({length: props.endCount}, (_, i) => i + 1));

const emit = defineEmits(['select'])

const homeTotal = computed(() =>
   ends.value.reduce((acc, current) => {
        return (acc += props.score[current].home);
    }, 0)
);
const awayTotal = computed(() =>
    ends.value.reduce((acc, current) => {
        return (acc += props.score[current].away);
    }, 0)
);
</script>
