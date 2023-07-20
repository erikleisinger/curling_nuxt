<template>
  <div
    class="rock__icon"
    :class="[
      props.disabled ? 'rock-disabled' : `rock-${props.color}`,
      props.selected ? 'selected' : '',
    ]"
    :style="{position: draggable ? 'absolute' : 'relative'}"
  >
  <div class="number-label row justify-center items-center">
    <slot/>
  </div>
  </div>
</template>
<style lang="scss">
.rock__icon {
  background-color: rgba(0, 0, 0, 0);
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.4);
  color:black;
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
     .number-label {
        color:white;
    }
  }
  &.rock-yellow {
    color: $rock-yellow;
    background-color: $rock-yellow;
     .number-label {
        color:white
    }
  }
  &.rock-blue {
    color: $rock-blue;
    background-color: $rock-blue;
     .number-label {
        color:white;
    }
  }
  &.rock-disabled {
    color: rgb(206, 206, 206);
    background-color: rgb(206, 206, 206);
    .number-label {
        color:white;
    }
  }
  &.selected {
    -webkit-box-shadow: 0px 0px 6px 4px rgba(255, 220, 46, 0.85);
    -moz-box-shadow: 0px 0px 6px 4px rgba(255, 220, 46, 0.85);
    box-shadow: 0px 0px 6px 4px rgba(255, 220, 46, 0.85);
  }
  .number-label {
    height: 100%;
    width: 100%;
    position:absolute;
    z-index:1;
    background-color:rgba(0,0,0,0.3);
    border-radius:50%;
    font-size:90%;
    text-align:center;
    font-weight: 600;
    line-height:88%;
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
