<template>
  <CurlingRings>
    <div style="height: 100%; width: 100%; position: absolute; overflow: hidden"  id="curlingRockWrapper" >
       <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
      <div style="height: 100%; width: 100%; position:absolute; background-color:rgba(0,0,0,0.4);" v-if="deleteOverlay" class="row justify-center items-center">
        <q-icon size="xl" name="delete" color="white"/>
      </div>
       </transition>
      <button @click="addNewRock">Add</button>
      <button @click="addOop">Add OOP</button>
      <div>OOP: {{outOfPlayRocks.length}}</div>
      <div>P: {{pendingRocks.length}}</div>
      <div>TOTAL: {{rockPositions.length}}</div>
      <CurlingRock v-for="rock in rocksInPlay" :key="`rock-${rock.shot_no}-${editedShot.id}`" :rock="rock" @update="onRockPositionUpdated($event, rock.shot_no)" @remove="onRemoveRock(rock)" @outsideBounds="onOutsideBounds"  />

    </div>

  </CurlingRings>
</template>

<script setup>
    import { computed, inject, ref} from 'vue';
import { routerKey } from 'vue-router';
import {useMounted} from '@vueuse/core'

  const editedShot = inject('editedShot');
  const deleteOverlay = ref(false)

  const isMounted = useMounted()

    const rockPositions = computed(() => {
      try {
        return JSON.parse(editedShot?.value?.rock_positions)?.rocks ?? [];
      } catch {
        return []
      }
      
    })

    const rocksInPlay = computed(() => {
      if (!isMounted.value) return [];
      return rockPositions.value.filter((s) => !s.removed)
    })

    const outOfPlayRocks = computed(() => {
      return rockPositions.value.filter((s) => !!s.removed)
    })

    const pendingRocks = computed(() => {
      const {shot_no} = editedShot.value;
      const pending = []
      for (let x = 1; x <= shot_no; x++) {
        const rock = rockPositions.value.find((r) => r.shot_no === x)
        console.log('rock: ', rock)
        if (!rock) pending.push(x)
      }
      return pending;
    })

    const addRock = (rock) => {
       if (rocksInPlay.value.length >= editedShot.value.shot_no) return;
       const newRockPositions = [
        ...rockPositions.value,
       ];
       const index = newRockPositions.findIndex((r) => r.shot_no === rock.shot_no)
       if (index === -1) {
        newRockPositions.push(rock)
       } else {
        newRockPositions.splice(index, 1, rock)
       }
       editedShot.value.rock_positions = JSON.stringify({
        rocks: newRockPositions
       });
    }


    const addNewRock = () => {
        const newRock = {x:0, y:0, shot_no: pendingRocks.value[0]};
        addRock(newRock)
    }
    const addOop = () => {
        const newRock = outOfPlayRocks.value[0];
        addRock({...newRock, removed: false, x:0, y:0})
    }

    const updateRock = (rock) => {
      const {shot_no} = rock;
       const index = [...rockPositions.value].findIndex((r) => r.shot_no === shot_no);
        if (index !== -1) {
        const newRockPositions = [...rockPositions.value];
        newRockPositions.splice(index, 1, rock)
        editedShot.value.rock_positions = JSON.stringify({
        rocks: newRockPositions
       });
      }
    }

    const onRockPositionUpdated = (e, shot_no) => {
      updateRock({...e, shot_no})
    }

    const onRemoveRock = (rock) => {
      deleteOverlay.value = false;
      updateRock({...rock, removed: true})
      // const index = [...rockPositions.value].findIndex((r) => r.shot_no === shot_no);
      //   if (index === -1) return;
      //   const newRockPositions = [...rockPositions.value];
      //   newRockPositions.splice(index, 1)
      //   editedShot.value.rock_positions = JSON.stringify({
      //   rocks: newRockPositions
      //  });
      
    }
    const onOutsideBounds = (bool) => {
      deleteOverlay.value = bool;
    };
</script>


