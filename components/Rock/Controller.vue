<template>
    <div class="column" style="position: relative; height: 100%; width: 100%">
        <div
            style="
                position: absolute;
                top: 0;
                right: 0;
                z-index: 100;
                margin-top: 5%;
                margin-right: 2%;
            "
            class="column"
        >
            <q-btn
                @click="toggleShowNumbers"
                round
                :color="showNumbers ? 'primary' : 'white'"
                ><q-icon
                    name="123"
                    :color="showNumbers ? 'white' : 'primary'"
                    size="sm"
            /></q-btn>
             <q-btn
                @click="carryOverShots"
                round
                color="white"
                class="q-mt-sm"
                ><q-icon
                    name="redo"
                    color="primary"
                    size="sm"
            /></q-btn>
             <q-btn
                @click="resetShots"
                round
                color="white"
                class="q-mt-sm"
                ><q-icon
                    name="change_circle"
                    color="primary"
                    size="sm"
            /></q-btn>
            <slot name="buttons" />
        </div>
        <div style="position: relative" class="col-grow">
            <GameRings ref="rink">
                <div
                    style="
                        height: 100%;
                        width: 100%;
                        position: absolute;
                        overflow: hidden;
                        transition: all 0.5s;
                    "
                    id="curlingRockWrapper"
                    ref="curlingRockWrapper"
                >
                    <transition
                        appear
                        enter-active-class="animated fadeIn"
                        leave-active-class="animated fadeOut"
                    >
                        <div
                            style="
                                height: 100%;
                                width: 100%;
                                position: absolute;
                                background-color: rgba(0, 0, 0, 0.4);
                            "
                            v-if="deleteOverlay"
                            class="row justify-center items-center"
                        >
                            <q-icon size="xl" name="delete" color="white" />
                        </div>
                    </transition>
                </div>
                <div ref="rockInsert"></div>
                <Rock
                    v-for="rock in rocksInPlay"
                    :key="`rock-${rock.shot_no}-${editedShot.id}`"
                    :rock="rock"
                    @update="onRockPositionUpdated($event, rock.shot_no)"
                    @remove="onRemoveRock(rock)"
                    @outsideBounds="onOutsideBounds"
                    :scale="scale"
                    :showNumbers="showNumbers"
                />
            </GameRings>
        </div>
        <div
            class="row justify-between"
            :style="`z-index:1; margin:auto; position: absolute; bottom: 0; width: 100%`"
        >
            <div style="position: relative; height: 100%; width: 100%">
                <div
                    class="row q-ma-md"
                    :style="`width: ${rockContainerWidth}px; max-height: ${
                        rockContainerWidth / 2
                    }px; position: absolute; left: 0; bottom:0; transition: all 0.2s`"
                >
                    <transition-group
                        appear
                        enter-active-class="slideInLeft"
                        leave-active-class="slideOutRight"
                    >
                        <div
                            :style="`width: ${
                                rockContainerWidth / 4
                            }px; transition: all 0.2s`"
                            v-for="rock in pendingHome"
                            :key="rock.shot_no"
                            @vue:beforeUnmount="beforeUnmount"
                        >
                            <RockDraggable
                                @dragUp="endDrag(rock.shot_no, rock.color)"
                                :color="rock.color"
                                :disabled="rock.shot_no > editedShot.shot_no"
                                @dragging="setDragging(rock.shot_no)"
                                @select="selectRock(rock.shot_no)"
                                :selected="selected === rock.shot_no"
                                @deselect="selected = null"
                                :showNumbers="showNumbers"
                                :shotNo="Math.round(rock.shot_no / 2)"
                                :width="`${rockContainerWidth / 4}px`"
                            />
                        </div>
                    </transition-group>
                </div>
                <div
                    class="row q-ma-md reverse"
                    :style="`width: ${rockContainerWidth}px;  max-height: ${
                        rockContainerWidth / 2
                    }px; position: absolute; right: 0;bottom:0`"
                >
                    <transition-group
                        appear
                        enter-active-class="slideInLeft"
                        leave-active-class="slideOutRight"
                    >
                        <div
                            :style="`width: ${
                                rockContainerWidth / 4
                            }px; transition: all 0.2s`"
                            v-for="rock in pendingAway"
                            :key="rock.shot_no"
                            @vue:beforeUnmount="beforeUnmount"
                        >
                            <RockDraggable
                                @dragUp="endDrag(rock.shot_no, rock.color)"
                                :width="`${rockContainerWidth / 4}px`"
                                :color="rock.color"
                                :disabled="rock.shot_no > editedShot.shot_no"
                                @dragging="setDragging(rock.shot_no)"
                                @select="selectRock(rock.shot_no)"
                                :selected="selected === rock.shot_no"
                                @deselect="selected = null"
                                :showNumbers="showNumbers"
                                :shotNo="Math.round(rock.shot_no / 2)"
                                @vue:beforeUnmount="beforeUnmount"
                            />
                        </div>
                    </transition-group>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, inject, ref } from "vue";
import {
    useMounted,
    useElementSize,
    useDebounceFn,
    whenever,
} from "@vueuse/core";
import type RockPosition from "@/types/rockPosition";
import { ROCK_DIAMETER_PERCENT } from "@/constants/dimensions";
import { VNode } from "vue/types";
import PinchZoom from "pinch-zoom-js";
import { useSessionStore } from "@/store/session";
import { useUserStore } from "@/store/user";
import { useEventStore } from "@/store/event";

const userStore = useUserStore();

const { toggleShowNumbers } = userStore;

const showNumbers = computed(() => userStore.showNumbers);

const beforeUnmount = async (e: VNode) => {
    e.el.style.width = 0;
};
const scale = ref(1);
function setScale(s: number) {
    scale.value = s;
}

/**
 * ZOOM IN / OUT
 */

const onEnd = (e: PinchZoom) => {
    const { zoomFactor } = e;
    setScale(zoomFactor);
};
let pinch: PinchZoom;
onMounted(() => {
    const rink = document.querySelector("#rink") as HTMLElement;
    pinch = new PinchZoom(rink, {
        onZoomUpdate: useDebounceFn(onEnd),
        maxZoom: 6,
    });
});

const eventStore = useEventStore();
const selectedRock = computed(() => eventStore.rockSelected);

watch(selectedRock, (v) => {
    if (!!v) {
        pinch.disable();
    } else {
        pinch.enable();
    }
});

/**
 * END ZOOM IN / ZOOM OUT
 */

const rockInsert = ref(null);

const mouse = reactive(useMouseInElement(useParentElement(rockInsert)));
// Utility functions
const getPercentWidth = (pos: number, element: HTMLElement | null) => {
    try {
        if (!element)
            throw new Error(
                "Error calculating rock percent width: argument `element` is not an element"
            );
        return (
            (pos / (element.offsetWidth * scale.value)) * 100 -
            ROCK_DIAMETER_PERCENT
        );
    } catch {
        return 0;
    }
};
const getPercentHeight = (pos: number, element: HTMLElement | null) => {
    try {
        if (!element)
            throw new Error(
                "Error calculating rock percent height: argument `element` is not an element"
            );
        return (
            (pos / (element.offsetHeight * scale.value)) * 100 -
            ROCK_DIAMETER_PERCENT
        );
    } catch {
        return 0;
    }
};
const selected = ref(0);
const selectRock = (shot_no: number) => {
    nextTick(() => {
        selected.value = shot_no;
    });
};
const dragging = ref(0);
const setDragging = (shot_no: number) => {
    dragging.value = shot_no;
};
const endDrag = (shot_no: number, color: string) => {
    if (dragging.value !== shot_no) return;

    const { isOutside } = mouse;
    if (isOutside) return;
    const { elementX, elementY } = mouse;
    const target: HTMLElement | null = document.querySelector(
        "#curlingRockWrapper"
    );
    const positionX = getPercentWidth(elementX, target);
    const positionY = getPercentHeight(elementY, target);

    const newRock = { x: positionX, y: positionY, shot_no, color };
    addRock(newRock);
};

const store = useSessionStore()!;

const isMounted = useMounted();

const editedShot = inject<Ref>("editedShot")!;

const save = () => {
    store.saveShot(editedShot.value);
};

// Rock positions

// Raw value of rock_positions, converted from JSON --> Array
const rockPositions = computed<RockPosition[]>(() => {
    try {
        return JSON.parse(`${editedShot?.value?.rock_positions}`)?.rocks ?? [];
    } catch {
        return [];
    }
});
const rocksInPlay = computed(() => {
    if (!isMounted.value) return [];
    return rockPositions.value.filter((s: RockPosition) => !s.removed);
});

const carryOverShots = () => {
    if (!editedShot.value.shot_no || editedShot.value.shot_no === 1) return;
    const previousShot = store.getShotByNumberAndEnd(
        editedShot.value.shot_no - 1,
        editedShot.value.end_id
    );
    const { rock_positions } = previousShot || { rock_positions: {} };
    editedShot.value.rock_positions = {};
    nextTick(() => {
        editedShot.value.rock_positions = rock_positions;
        calcInitialPending();
    });
};

const resetShots = () => {
    editedShot.value.rock_positions = {};
    calcInitialPending();
}

const calcInitialPending = () => {
    const pending: RockPosition[] = [];
    for (let x = 1; x <= 16; x++) {
        const rock = rockPositions.value.find((r) => r.shot_no === x);
        if (!rock)
            pending.push({
                shot_no: x,
                x: 0,
                y: 0,
                color: store.getShotColor(x),
            });
    }

    if (editedShot.value) pendingRocks.value = pending;
    
};

const pendingRocks = ref<RockPosition[]>([]);

onBeforeMount(() => {
    calcInitialPending();
});

const sessionStore = useSessionStore();
const homeColor = computed(() => sessionStore.game?.home_color);
const awayColor = computed(() => sessionStore.game?.away_color);
const homeTeamName = computed(
    () => sessionStore.game?.home?.name || "Unnamed team"
);
const awayTeamName = computed(
    () => sessionStore.game?.away?.name || "Unnamed team"
);
const pendingHome = computed(() => {
    return pendingRocks.value
        .filter(({ color }) => sessionStore.game?.home_color === color)
        .sort((a, b) => a.shot_no - b.shot_no);
});
const pendingAway = computed(() => {
    return pendingRocks.value
        .filter(({ color }) => sessionStore.game?.away_color === color)
        .sort((a, b) => a.shot_no - b.shot_no);
});

// MODIFY Rocks

// Will replace or insert a rock in editedShot.rock_positions
// Checks for existing rock based on rock.shot_no
const upsertRock = (rock: RockPosition) => {
    const { shot_no } = rock;
    const newRockPositions = [...rockPositions.value];
    const index = newRockPositions.findIndex((r) => r.shot_no === shot_no);
    if (index === -1) {
        newRockPositions.push(rock);
    } else {
        newRockPositions.splice(index, 1, rock);
    }
    editedShot.value.rock_positions = JSON.stringify({
        rocks: newRockPositions,
    });
};
const onRockPositionUpdated = (e: RockPosition, shot_no: number) => {
    upsertRock({ ...e, shot_no });
};

const onRemoveRock = (rock: RockPosition) => {
    deleteOverlay.value = false;
    const newRockPositions = [...rockPositions.value];
    const index = newRockPositions.findIndex((r) => r.shot_no === rock.shot_no);
    if (index !== -1) {
        newRockPositions.splice(index, 1);
        editedShot.value.rock_positions = JSON.stringify({
            rocks: newRockPositions,
        });
    }
    pendingRocks.value.splice(Math.round(rock.shot_no / 2) - 1, 0, rock);
};

// ADD Rocks

const addRock = (rock: RockPosition) => {
    // TODO: Error if editedShot has no shot number
    const newPending = [...pendingRocks.value];
    const index = newPending.findIndex(
        ({ shot_no }) => rock.shot_no === shot_no
    );
    if (index !== -1) {
        newPending.splice(index, 1);
        pendingRocks.value = newPending;
    }
    upsertRock(rock);
};

// Delete overlay

const deleteOverlay = ref(false);
const onOutsideBounds = (bool: boolean) => {
    deleteOverlay.value = bool;
};

const curlingRockWrapper = ref(null);
const { width } = useElementSize(curlingRockWrapper);

const rockContainerWidth = computed(() => width.value / 3);

const shotNo = computed(() => editedShot.value.shot_no);
const loadingDone = computed(() => !store.loading);
watch(
    shotNo,
    () => {
        whenever(loadingDone, () => {
            calcInitialPending();
        });
    },
    { flush: "post" }
);
</script>
