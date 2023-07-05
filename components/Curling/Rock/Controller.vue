<template>
  <CurlingRings>
    <div style="height: 100%; width: 100%; position: absolute; overflow: hidden" id="curlingRockWrapper" v-if="rockPositions">
      <button @click="addRock">Add</button>
      <CurlingRock v-for="(rock, index) in rocks" :key="`rock-${index}-home`" :rock="rock" />
    </div>
  </CurlingRings>
</template>

<script setup>
    import { computed, inject, ref} from 'vue';
    const props = defineProps({
        shot: Object,
    });
    const rocks = ref([])
    const rockPositions = computed(() => {
        return props?.shot?.rock_positions
    })
    const addRock = () => {
        rocks.value.push({x: 40, y: 40, id: Math.random()})
    }
</script>


