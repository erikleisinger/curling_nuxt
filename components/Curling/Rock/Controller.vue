<template>
  <CurlingRings>
    <div style="height: 100%; width: 100%; position: absolute; overflow: hidden" id="curlingRockWrapper">
      <button @click="addRock">ADd</button>
      <CurlingRock v-for="(rock, index) in rocks" :key="`rock-${index}-home`" :rock="rock" />
    </div>
  </CurlingRings>
</template>

<script setup>
    import { inject} from 'vue';
    const shot = inject('editedShot') ?? {}
    // const {rock_positions} = shot.value;
    const rocks = ref([])
    const addRock = () => {
        rocks.value.push({x: 40, y: 40, id: Math.random()})
    }
</script>


