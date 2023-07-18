<template>
  <div class="column" style="position: relative; height: 100%; width: 100%">
    <div class="row justify-between" :style="`width: ${width}px; margin: auto`">
      <q-btn @click="addNewRock" flat round  size="xs"
        ><q-icon name="add_circle_outline" color="primary" size="md"
      /></q-btn>
                <slot name="buttons" />
             
      <q-btn @click="addOop" flat round  size="xs"
        ><q-icon name="add_circle_outline" color="negative" size="md"
      /></q-btn>
  
    </div>
    <div style="position: relative; overflow:hidden" class="col-grow">
      
      <GameRings v-slot="{scale}">
 
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
    <div class="column" :style="`width: ${width}px; margin: auto`">
      <div style="height:15px">
        <RockDraggable/>
      </div>
      <div class="row justify-between" >
      <q-btn @click="carryOverShots" flat round  size="xs" :disabled="editedShot && editedShot.shot_no === 1"
        ><q-icon name="next_plan" color="primary" size="md"
      /></q-btn>
        <q-btn @click="save" flat round  size="xs"
        ><q-icon name="save" color="primary" size="md"
      /></q-btn>
    </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, inject, ref} from "vue";
import {useMounted, useElementSize} from "@vueuse/core";
import type RockPosition from '@/types/rockPosition'

import {useSessionStore} from "@/store/session";

const onDrag = () => {
  console.log('DRAG')
}
const store = useSessionStore()!;

const isMounted = useMounted();

const editedShot = inject<Ref>('editedShot')!;

const save = () => {
  store.saveShot(editedShot.value)
}

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
  const previousShot = store.getShotByNumberAndEnd(editedShot.value.shot_no - 1, editedShot.value.end_id);
  const {rock_positions} = previousShot || {rock_positions: {}}
  editedShot.value.rock_positions = {};
  nextTick(() => {
  editedShot.value.rock_positions = rock_positions
  });

}


const rocksInPlay = computed(() => {
  if (!isMounted.value) return [];
  return rockPositions.value.filter((s: RockPosition) => !s.removed);
});

const outOfPlayRocks = computed(() => {
  return rockPositions.value.filter((s: RockPosition) => !!s.removed);
});

const pendingRocks = computed(() => {
  const {shot_no} = editedShot.value;
  const pending:number[] = [];
  if (!shot_no) return pending;
  for (let x = 1; x <= shot_no; x++) {
    const rock = rockPositions.value.find((r) => r.shot_no === x);
    if (!rock) pending.push(x);
  }
  if (editedShot.value) return pending;
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
  upsertRock({...rock, removed: true});
};

// ADD Rocks

const addRock = (rock: RockPosition) => {
  // TODO: Error if editedShot has no shot number
  if (!editedShot.value?.shot_no || rocksInPlay.value.length >= editedShot.value.shot_no) return;
  upsertRock(rock);
};

const addNewRock = () => {
  const [nextPending] = pendingRocks.value ?? [];
  if (!nextPending) return;
  const color = store.getShotColor && store.getShotColor(nextPending);
  if (!color) return;
  // TODO: Error if no color
  const newRock = {x: 50, y: 50, shot_no: nextPending || 1, color};
  addRock(newRock);
};
const addOop = () => {
  const newRock = outOfPlayRocks.value[0];
  addRock({...newRock, removed: false, x: 0, y: 0});
};

// Delete overlay

const deleteOverlay = ref(false);
const onOutsideBounds = (bool:boolean) => {
  deleteOverlay.value = bool;
};

const curlingRockWrapper = ref(null)
const {width} = useElementSize(curlingRockWrapper)
</script>
