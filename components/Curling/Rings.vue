<template>
  <div class="rink" ref="rink">
    <slot v-bind:scale="scale" v-bind:left="left" v-bind:top="top" />
    <div class="rings__wrapper">
      <svg height="100%" width="100%">
        <circle cx="50%" cy="50%" r="50%" class="ring__outer" />
        <circle cx="50%" cy="50%" r="33%" style="fill: white" />
        <circle cx="50%" cy="50%" r="16.67%" class="ring__inner" />
        <circle cx="50%" cy="50%" r="5%" style="fill: white" />
      </svg>
    </div>
  </div>
</template>

<style lang="scss">
.rink {
  background-color: white;
  position: absolute;
  margin: auto;
  left: v-bind(leftComputed);
  top: v-bind(topComputed);
  max-width: 100%;
  right: 0;
  max-height: 100%;
  aspect-ratio: v-bind(aspectRatio);
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  overscroll-behavior: contain;
  border-top: 2px solid rgba(0 0 0 / 20%);
  transform: v-bind(computedScale);
  width: max-content;
  transition: scale 0.1s;
  &:before {
    content: "";
    top: v-bind(teeLinePercentFromTop);
    width: 100%;
    height: 2px;
    background-color: rgb(0 0 0 / 20%);
    display: block;
    position: absolute;
  }
  &:after {
    content: "";
    height: 100%;
    width: 2px;
    margin: auto;
    background-color: rgb(0 0 0 / 20%);
    display: block;
    position: absolute;
    left: 0%;
    right: 0%;
    top: 0;
  }
  .rings__wrapper {
    height: v-bind(ringsHeightPercent);
    width: v-bind(ringsWidthPercent);
    margin: auto;
    .ring__outer {
      fill: var(--q-primary);
    }
    .ring__inner {
      fill: $rings-red;
    }
  }
}
</style>
<script setup>
import {useEventListener, useSwipe, useThrottleFn, useParentElement} from "@vueuse/core";
import {useEventStore} from "@/store/event";

const eventStore = useEventStore();
const isRockSelected = computed(() => eventStore.rockSelected);

// Mobile pinch to zoom in / zoom out
const rink = ref(null);
const isPinching = ref(false);
const initialPinch = ref(0);
const rafId = ref(null)
const scale = ref(1);
const pinchStart = (e) => {
  if (isRockSelected.value) return;
  if (e.touches.length !== 2) return;
  isPinching.value = true;
  initialPinch.value = Math.hypot(
    e.touches[0].pageX - e.touches[1].pageX,
    e.touches[0].pageY - e.touches[1].pageY
  );
};
const SCALE_MIN = 1;
const SCALE_MAX = 5;
const handlePinchMove = (e) => {

  const currentTouches = Math.hypot(
    e.touches[0].pageX - e.touches[1].pageX,
    e.touches[0].pageY - e.touches[1].pageY
  );
  const isZoomIn = currentTouches - initialPinch.value > 0;
  if (Math.abs(currentTouches - initialPinch.value) >= 10) {

  
  const toAdd =
    (Math.abs(currentTouches - initialPinch.value) / 1000) * scale.value;
  if (isZoomIn) {
    if (scale.value + toAdd > SCALE_MAX) {
      scale.value = SCALE_MAX;
    } else {
      scale.value += toAdd;
    }
  } else {
    if (scale.value - toAdd < SCALE_MIN) {
      scale.value = SCALE_MIN;
    } else {
      scale.value -= toAdd;
    }
  }
  }
  const isOutsideVertical = checkOutsideVerticalBounds(top.value)
  const isOutsideHorizontal = checkOutsideHorizontalBounds(left.value)
  if (isOutsideVertical) top.value = isOutsideVertical
  if(isOutsideHorizontal) left.value = isOutsideHorizontal
  rafId.value = null;
};

