<template>
  <div :id="`rock-${rock.id}`" class="rock" :style="{
          userSelect: 'none',
          top: `${restrictedY}px`,
          left: `${restrictedX}px`,
        }"  ref="rockRef" />
</template>
<style scoped>
.rock {
  position: fixed;
  background-color: black;
  height: 3.41%;
  aspect-ratio: 1/1;
  border-radius: 50%;
  top: 0;
  left: 0;
}
</style>
<script setup>
import {ref} from 'vue'
import {useDraggable, useElementBounding, clamp } from '@vueuse/core'

const rockRef = ref(null)

const props = defineProps({
    rock: Object,
})
const container = document.querySelector('#curlingRockWrapper')

const { left, right, top, bottom } = useElementBounding(container);
const { width, height } = useElementBounding(rockRef);
const { x, y, style } = useDraggable(rockRef);

const restrictedX = computed(() =>
  clamp(left.value, x.value, right.value - width.value)
);
const restrictedY = computed(() =>
  clamp(top.value, y.value, bottom.value - height.value)
);
</script>
