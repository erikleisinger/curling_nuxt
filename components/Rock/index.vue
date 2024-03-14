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
    :size="rockDiameter"
    :highlight="rock.lying"
  >
    <div v-if="showNumbers" :style="{transform: `rotate(${props.rotated ? '180' : '0'}deg)`, lineHeight: '0px'}">{{Math.round(rock.shot_no / 2)}}</div>
   </RockIcon>
</template>
<style lang="scss">
.rock {
  height: v-bind(rockDiameterPx);
  width: v-bind(rockDiameterPx);
  aspect-ratio: 1/1;
  border-radius: 50%;
  top: 0;
  left: 0;
  transform: translateZ(0deg);
  z-index: 1;
  &.draggable {
    position: absolute;
  }
}
</style>
<script setup lang="ts">
import {computed, reactive, ref, onMounted} from "vue";
import {
  useEventListener,
  useMouseInElement,
  onClickOutside,
  useParentElement,
  useElementVisibility,
} from "@vueuse/core";
import {ROCK_DIAMETER_PERCENT_X, ROCK_DIAMETER_PERCENT_Y} from '@/constants/dimensions'

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


const rockRef = ref(null);



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

const rockDiameter = ref(0)
const rockDiameterPx = computed(() => `${rockDiameter.value}px`)
const ratio = window.devicePixelRatio
const positionX = ref(0);
const positionY = ref(0);
onMounted(() => {
  positionY.value = props.rock?.y ?? 0;
  positionX.value = props.rock?.x ?? 0;

const el = document.querySelector('#curlingRockWrapper') as HTMLDivElement
const rockHeight = Number(((ROCK_DIAMETER_PERCENT_Y / 100) * el.offsetHeight).toFixed());
const rockWidth = Number(((ROCK_DIAMETER_PERCENT_X / 100) * el.offsetWidth).toFixed());
// rockDiameterPercent.value = `${rockHeight + rockHeight % 2 ^1}px` 
rockDiameter.value = rockWidth - (rockWidth % Number(ratio.toFixed(2)));
// rockDiameterPercent.value = `${rockHeight}px`

});

// Drag events

const mouse = reactive(useMouseInElement(useParentElement()));
const enableDragging = ref(false);
const isDragging = ref(false);
const rockVisible = useElementVisibility(rockRef)

let frameId;
const startDrag = (e: Event) => {
  if (!isSelected.value) return;
  startEventListeners()
  enableDragging.value = true;
};
const $q = useQuasar();


const changeRockPosition = () => {
const {elementY, elementX,elementHeight, elementWidth} = mouse;
  positionX.value = Number(getPercentWidth(elementX, elementWidth));
  positionY.value = Number(getPercentHeight(elementY, elementHeight));
}
const onDrag = (e: Event) => {
  if ($q.platform.is.mobile && e.type === "mousemove") return;
  if (e.type === "mousemove") e.preventDefault();
  if (props.onDrag) {
    props.onDrag();
    return;
  }
  if (!enableDragging.value) return;
  isDragging.value = true;
  const {isOutside, elementHeight, elementWidth} = mouse;

  frameId = window.requestAnimationFrame(changeRockPosition)
//   emit("outsideBounds", isOutside || !rockVisible.value);
 emit("outsideBounds", isOutside);
  isDragging.value = false;
};

const endDrag = (e: TouchEvent | PointerEvent | MouseEvent) => {
  if (!enableDragging.value) return;
window.cancelAnimationFrame(frameId)
  enableDragging.value = false;
  const {isOutside} = mouse;
//   if (isOutside || !rockVisible.value) {
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

const rockId = `rock-${props.rock.shot_no}`;

const selectedRock = computed(() => null);
const isSelected = computed(() => {
  return selectedRock.value === rockId;
});
const selectRock = () => {
  return;
}
const deselectRock = (
  e: PointerEvent | TouchEvent | MouseEvent,
  isDragEnd: boolean = false
) => {
  const target = e.target as Element;
  if (Array.from(target.classList).includes("rock") && !isDragEnd) return;
};
const rockClasses = computed(() => {
  return `${isSelected.value ? "selected" : ""}`;
});
onClickOutside(rockRef, deselectRock);
useEventListener(rockRef, "click", selectRock);
useEventListener(document, "mousedown", startDrag);
useEventListener(document, "touchstart", startDrag);

</script>
