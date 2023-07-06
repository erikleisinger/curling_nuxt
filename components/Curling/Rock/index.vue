<template>

 <CurlingRockIcon :class="colorClass" :style="{
      userSelect: 'none',
      top: `${positionY}%`,
      left: `${positionX}%`,
    }"    class="rock row justify-center"     :id="`rock-${rock.shot_no}`"  ref="rockRef">
  {{rock.shot_no}}
 </CurlingRockIcon>
    <!-- <div style="position:absolute; z-index: 5000; background-color:red; top: 0">
      <div v-for="property in Object.keys(mouseCom)" :key="property">
        {{property}}: {{mouseCom[property]}}
      </div>
    </div> -->

</template>
<style lang="scss">
.rock {
  position: absolute;
  height: 3.41%;
  aspect-ratio: 1/1;
  border-radius: 50%;
  top: 0;
  left: 0;
  border: 1px solid rgb(70, 70, 70);
  z-index: 1;
  &.rock-red {
    background-color: $rock-red;
  }
  &.rock-yellow {
    background-color: $rock-yellow
  }
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
const emit = defineEmits(['update', 'remove', 'outsideBounds'])


const isEven = computed(() => props.rock.shot_no % 2 === 0)
const colorClass= computed(() => {
  return isEven.value ? 'rock-yellow' : 'rock-red'
})

const target = document.querySelector("#curlingRockWrapper");
const mouse = reactive(useMouseInElement(target));

onMounted(() => {
  positionY.value = props.rock.y;
  positionX.value = props.rock.x;
});



const mouseCom = computed(() => {
  const {elementX, elementY, x, y, elementPositionX, elementPositionY, elementHeight, elementWidth} = mouse
  return {elementX, elementY, x, y, elementPositionX, elementPositionY, elementHeight, elementWidth}
})

const getPercentWidth = (pos) => {
  const target = document.querySelector("#curlingRockWrapper");
  return pos / target.offsetWidth * 100;
}
const getPercentHeight = (pos) => {
  const target = document.querySelector("#curlingRockWrapper");
  return pos / target.offsetHeight * 100;
}

const endDrag = () => {
  if (!dragging.value) return;
  dragging.value = false;
     const {isOutside} = mouse;
  if (isOutside) {
    emit('remove')
  } else {
 emit('update', {x: positionX.value, y: positionY.value})
  }


  
  
 
};
const startDrag = () => {
  dragging.value = true;
};

const onDrag = (e) => {
  if (!dragging.value) return;
 
  // const {offsetWidth, offsetHeight} = rockRef.value;

  const {elementY, elementX, elementWidth, elementHeight, isOutside} = mouse;
  // if (elementX + offsetWidth > elementWidth) return;
  // if (elementY + offsetHeight > elementHeight) return;
  positionX.value = getPercentWidth(elementX)
  positionY.value = getPercentHeight(elementY)

  emit('outsideBounds', isOutside)

};

useEventListener(rockRef, "mousedown", startDrag);
useEventListener(rockRef, "touchstart", startDrag);
useEventListener(document, "mousemove", onDrag);
useEventListener(document, "touchmove", onDrag);
useEventListener(document, "mouseup", endDrag);
useEventListener(document, "touchend", endDrag);
</script>
