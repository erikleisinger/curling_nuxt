<template>

  <div
    class="rock__icon"
    :class="[
      props.disabled ? 'rock-disabled' : '',
      props.selected ? 'selected' : '',
    ]"
    :style="{position: draggable ? 'absolute' : 'relative'}"
  >
  <div class="row justify-center items-center number-label" v-if="props.overlay">
    <slot/>
  </div>
  </div>
</template>
<style lang="scss">

.rock__icon {
    display: inline-block;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.4);
  color:black;
  background-image: v-bind(bg);
 box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
 aspect-ratio: 1/1;
   .number-label {
        color:white
    }
  &:after {
    content: "";
    height: 50%;
    width: 10%;
    top: 25%;
border-radius: 4px;
    left: 45%;
    transform: v-bind(rotation);
    background-color: v-bind(handleColor);
    position: absolute;
  }
  &.rock-disabled {
    color: rgb(206, 206, 206);
    background-color: rgb(206, 206, 206, 0.4);
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
    line-height:100%

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
  reverse: Boolean,
  overlay: Boolean,
  selected: Boolean,

});
const bg = computed(() => {
    if (props.disabled) return 'unset'
    return {
        blue: 'linear-gradient(to top, #3790e9 0%, #2e8be9 100%)',
        yellow: 'linear-gradient(to top, #ffec3d 0%, #f3dc0f 100%)',
        red: 'linear-gradient(to top, #e53734 0%, #d33131 100%)'
    }[props.color] || 'unset'
})
const handleColor = computed(() => {
    if (props.disabled) return 'gray'
    return {
        blue: '#003060',
        yellow: '#837600',
        red: '#640200'
    }[props.color] || 'unset'
})

const rotation = computed(() => `rotate(${props.reverse ? '225' : '135'}deg)`)

</script>
