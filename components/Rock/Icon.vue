<template>
  <div
    class="rock__icon"
    :class="[
      props.disabled ? 'rock-disabled' : `rock-${props.color}`,
      props.selected ? 'selected' : '',
    ]"
    :style="{position: draggable ? 'absolute' : 'relative'}"
  />
</template>
<style lang="scss">
.rock__icon {
  background-color: rgba(0, 0, 0, 0);
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.4);
  &:after {
    content: "";
    height: 50%;
    width: 10%;
    top: 25%;

    left: 45%;
    transform: rotateZ(135deg);
    background-color: rgb(70, 70, 70);
    position: absolute;
  }
  &.rock-red {
    color: $rock-red;
    background-color: $rock-red;
  }
  &.rock-yellow {
    color: $rock-yellow;
    background-color: $rock-yellow;
  }
  &.rock-blue {
    color: $rock-blue;
    background-color: $rock-blue;
  }
  &.rock-disabled {
    color: rgb(206, 206, 206);
    background-color: rgb(206, 206, 206);
  }
  &.selected {
    -webkit-box-shadow: 0px 0px 6px 4px rgba(255, 220, 46, 0.85);
    -moz-box-shadow: 0px 0px 6px 4px rgba(255, 220, 46, 0.85);
    box-shadow: 0px 0px 6px 4px rgba(255, 220, 46, 0.85);
  }
}
</style>
<script setup lang="ts">
const props = defineProps({
  disabled: Boolean,
  draggable: {
    type:Boolean,
    default() {
      return true
    }
  },
  color: {
    type: String,
    default() {
      return "red";
    },
  },
  selected: Boolean,
});
</script>
