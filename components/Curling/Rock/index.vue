<template>
  <CurlingRockIcon
    :class="colorClass"
    :style="{
      userSelect: 'none',
      top: `${positionY}%`,
      left: `${positionX}%`,
    }"
    class="rock row justify-center"
    :id="`rock-${rock.shot_no}`"
    ref="rockRef"
  >
    {{ rock.shot_no }}
  </CurlingRockIcon>
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
    background-color: $rock-red
  }
  &.rock-yellow {
    background-color: $rock-yellow
  }
  &.rock-blue {
    background-color: $rock-blue
  }
}
</style>
<script setup>
import {computed, reactive, ref, onMounted, onUnmounted} from "vue";
import {useEventListener, useMouseInElement} from "@vueuse/core";

const props = defineProps({
  rock: Object,
});

const emit = defineEmits(["update", "remove", "outsideBounds"]);

// Determine rock colors
const isEven = computed(() => props.rock.shot_no % 2 === 0);
const colorClass = computed(() => {
  if (props.rock.color) return `rock-${props.rock.color}`;
  return isEven.value ? "rock-yellow" : "rock-red";
});

// Utility functions

const getPercentWidth = (pos, element) => {
  return (pos / element.offsetWidth) * 100;
};
const getPercentHeight = (pos, element) => {
  return (pos / element.offsetHeight) * 100;
};

// Define x,y and set initial values

const positionX = ref(0);
const positionY = ref(0);
onMounted(() => {
  positionY.value = props.rock.y;
  positionX.value = props.rock.x;
});

// Drag events

const target = document.querySelector("#curlingRockWrapper");
const mouse = reactive(useMouseInElement(target));

const dragging = ref(false);
const startDrag = () => {
  dragging.value = true;
};

const onDrag = (e) => {
  if (!dragging.value) return;
  const {elementY, elementX, isOutside} = mouse;
  positionX.value = getPercentWidth(elementX, target);
  positionY.value = getPercentHeight(elementY, target);
  emit("outsideBounds", isOutside);
};

const endDrag = () => {
  if (!dragging.value) return;
  dragging.value = false;
  const {isOutside} = mouse;
  if (isOutside) {
    emit("remove");
  } else {
    emit("update", {x: positionX.value, y: positionY.value, color: props.rock.color});
  }
};

const rockRef = ref(null);
useEventListener(rockRef, "mousedown", startDrag);
useEventListener(rockRef, "touchstart", startDrag);
useEventListener(document, "mousemove", onDrag);
useEventListener(document, "touchmove", onDrag);
useEventListener(document, "mouseup", endDrag);
useEventListener(document, "touchend", endDrag);
</script>
