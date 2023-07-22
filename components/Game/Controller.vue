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
        class="column justify-center no-wrap"
        ref="ringsElement"
    >
        <div class="player__header--wrap">
            <div
                class="score-input__wrap"
                :class="showScoreInput ? 'showScore' : 'hideScore'"
            >
                <InputScore />
            </div>
            <div
                class="player__header box-shadow--dark"
                :class="`${currentColor}--background`"
                ref="headerEl"
            >
                <div class="row items-center justify-between">
                    <div class="row justify-end">
                        <q-btn
                            flat
                            round
                            icon="chevron_left"
                            color="white"
                            @click="goPrev(false)"
                        />
                    </div>
                    <div class="column items-center justify-center">
                        <div class="header">End 1</div>
                        <div class="text-white footer">Dawn Askin's 1st</div>
                        <!-- {{ footerText }} -->
                    </div>
                    <div class="row justify-end">
                        <q-btn
                            flat
                            round
                            icon="chevron_right"
                            color="white"
                            @click="goNext(false)"
                        />
                    </div>
                </div>
                <div class="row justify-center" ><q-icon name="drag_handle" color="white" size="sm" @click="showScoreInput = !showScoreInput"/></div>
                <!-- Buttoms -->
                <!-- <div class="row justify-end col-grow">
                    <q-btn flat round icon="expand_more" color="white" @click="showScoreInput = !showScoreInput"/>
                </div> -->
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
     <DialogConfirmation v-if="!!confirmUnsaved" confirmButtonText="Save" :cancelButtonText="'Discard'" @close="onDiscardChanges" @confirm="confirmUnsaved">
    Save changes? 
  </DialogConfirmation>
  <DialogNavigation v-model="dialogNavigationOpen" @go="goToCustomShot" @cancel="dialogNavigationOpen = false"/>
</template>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap");
.player__header--wrap {
    border-radius: 32px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    height: 90px;
    z-index: 2;
    position: relative;
    width: 100%;
    .player__header {
        position: absolute;
        padding: 6px 16px;
        width: inherit;
        border-radius: inherit;
        height: 90px;

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
        overflow: hidden;
        height: 100%;
    }
}

.score__container {
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
        height: calc(100vh - 140px);
    }
}
@keyframes hideScore {
    0% {
        height: calc(100vh - 140px);
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
import { useElementSize, useResizeObserver, useSwipe } from "@vueuse/core";
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

const showScoreInput = ref(false);
const scoreContainerHeight = `calc(100vh - 130px)`;
const store = useSessionStore()!;
const save = async () => {
    await store.saveShot(editedShot.value);
};

const currentColor = computed(() => store.getShotColor(store.shot));

const { capitalizeFirstLetter, formatNumberWithSuffix } = useFormat();
const footerText = computed(
    () => `${formatNumberWithSuffix(Math.round(store.shot / 2))} shot`
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
const onDiscardChanges = ref<null | Function>(null);
const goNext = async (force = false) => {
    if (unsavedChanges.value && !force) {
        confirmUnsaved.value = async () => {
            await save();
            goNext(true);
        }
        onDiscardChanges.value = () => goNext(true)
        return;
    }
    confirmUnsaved.value = null;
    nextShot();
};
const goPrev = async (force = false) => {
    if (unsavedChanges.value && !force) {
        confirmUnsaved.value = () => async () => {
            await save();
            goPrev(true);
        }
        onDiscardChanges.value = () => goPrev(true)
        return;
    }
    confirmUnsaved.value = null;
    prevShot();
};

const headerEl = ref(null);
const { direction } = useSwipe(headerEl, {
    onSwipe: () => {
        if (direction.value === 'down') {
              showScoreInput.value = true;
        } else if (direction.value === 'up') {
            showScoreInput.value = false;
        }
    },
});

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
