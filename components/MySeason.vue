<template>
    <div class="full-height full-width container purple__background--small">
        <h1 class="q-pa-sm text-lg text-bold text-italic">My season</h1>
        <div class="row justify-center">
            <q-btn-toggle
                style=""
                v-model="model"
                class="page__select"
                no-caps
                rounded
                unelevated
                toggle-color="deep-purple"
                color="white"
                text-color="deep-purple"
                spread
                :options="[
                    { label: '', value: 'stats', slot: 'stats' },
                    { label: 'Schedule', value: 'games', slot: 'games' },
                ]"
            >
                <template v-slot:stats> Summary </template>
            </q-btn-toggle>
        </div>
        <div v-show="model === 'stats'" style="height: fit-content">
            <div ref="statsController">
                <!-- <transition-group appear enter-active-class="slideInLeft" leave-active-class="slideOutRight"> -->
                <StatsContainer v-if="view === 'gameResults'" key="gameResults">
                    <template v-slot:title>
                        <div class="row justify-between items-center q-mx-md">
                            <q-btn
                                flat
                                round
                                icon="chevron_left"
                                dark
                                @click="goToView(-1)"
                            />
                            <div>Game Results</div>
                            <q-btn
                                flat
                                round
                                icon="chevron_right"
                                dark
                                @click="goToView(+1)"
                            />
                        </div>
                    </template>
                    <ChartWinLossTie style="max-height: 250px" />
                </StatsContainer>
                <StatsContainer v-if="view === 'overtime'" key="overtime">
                    <template v-slot:title>
                        <div class="row justify-between items-center q-mx-md">
                            <q-btn
                                flat
                                round
                                icon="chevron_left"
                                dark
                                @click="goToView(-1)"
                            />
                            <div>History</div>
                            <q-btn
                                flat
                                round
                                icon="chevron_right"
                                dark
                                @click="goToView(+1)"
                            />
                        </div>
                    </template>
                    <ChartWinLossTie />
                </StatsContainer>
                <StatsContainer>
                    <ChartEitherOr/>
                       <ChartEitherOr :datasets="datasets"/>
                </StatsContainer>

                <!-- </transition-group> -->
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
:deep(.page__select) {
    width: 100%;
    max-width: 50vw;
    border: 1px solid $deep-purple;
}
.container {
    background-color: purple;
    min-height: inherit;
    overflow: auto;
    max-height: calc((100 * var(--1vh, 1vh) - 50px));
}
:deep(.slider) {
    .q-slider__selection {
        z-index: 3;
        background-color: rgba(55, 144, 233, 0.6);
    }
    .q-slider__track {
        border-radius: 16px;
        background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.4) 10px,
            rgba(255, 255, 255, 0.4) calc(2 * 10px)
        ) !important;

        &:after {
            content: "";
            position: absolute;
            height: 100%;
            width: 100%;
            background-color: rgba(240, 98, 146, 0.8);
            z-index: 0;
            border-radius: inherit;
        }
    }
}
</style>
<script setup>
import { useSwipe } from "@vueuse/core";
import Chart from "chart.js/auto";
const model = ref("stats");

const view = ref("gameResults");

const VIEWS = ["gameResults", "overtime"];

const statsController = ref(null);

const datasets = [              {
                    label: "Avg stolen ends",
                    backgroundColor: "#f06292",
                    barThickness: 15,
                    data: [50],
                },
                {
                    label: "Avg steals conceded",
                    backgroundColor: "#4db6ac",
                       barThickness: 15,
                    data: [100],
                }]

const sliderModel = ref(6);
const goToView = (inc) => {
    const currentView = VIEWS.findIndex((v) => v === view.value);
    if (currentView === -1) return;
    if (currentView + inc < 0) return;
    if (currentView + inc > VIEWS.length - 1) return;
    view.value = VIEWS[currentView + inc];
};
const { direction } = useSwipe(statsController, {
    onSwipe: () => {
        if (direction.value === "right") {
            goToView(-1);
        } else if (direction.value === "left") {
            goToView(+1);
        }
    },
});
</script>
