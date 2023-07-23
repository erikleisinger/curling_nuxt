<template>
    <section
        v-if="$q.screen.gt.sm || tab === 'rings'"
        id="rings"
        key="rings"
        class="column justify-center no-wrap pattern-diagonal-stripes-sm slategray "
        style="background-color:rgba(246, 247, 252, 0.1);color:rgba(246, 247, 252, 1);height: 100%"
        ref="ringsElement"

    >
        <transition appear enter-active-class="animated slideInLeft" leave-active-class="animated slideOutLeft">
    <div class="nav__drawer--wrap" v-if="showLeftDrawer" ref="nav">
        <q-list style="margin-top: 62px">
            <q-item clickable to="/select">
                <q-item-section>
                    <q-item-label>Go back to selection</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </div>
        </transition>

     

        <GameScoreboard
            ref="scoreBoard"
            :class="showScoreBoard ? 'show' : 'hide'"
            v-if="$q.screen.lt.md"
            :style="{ zIndex: showScoreBoard ? 1 : 0, animationDuration: initialized ? '0.3s' : '0s'}"
        />

        <div
            :style="`position:relative; width: 100%; margin-bottom: 100px`"
            class="col-grow curling-rings__wrap"
        >
           <div class="menu__floating" v-show="!showScoreInput">
            <q-btn flat round icon="menu" color="black" size="lg" @click="showLeftDrawer = !showLeftDrawer"/>
            </div>
            <RockController>
                <template v-slot:buttons>
                    <q-btn
                        size="md"
                        round
                        @click="showScoreBoard = !showScoreBoard"
                        v-if="$q.screen.lt.md"
                        color="white"
                        class="q-mt-sm"
                        ><q-icon name="o_scoreboard" size="sm" color="primary"
                    /></q-btn>
                </template>
            </RockController>
        </div>
        <div
            class="score-input__wrap"
            style="
                max-height: 100%;
                overflow: hidden;
                transition: all 0.2s;
                z-index: 150;
            "
            :class="showScoreInput ? 'showScore' : 'hideScore'"
        >
            <div
                class="player__header box-shadow--dark column"
                :class="{
                    [`${currentColor}--background`]: true,
                    showing: showScoreInput,
                }"
                ref="headerEl"
            >
                <div
                    class="row justify-center"
                    style="margin-bottom: -4px"
                    :style="{ order: showScoreInput ? '2' : '0' }"
                >
                    <q-icon
                        name="drag_handle"
                        color="white"
                        size="sm"
                        @click="showScoreInput = !showScoreInput"
                    />
                </div>
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
                        <div class="header">End {{ end }}</div>
                        <div class="text-white footer">{{ footerText }}</div>
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
            </div>
            <div
                :style="{
                    maxHeight: showScoreInput ? 'calc(100% - 100px)' : '0px',
                    height: showScoreInput ? '100%' : '0px',
                }"
                style="transition: all 0.2s; overflow: auto"
            >
                <InputScore />
            </div>
        </div>
    </section>
    <DialogConfirmation
        v-if="!!confirmUnsaved"
        confirmButtonText="Save"
        :cancelButtonText="'Discard'"
        @close="onDiscardChanges"
        @confirm="confirmUnsaved"
    >
        Save changes?
    </DialogConfirmation>
    <DialogNavigation
        v-model="dialogNavigationOpen"
        @go="goToCustomShot"
        @cancel="dialogNavigationOpen = false"
    />
</template>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap");

.menu__floating {
    position: absolute;
    top: 0;
    left: 0;
    margin: 8px;
    z-index: 250
}
.nav__drawer--wrap {
    width: 300px;
    height: 100%;
    position: absolute;
    z-index: 200;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0,0.6);
    .q-list {
        margin-top: 64px;
        .q-item {
           color:white;
            border: 1px solid rgba(0,0,0,0.2);
            border-left-width: 0px;
            border-right-width: 0px;
        }
    }
}
.player__header {
    position: relative;
    bottom: 0;
    padding: 8px 16px;
    width: inherit;
    border-radius: inherit;
    height: 100px;
    top: 0px;
    z-index: 10;
    width: 100%;
    transition: all 0.3s;

    // &.showing {
    //     border-bottom-left-radius: 32px;
    //     border-bottom-right-radius: 32px;
    // }
    &:not(.showing) {
        border-top-left-radius: 32px;
        border-top-right-radius: 32px;
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
    height: 0px;
    position: absolute;
    z-index: 5;
    bottom: 0;
}

#rings {
    overscroll-behavior-y: v-bind("overscroll");
}
.show {
    animation: show 0.5s forwards;
}
.hide {
    animation: hide 0.5s forwards;
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
    height: 100%;
    animation: showScore 0.3s forwards;
}

.hideScore {
    height: 100px;
    animation: hideScore 0.3s forwards;
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
import { useElementSize, useResizeObserver, useSwipe, onClickOutside } from "@vueuse/core";
import { useUserStore } from "@/store/user";
import { useSessionStore } from "@/store/session";
import { usePlayerStore } from "@/store/players";
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

const leftDrawerOpen = ref(true)
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
    () =>
        `${currentThrowerName.value}'s ${formatNumberWithSuffix(
            Math.round(store.shot / 2)
        )}`
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
        };
        onDiscardChanges.value = () => goNext(true);
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
        };
        onDiscardChanges.value = () => goPrev(true);
        return;
    }
    confirmUnsaved.value = null;
    prevShot();
};

const headerEl = ref(null);
const { direction } = useSwipe(headerEl, {
    onSwipe: () => {
        if (direction.value === "up") {
            showScoreInput.value = true;
        } else if (direction.value === "down") {
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

const currentThrower = computed(() => store.getCurrentThrower);
const playerStore = usePlayerStore();
const currentThrowerName = computed(
    () =>
        playerStore.players.find((p) => p.id === currentThrower.value)?.name ??
        "Unnamed player"
);

const showLeftDrawer = ref(false)
const nav = ref(null);
onClickOutside(nav, () => showLeftDrawer.value = false)

const initialized = ref(false)
onMounted(() => {
    initialized.value = true;
})
</script>
