<template>
  <CurlingRockIcon
    :class="colorClass"
    :style="{
      userSelect: 'none',
      top: `${positionY}%`,
      left: `${positionX}%`,
    }"
    class="rock row justify-center draggable"
    :id="`rock-${rock.shot_no}`"
    ref="rockRef"
  >
    <div :style="`position: absolute; left: ${width + 10}px; background-color: rgba(0,0,0,0.6);`" v-if="longPressedHook" ref="colorSelectionMenu">
      <CurlingRockIcon class="rock-red rock" :style="`height: ${width + 10}px; width: ${width + 10}px;`" @click="changeColor('red')"/>
        <CurlingRockIcon class="rock-yellow rock" :style="`height: ${width + 10}px; width: ${width + 10}px;`" @click="changeColor('yellow')"/>
         <CurlingRockIcon class="rock-blue rock" :style="`height: ${width + 10}px; width: ${width + 10}px;`" @click="changeColor('blue')"/>
    </div>
  </CurlingRockIcon>
</template>
<style lang="scss">
.rock {

  height: 3.28%;
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
  &.draggable {
  position: absolute;
  }
}
</style>
<script setup>
import {computed, reactive, ref, onMounted, onUnmounted} from "vue";
import {onLongPress, useEventListener, useMouseInElement, useElementSize, onClickOutside} from "@vueuse/core";

const props = defineProps({
  rock: Object,
});

const emit = defineEmits(["update", "remove", "outsideBounds"]);

// Determine rock colors
const isEven = computed(() => props.rock.shot_no % 2 === 0);
const colorClass = computed(() => {
  if (longPressedHook.value) return ''
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

const enableDragging = ref(false);
const isDragging = ref(false)
const startDrag = (e) => {
  enableDragging.value = true;
};
const $q = useQuasar()
const onDrag = (e) => {
  if ($q.platform.is.mobile && e.type === 'mousemove') return;
  if (e.type === 'mousemove') e.preventDefault();
  if (!enableDragging.value || longPressedHook.value) return;
    isDragging.value = true;
    
  const {elementY, elementX, isOutside} = mouse;
  positionX.value = getPercentWidth(elementX, target);
  positionY.value = getPercentHeight(elementY, target);
  emit("outsideBounds", isOutside);
    isDragging.value = false;

};

const endDrag = () => {
  if (!enableDragging.value) return;
  enableDragging.value = false;
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

// Long press for color change options
const longPressedHook = ref(false);
const initMenu = ref(false)
const onLongPressCallback = () => {
  longPressedHook.value = true;
  initMenu.value = true;
}
onLongPress(
  rockRef,
  onLongPressCallback,
  {delay: 1500}
)

const {width} = useElementSize(rockRef)
const colorSelectionMenu = ref(null)
onClickOutside(colorSelectionMenu, (E) => {
  if(enableDragging.value) return;
  if (initMenu.value) {
    initMenu.value = false;
    return;
  }
  longPressedHook.value = false
})

const changeColor = (color) => {
  emit("update", {x: positionX.value, y: positionY.value, color});
  longPressedHook.value = false;
}

</script>
