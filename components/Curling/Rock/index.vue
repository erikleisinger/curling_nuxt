<template>
  <div
    :id="`rock-${rock.id}`"
    class="rock"
    :style="{
      userSelect: 'none',
      top: `${positionY}%`,
      left: `${positionX}%`,
    }"
    ref="rockRef"
  />
</template>
<style scoped>
.rock {
  position: absolute;
  background-color: black;
  height: 3.41%;
  aspect-ratio: 1/1;
  border-radius: 50%;
  top: 0;
  left: 0;
}
</style>
<script setup>
import {computed, reactive, ref, onMounted, onUnmounted} from "vue";
import {useEventListener, useMouseInElement} from "@vueuse/core";

// import {useClamp} from "@vueuse/math";
const rockRef = ref(null);

const props = defineProps({
  rock: Object,
});

const positionX = ref(0);
const positionY = ref(0);
const dragging = ref(false);
const emit = defineEmits(['update'])

const target = document.querySelector("#curlingRockWrapper");

onMounted(() => {
  positionY.value = props.rock.y;
  positionX.value = props.rock.x;
});


const mouse = reactive(useMouseInElement(target));

const getPercentWidth = (pos) => {
  return pos /target.offsetWidth * 100;
}
const getPercentHeight = (pos) => {
  return pos / target.offsetHeight * 100;
}

const endDrag = () => {
  
  if (dragging.value) {
dragging.value = false;
 emit('update', {x: positionX.value, y: positionY.value})
  }
  
 
};
const startDrag = () => {
  dragging.value = true;
};

const onDrag = (e) => {
  if (!dragging.value) return;
  const {isOutside} = mouse;
  if (isOutside) return;
  const {offsetWidth, offsetHeight} = rockRef.value;

  const {elementY, elementX, elementWidth, elementHeight} = mouse;
   
  if (elementX + offsetWidth > elementWidth) return;
  if (elementY + offsetHeight > elementHeight) return;
  positionX.value = getPercentWidth(elementX)
  positionY.value = getPercentHeight(elementY)
};

useEventListener(rockRef, "mousedown", startDrag);
useEventListener(rockRef, "touchstart", startDrag);
useEventListener(document, "mousemove", onDrag);
useEventListener(document, "touchmove", onDrag);
useEventListener(document, "mouseup", endDrag);
useEventListener(document, "touchend", endDrag);
</script>
