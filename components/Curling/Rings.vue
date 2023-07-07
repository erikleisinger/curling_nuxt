<template>
  <div class="rink">
    <slot />
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
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  max-width: 100%;
  max-height: 100%;
  aspect-ratio: 15/27;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  &:before {
    content: "";
    top: 22.22%;
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
    height: 44.44%;
    width: 80%;
    margin: auto;
    .ring__outer {
      fill: var(--q-primary)
    }
    .ring__inner {
      fill: $rings-red
    }
  }
}
</style>
