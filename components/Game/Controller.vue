<template>
    <!-- <KeepAlive> -->
    <!-- <transition-group
            appear
            :enter-active-class="`animated ${
                tab === 'rings' ? 'slideInLeft' : 'slideInRight'
            }`"
            :leave-active-class="`animated ${
                tab === 'rings' ? 'slideOutRight' : 'slideOutLeft'
            }`"
        > -->
    <section
        v-if="$q.screen.gt.sm || tab === 'rings'"
        id="rings"
        key="rings"
        class="column justify-cente no-wrap"
    >
        <div class="player__header--wrap">
            <div class="score-input__wrap" :class="showScoreInput ? 'showScore' : 'hideScore'" >
                <InputScore/>
            </div>
            <div
                class="player__header  row items-center box-shadow--dark" :class="`${currentColor}--background`"
             
            >
                <div
                    class="column items-start justify-start"
                    style="margin-left: 16px"
                >
                    <div class="header">End {{ store.end }}</div>
                    <div class="text-white footer">{{ footerText }}</div>
                </div>
                <!-- Buttoms -->
                <div class="row justify-end col-grow">
                    <q-btn flat round icon="expand_more" color="white" @click="showScoreInput = !showScoreInput"/>
                    <!-- <q-btn
                            @click="carryOverShots"
                            round
                            size="lg"
                          flat
                            color="white"
                            :disabled="editedShot && editedShot.shot_no === 1"
                            icon="next_plan"
                            ></q-btn>
                        <q-btn
                            @click="toggleShowNumbers"
                            round
                             size="lg"
                            flat
                            :color="showNumbers ? 'primary' : 'white'"
                            icon="123"
                            ></q-btn>
                        <slot name="buttons" />
                        <q-btn @click="save" round size="lg"  flat color="white" icon="save"
                            ></q-btn> -->
                </div>
            </div>
        </div>
        <GameScoreboard
            ref="scoreBoard"
            :class="showScoreBoard ? 'show' : 'hide'"
            v-if="$q.screen.lt.md"
            :style="{ zIndex: showScoreBoard ? 1 : 0 }"
        />

        <div
            :style="`position:relative; width: 100%;  `"
            class="col-grow curling-rings__wrap"
        >
            <RockController>
                <template v-slot:buttons>
                    <q-btn
                        size="md"
                        round
                        @click="showScoreBoard = !showScoreBoard"
                        v-if="$q.screen.lt.md"
                        color="white"
                        ><q-icon name="o_scoreboard" size="sm" color="primary"
                    /></q-btn>
                </template>
            </RockController>
        </div>
    </section>
    <!-- <section
                v-if="$q.screen.gt.sm || tab === 'score'"
                id="scorecard"
                key="scorecard"
                class="col-grow"
            >
                <GameScoreboard v-if="$q.screen.gt.sm" />
                <InputScore />
            </section> -->
    <!-- </transition-group>
    </KeepAlive> -->
</template>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap");
.player__header--wrap {
    border-radius: 32px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    height: 80px;
    z-index: 2;
    position: relative;
    width: 100%;
    .player__header {
        position: absolute;
        padding: 6px 16px;
        width: inherit;
        border-radius: inherit;
        height: 80px;

        .rock--animated {
            animation: rotation 7s infinite linear;
            height: 3em;
        }
        .header {
            font-family: "Montserrat", sans-serif;
            font-weight: bold;
            color: white;

            font-size: 2em;
        }
        .footer {
            font-family: "Hind", sans-serif;
        }
        :after {
        }
    }
    .score-input__wrap {
        background-color:rgba(255,255,255,0.8);
        overflow:hidden;
    }
}

.score__container {
    height: 60px;
    width: 100%;
    background-color: white;
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
}
#rings {
    overscroll-behavior-y: v-bind("overscroll");
}
.show {
    height: 81px;
    animation: show 0.5s;
}
.hide {
    height: 0px;
    animation: hide 0.5s;
    overflow: hidden;
}



@keyframes show {
    0% {
        height: 0px;
    }
    100% {
        height: 81px;
    }
}
@keyframes hide {
    0% {
        height: 81px;
    }
    100% {
        height: 0px;
    }
}

.showScore {

    animation: showScore 0.3s forwards;
}

.hideScore {

    animation: hideScore 0.3s forwards;
}

@keyframes showScore {
    0% {
        height: 0px;
    }
    100% {
        height: calc(100vh - 130px);
    }
}
@keyframes hideScore {
    0% {
        height: calc(100vh - 130px);
    }
    100% {
        height: 0px;
    }
}

@keyframes rotation {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(359deg);
    }
}
</style>
<script setup lang="ts">
import { inject, ref } from "vue";
import { useElementSize, useResizeObserver } from "@vueuse/core";
import { useUserStore } from "@/store/user";
import { useSessionStore } from "@/store/session";
const $q = useQuasar();
const tab = inject("tab");
const overscroll = "contain";
const scoreBoard = ref(null);
const scoreBoardHeight = ref(useElementSize(scoreBoard).height);
const showScoreBoard = ref(false);
useResizeObserver(scoreBoard, (entries) => {
    const [entry] = entries;
    const { height } = entry.contentRect;
    scoreBoardHeight.value = height;
});

const userStore = useUserStore();

const { toggleShowNumbers } = userStore;

const editedShot = inject<Ref>("editedShot")!;

const showScoreInput = ref(false)
const scoreContainerHeight = `calc(100vh - 130px)`
const store = useSessionStore()!;
const save = () => {
    store.saveShot(editedShot.value);
};

const currentColor = computed(() => store.getShotColor(store.shot));

const { capitalizeFirstLetter, formatNumberWithSuffix } = useFormat();
const footerText = computed(
    () =>
        `${capitalizeFirstLetter(
            currentColor.value
        )}'s ${formatNumberWithSuffix(Math.round(store.shot / 2))}`
);

const shot = computed<number>(() => store.shot);
const end = computed<number>(() => store.end);

const { prevShot, nextShot, goToShot } = store;

const { globalLoading } = useLoading();

const { objTheSame } = useValidation();
const currentShot = computed(() => store.currentShot);
const unsavedChanges = computed(
    () => !objTheSame(editedShot.value, store.currentShot)
);

// Null if confirm dialog is not present
// When truthy, this ref is a function that will be executed on dialog @confirm event
// Either 'goNext' or 'goPrev'
const confirmUnsaved = ref<null | Function>(null);

const goNext = async (force = false) => {
    if (unsavedChanges.value && !force) {
        confirmUnsaved.value = () => goNext(true);
        return;
    }
    confirmUnsaved.value = null;
    nextShot();
};
const goPrev = async (force = false) => {
    if (unsavedChanges.value && !force) {
        confirmUnsaved.value = () => goPrev(true);
        return;
    }
    confirmUnsaved.value = null;
    prevShot();
};

// Manually go to shot/end
const dialogNavigationOpen = ref(false);

const goToCustomShot = (data: { shot: number; end: number }, force = false) => {
    dialogNavigationOpen.value = false;
    if (unsavedChanges.value && !force) {
        confirmUnsaved.value = () => goToCustomShot(data, true);
        return;
    }
    const { shot: shotNo, end: endNo } = data;
    goToShot(shotNo, endNo);
};
</script>
