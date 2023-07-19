<template>
  <RockIcon
    :class="rockClasses"
    :style="{
      userSelect: 'none',
      top: manualXY ? manualY : `${positionY}%`,
      left: manualXY ? manualX : `${positionX}%`,
    }"
    class="rock row justify-center draggable"
    :id="rockId"
    ref="rockRef"
    :color="props.rock.color"
    :selected="isSelected"
  >
  </RockIcon>
</template>
<style lang="scss">
.rock {
  height: v-bind(rockDiameterPercent);
  aspect-ratio: 1/1;
  width: 5.8%;
  border-radius: 50%;
  top: 0;
  left: 0;
  z-index: 1;

  &.draggable {
    position: absolute;
  }
}
</style>
<script setup lang="ts">
import {computed, reactive, ref, onMounted, onUnmounted} from "vue";
import {
  useEventListener,
  useMouseInElement,
  useElementSize,
  onClickOutside,
  useParentElement,
  toValue,
} from "@vueuse/core";
import {useEventStore} from "@/store/event";
import type {OnClickOutsideHandler} from "@vueuse/core";
import {ROCK_DIAMETER_PERCENT} from '@/constants/dimensions'

const props = defineProps({
  onDrag: Function,
  rock: {
    type: Object,
    required: true,
  },
  manualXY: Boolean,
  manualX: [Number, String],
  manualY: [Number, String],
  scale: {
    type: Number,
    default: 1,
  },
});

const rockDiameterPercent = ref(`${ROCK_DIAMETER_PERCENT}%`)

const emit = defineEmits(["update", "remove", "outsideBounds"]);

// Utility functions
const getPercentWidth = (pos: number, element: HTMLElement | null) => {
  try {
    if (!element)
      throw new Error(
        "Error calculating rock percent width: argument `element` is not an element"
      );
    return (pos / (element.offsetWidth * props.scale)) * 100 - ROCK_DIAMETER_PERCENT;
  } catch {
    return 0;
  }
};
const getPercentHeight = (pos: number, element: HTMLElement | null) => {
  try {
    if (!element)
      throw new Error(
        "Error calculating rock percent height: argument `element` is not an element"
      );
    return (pos / (element.offsetHeight * props.scale)) * 100 - ROCK_DIAMETER_PERCENT;
  } catch {
    return 0;
  }
};

// Define x,y and set initial values

const positionX = ref(0);
const positionY = ref(0);
onMounted(() => {
  positionY.value = props.rock?.y ?? 0;
  positionX.value = props.rock?.x ?? 0;
});

// Drag events

const target: HTMLElement | null = document.querySelector(
  "#curlingRockWrapper"
);
const mouse = reactive(useMouseInElement(useParentElement()));

const enableDragging = ref(false);
const isDragging = ref(false);

const startDrag = (e: Event) => {
  if (!isSelected.value) return;
  enableDragging.value = true;
};
const $q = useQuasar();
const onDrag = (e: Event) => {
  if ($q.platform.is.mobile && e.type === "mousemove") return;
  if (e.type === "mousemove") e.preventDefault();
  if (props.onDrag) {
    props.onDrag();
    return;
  }
  if (!enableDragging.value) return;
  isDragging.value = true;

  const {elementY, elementX, isOutside} = mouse;
  positionX.value = getPercentWidth(elementX, target);
  positionY.value = getPercentHeight(elementY, target);
  emit("outsideBounds", isOutside);
  isDragging.value = false;
};

const endDrag = (e: TouchEvent | PointerEvent) => {
   const {elementY, elementX} = mouse;
  console.log('END DRAG: ',getPercentWidth(elementX, target), getPercentHeight(elementY, target))
  if (!enableDragging.value) return;
  
  enableDragging.value = false;
  const {isOutside} = mouse;
  if (isOutside) {
    emit("remove");
  } else {
    emit("update", {
      x: positionX.value,
      y: positionY.value,
      color: props.rock.color,
    });
  }
  deselectRock(e, true);
};

const rockRef = ref(null);
const rockId = `rock-${props.rock.shot_no}`;

const eventStore = useEventStore();
const selectedRock = computed(() => eventStore.rockSelected);
const isSelected = computed(() => {
  return selectedRock.value === rockId;
});
const selectRock = () => {
  if (isSelected.value) return;
  eventStore.toggleRockSelected(rockId);
};
const deselectRock = (
  e: PointerEvent | TouchEvent,
  isDragEnd: boolean = false
) => {
  const target = e.target as Element;
  if (Array.from(target.classList).includes("rock") && !isDragEnd) return;
  eventStore.toggleRockSelected(null);
};
const rockClasses = computed(() => {
  return `${isSelected.value ? "selected" : ""}`;
});
onClickOutside(rockRef, deselectRock);
useEventListener(rockRef, "mousedown", startDrag);
useEventListener(rockRef, "click", selectRock);
useEventListener(rockRef, "touchstart", startDrag);
useEventListener(document, "mousemove", onDrag);
useEventListener(document, "touchmove", onDrag);
useEventListener(document, "mouseup", endDrag);
useEventListener(document, "touchend", endDrag);
</script>
