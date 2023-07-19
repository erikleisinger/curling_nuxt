<template>
  <div class="column" style="position: relative; height: 100%; width: 100%">
    <div
      class="row justify-between q-px-xl q-pt-xs"
      :style="`width: 100%; margin: auto; z-index:3`"
    >
      <q-btn
        @click="carryOverShots"
        round
        size="md"
        color="primary"
        :disabled="editedShot && editedShot.shot_no === 1"
        ><q-icon name="next_plan" color="white" size="sm"
      /></q-btn>
      <slot name="buttons" />
      <q-btn @click="save" round size="md" color="primary"
        ><q-icon name="save" color="white" size="sm"
      /></q-btn>
    </div>
    <div style="position: relative" class="col-grow">
      <GameRings :scale="scale" :setScale="setScale">
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
        />
      </GameRings>
    </div>
    <div
      class="column"
      :style="`width: calc(100vw - 96px); z-index:1; margin:auto`"
    >
      <div class="row justify-between q-py-sm no-wrap" style="width: 100%">
        <div
          style="
            position: relative;
            border-top-left-radius: 5px;
            border-color: rgb(150, 150, 150);
            border-style: solid;
            border-width: 1px 0px 0px 1px;
            width:50%;
            max-width: 250px;
          "
          class="row pending-rock-container home no-wrap"
          :class="homeColor"
        >
            <div
              style="
                width: 10px;
                height: 100%;
                border-top-left-radius: 5px;
                
              "
              :style="{backgroundColor: homeColor}"
              class="col-grow"
            ></div>
          <div class="column" style="width:100%">
            <div
              class="text-italic q-pr-sm"
              :style="{backgroundColor: homeColor}"
              style="
                min-width: 0px;
                width: 100%;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              "
            >
              {{ homeTeamName }}
            </div>
            <div
              class="row q-pa-xs q-mr-xs"
              style="max-height: 38px; max-width: 70px"
            >
              <transition-group
                appear
                enter-active-class="slideInLeft"
                leave-active-class="slideOutRight"
              >
                <div
                  v-for="rock in pendingHome"
                  :key="rock.shot_no"
                  style="width: 15px; transition: all 0.3s"
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
                  />
                </div>
              </transition-group>
            </div>
          </div>
                  
        </div>

        <div
          style="
            position: relative;

            border-top-right-radius: 5px;
            border-color: rgb(150, 150, 150);
            border-style: solid;
            border-width: 1px 1px 0px 0px;
            width:50%;
            max-width:250px;
          "
          class="row pending-rock-container away no-wrap justify-between"
          :class="awayColor"
        >
          <div class="column items-end" style="width:calc(100% - 10px)">
            <div
              class="text-right text-italic q-pl-sm"
              :style="{backgroundColor: awayColor}"
              style="
                white-space: nowrap;
                overflow: hidden;
                min-width: 0px;
                width:100%;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              "
            >
              {{ awayTeamName }}
            </div>
            <div class="row q-pa-xs" style="max-height: 38px; max-width: 75px">
              <transition-group
                appear
                enter-active-class="slideInLeft"
                leave-active-class="slideOutRight"
              >
                <div
                  style="width: 15px; transition: all 0.3s"
                  @vue:beforeUnmount="beforeUnmount"
                  v-for="rock in pendingAway"
                  :key="rock.shot_no"
                >
                  <RockDraggable
                    @dragUp="endDrag(rock.shot_no, rock.color)"
                    :color="rock.color"
                    :disabled="rock.shot_no > editedShot.shot_no"
                    @dragging="setDragging(rock.shot_no)"
                    @select="selectRock(rock.shot_no)"
                    :selected="selected === rock.shot_no"
                    @deselect="selected = null"
                  />
                </div>
              </transition-group>
            </div>
          </div>
            <div
            style="
              width: 10px;
              height: 100%;
              border-top-right-radius: 5px;
  
            "
            :style="{backgroundColor: awayColor}"
            class="col-grow"
          ></div>
        
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, inject, ref} from "vue";
import {useMounted, useElementSize} from "@vueuse/core";
import type RockPosition from "@/types/rockPosition";
import {ROCK_DIAMETER_PERCENT} from "@/constants/dimensions";
import {VNode} from "vue/types";

import {useSessionStore} from "@/store/session";

const beforeUnmount = async (e: VNode) => {
  e.el.style.width = 0;
};
const scale = ref(1);
function setScale(s: number) {
  scale.value = s;
}
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
      (pos / (element.offsetWidth * scale.value)) * 100 - ROCK_DIAMETER_PERCENT
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
      (pos / (element.offsetHeight * scale.value)) * 100 - ROCK_DIAMETER_PERCENT
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

  const {isOutside} = mouse;
  if (isOutside) return;
  const {elementX, elementY} = mouse;
  const target: HTMLElement | null = document.querySelector(
    "#curlingRockWrapper"
  );
  const positionX = getPercentWidth(elementX, target);
  const positionY = getPercentHeight(elementY, target);

  const newRock = {x: positionX, y: positionY, shot_no, color};
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

const carryOverShots = () => {
  if (!editedShot.value.shot_no || editedShot.value.shot_no === 1) return;
  const previousShot = store.getShotByNumberAndEnd(
    editedShot.value.shot_no - 1,
    editedShot.value.end_id
  );
  const {rock_positions} = previousShot || {rock_positions: {}};
  editedShot.value.rock_positions = {};
  nextTick(() => {
    editedShot.value.rock_positions = rock_positions;
  });
};

const rocksInPlay = computed(() => {
  if (!isMounted.value) return [];
  return rockPositions.value.filter((s: RockPosition) => !s.removed);
});

const outOfPlayRocks = computed(() => {
  return rockPositions.value.filter((s: RockPosition) => !!s.removed);
});

const pendingRocks = computed(() => {
  const {shot_no} = editedShot.value;
  const pending: RockPosition[] = [];
  if (!shot_no) return pending;
  for (let x = 1; x <= 16; x++) {
    const rock = rockPositions.value.find((r) => r.shot_no === x);
    if (!rock)
      pending.push({shot_no: x, x: 0, y: 0, color: store.getShotColor(x)});
  }
  if (editedShot.value) return pending;
  return [];
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
  return pendingRocks.value.filter(
    ({color}) => sessionStore.game?.home_color === color
  );
});
const pendingAway = computed(() => {
  return pendingRocks.value.filter(
    ({color}) => sessionStore.game?.away_color === color
  );
});

// MODIFY Rocks

// Will replace or insert a rock in editedShot.rock_positions
// Checks for existing rock based on rock.shot_no
const upsertRock = (rock: RockPosition) => {
  const {shot_no} = rock;
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
  upsertRock({...e, shot_no});
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
};

// ADD Rocks

const addRock = (rock: RockPosition) => {
  // TODO: Error if editedShot has no shot number
  if (
    !editedShot.value?.shot_no ||
    rocksInPlay.value.length >= editedShot.value.shot_no
  )
    return;
  upsertRock(rock);
};

// Delete overlay

const deleteOverlay = ref(false);
const onOutsideBounds = (bool: boolean) => {
  deleteOverlay.value = bool;
};

const curlingRockWrapper = ref(null);
const {width} = useElementSize(curlingRockWrapper);
</script>
