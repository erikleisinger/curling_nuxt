<template>
  <CurlingRings>
    <div style="height: 100%; width: 100%; position: absolute; overflow: hidden"  id="curlingRockWrapper">

      <button @click="addRock">Add</button>
      <CurlingRock v-for="(rock, index) in rockPositions" :key="`rock-${index}-${editedShot.id}`" :rock="rock" @update="onRockPositionUpdated($event, rock.shot_no)"  />

    </div>
  </CurlingRings>
</template>

<script setup>
    import { computed, inject, ref} from 'vue';

  const editedShot = inject('editedShot');

    const rockPositions = computed(() => {
      try {
        return JSON.parse(editedShot?.value?.rock_positions)?.rocks ?? [];
      } catch {
        return []
      }
      
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
</script>


