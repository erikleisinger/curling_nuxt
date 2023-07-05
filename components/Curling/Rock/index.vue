<template>
  <div
    :id="`rock-${rock.id}`"
    class="rock"
    :style="{
      userSelect: 'none',
      top: `${positionY}%`,
      left: `${positionX}%`,
      backgroundColor: isEven ? 'yellow' : 'red'
    }"
    ref="rockRef"
  />
</template>
<style scoped>
.rock {
  position: absolute;
  height: 3.41%;
  aspect-ratio: 1/1;
  border-radius: 50%;
  top: 0;
  left: 0;
  border: 1px solid rgb(70, 70, 70);
}
</style>
<script setup>
import {computed, reactive, ref, onMounted, onUnmounted} from "vue";
import {useEventListener, useMouseInElement} from "@vueuse/core";

const rockRef = ref(null);

const props = defineProps({
  rock: Object,
});

const positionX = ref(0);
const positionY = ref(0);
const dragging = ref(false);
const emit = defineEmits(['update'])


const isEven = computed(() => props.rock.shot_no % 2 === 0)

onMounted(() => {
  positionY.value = props.rock.y;
  positionX.value = props.rock.x;
});

const target = document.querySelector("#curlingRockWrapper");
const mouse = reactive(useMouseInElement(target));

const getPercentWidth = (pos) => {
  const target = document.querySelector("#curlingRockWrapper");
  return pos /target.offsetWidth * 100;
}
const getPercentHeight = (pos) => {
  const target = document.querySelector("#curlingRockWrapper");
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
