<template>
  <CurlingRings>
    <div style="height: 100%; width: 100%; position: absolute; overflow: hidden"  id="curlingRockWrapper">
       <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
      <div style="height: 100%; width: 100%; position:absolute; background-color:rgba(0,0,0,0.4);" v-if="deleteOverlay" class="row justify-center items-center">
        <q-icon size="xl" name="delete" color="white"/>
      </div>
       </transition>
      <button @click="addRock">Add</button>
      <CurlingRock v-for="(rock, index) in rocksInPlay" :key="`rock-${index}-${editedShot.id}`" :rock="rock" @update="onRockPositionUpdated($event, rock.shot_no)" @remove="onRemoveRock(rock)" @outsideBounds="onOutsideBounds"  />

    </div>

  </CurlingRings>
</template>

<script setup>
    import { computed, inject, ref} from 'vue';

  const editedShot = inject('editedShot');
  const deleteOverlay = ref(false)

    const rockPositions = computed(() => {
      try {
        return JSON.parse(editedShot?.value?.rock_positions)?.rocks ?? [];
      } catch {
        return []
      }
      
    })

    const rocksInPlay = computed(() => {
      return rockPositions.value.filter((s) => !s.removed)
    })

    const outOfPlayRocks = computed(() => {
      return rockPositions.value.filter((s) => !!s.removed)
    })

    const addRock = () => {
       if (rockPositions.value.length >= editedShot.value.shot_no) return;
       const newRockPositions = [
        ...rockPositions.value,
        {x:0, y:0, shot_no: rockPositions.value.length + 1}
       ];
       editedShot.value.rock_positions = JSON.stringify({
        rocks: newRockPositions
       });
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


