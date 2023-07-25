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
    :overlay="showNumbers"
  >
    <span v-if="showNumbers">{{Math.round(rock.shot_no / 2)}}</span>
  </RockIcon>
</template>
<style lang="scss">
.rock {
  height: v-bind(rockDiameterPercent);
  aspect-ratio: 1/1;
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
import {ROCK_DIAMETER_PERCENT, ROCK_DIAMETER_PERCENT_X, ROCK_DIAMETER_PERCENT_Y} from '@/constants/dimensions'

const props = defineProps({
  onDrag: Function,
  rock: {
    type: Object,
    required: true,
  },
  manualXY: Boolean,
  manualX: [Number, String],
  manualY: [Number, String],
  rotated: Boolean,
  scale: {
    type: Number,
    default: 1,
  },
  showNumbers: Boolean,
});

const rockDiameterPercent = ref(`${ROCK_DIAMETER_PERCENT}%`)

const emit = defineEmits(["update", "remove", "outsideBounds"]);
// Utility functions
const getPercentWidth = (pos: number,parentWidth: number) => {
  try {

    return ((props.rotated ? parentWidth - pos : pos) / parentWidth) * 100 - ROCK_DIAMETER_PERCENT_X / 2;
  } catch {
    return 0;
  }
};
const getPercentHeight = (pos: number, parentHeight: number) => {
  try {
    return ((props.rotated ? parentHeight - pos : pos) / parentHeight) * 100 - ROCK_DIAMETER_PERCENT_Y / 2;
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

const mouse = reactive(useMouseInElement(useParentElement()));

const enableDragging = ref(false);
const isDragging = ref(false);

const startDrag = (e: Event) => {
  if (!isSelected.value) return;
  startEventListeners()
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

  const {elementY, elementX, isOutside, elementHeight, elementWidth} = mouse;
  positionX.value = getPercentWidth(elementX, elementWidth);
  positionY.value = getPercentHeight(elementY, elementHeight);
  emit("outsideBounds", isOutside);
  isDragging.value = false;
};

const endDrag = (e: TouchEvent | PointerEvent | MouseEvent) => {
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
  endEventListeners();
};

const startEventListeners = () => {
document.addEventListener("mousemove", onDrag);
document.addEventListener("touchmove", onDrag);
document.addEventListener("mouseup", endDrag);
document.addEventListener("touchend", endDrag);
}
const endEventListeners = () => {
  document.removeEventListener("mousemove", onDrag);
document.removeEventListener("touchmove", onDrag);
document.removeEventListener("mouseup", endDrag);
document.removeEventListener("touchend", endDrag);
}

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
  e: PointerEvent | TouchEvent | MouseEvent,
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
useEventListener(rockRef, "click", selectRock);
useEventListener(document, "mousedown", startDrag);
useEventListener(document, "touchstart", startDrag);

</script>