const pinchMove = (e) => {
    if (isRockSelected.value) return;
  if (!isPinching.value) return;
  if (e.touches.length !== 2) return;
  if (rafId.value) return;
  rafId.value = window.requestAnimationFrame(() => handlePinchMove(e));
}
const pinchEnd = (e) => {
  if (!isPinching.value) return;
  setTimeout(() => {
    isPinching.value = false;
  }, 200);
};
useEventListener(document, "touchstart", pinchStart);
useEventListener(rink, "touchmove", pinchMove);
useEventListener(document, "touchend", pinchEnd);

const computedScale = computed(() => `scale(${scale.value})`);
const PLAYING_AREA_DIMENSIONS = {x: 180, y: 324};

// Calculate aspect ratio
const aspectRatio = ref(
  `${PLAYING_AREA_DIMENSIONS.x}/${PLAYING_AREA_DIMENSIONS.y}`
);

// Calculate rings dimensions & location from top of total rink

const ringsHeightPercent = ref(`${(144 / PLAYING_AREA_DIMENSIONS.y) * 100}%`);
const ringsWidthPercent = ref(`${(144 / PLAYING_AREA_DIMENSIONS.x) * 100}%`);

// Calculate tee-line location relative to top of rink

const TEE_LINE_LOCATION_FROM_TOP_INCHES = 72;
const teeLinePercentFromTop = ref(
  `${(TEE_LINE_LOCATION_FROM_TOP_INCHES / PLAYING_AREA_DIMENSIONS.y) * 100}%`
);

const swipeStartTop = ref(0);
const swipeStartLeft = ref(0);
const top = ref(0);
const topComputed = computed(() => `${top.value}px`);
const left = ref(0);
const leftComputed = computed(() => `${left.value}px`);
const rightComputed = computed(() => `${left.value * -1}px`);

const parent = useParentElement()
const checkOutsideVerticalBounds = (newVal) => {
  const topMin = rink.value.offsetHeight * scale.value * -1 /2
    const topMax = ((parent.value.offsetHeight + (rink.value.offsetHeight * scale.value))  - 200) / 2
    if (newVal > topMax) {
      return topMax
    } else if(newVal < topMin) {
      return topMin
    } else {
      return null;
    }
}
const calculateTopDiff = (e) => {
  const endVal = e.changedTouches[0].clientY;
  const diff = endVal - swipeStartTop.value;
  const newValue = checkOutsideVerticalBounds(top.value + diff)
  if (newValue) {
     top.value = newValue
  } else {
     top.value += diff;
  }

};

const checkOutsideHorizontalBounds = (newVal) => {
    const leftMax = ((parent.value.offsetWidth + (rink.value.offsetWidth * scale.value))  - 100) / 2
    const leftMin = (parent.value.offsetWidth + (rink.value.offsetWidth * scale.value)) * -1 + 100;
    if (newVal > leftMax) {
      return leftMax
    } else if(newVal < leftMin) {
      return leftMin
    } else {
      return null;
    }
}
const calculateLeftDiff = (e) => {
  const endVal = e.changedTouches[0].clientX;
  const diff = endVal - swipeStartLeft.value;

  const newValue = checkOutsideHorizontalBounds(left.value + diff)
  if (newValue) {
     left.value = newValue
  } else {
     left.value += diff;
  }
};

// Move rink around
const {direction} = useSwipe(rink, {
  onSwipeStart: (e) => {
    if (isRockSelected.value) return;
    if (isPinching.value) return;
    if (e.touches.length !== 1) return;
    if (Array.from(e.target.classList).includes("rock")) return;
    swipeStartTop.value = e.changedTouches[0].clientY;
    swipeStartLeft.value = e.changedTouches[0].clientX;
  },
  onSwipe: (e) => {
    if (isRockSelected.value) return;
    if (isPinching.value) return;
    if (e.touches.length !== 1) return;
    if (Array.from(e.target.classList).includes("rock")) return;
    calculateTopDiff(e);
    calculateLeftDiff(e);
    swipeStartTop.value = e.changedTouches[0].clientY;
    swipeStartLeft.value = e.changedTouches[0].clientX;
  },
  threshold: 10,
});
</script>
