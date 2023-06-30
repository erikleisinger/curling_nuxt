<template>
<div class="rink">
    <slot/>
    <div class="rings__wrapper">
    <svg height="100%" width="100%">
    <circle cx="50%" cy="50%" r="50%" style="fill:blue" />
     <circle cx="50%" cy="50%" r="33%" style="fill:white"/>
       <circle cx="50%" cy="50%" r="16.67%" style="fill:red"/>
       <circle cx="50%" cy="50%" r="5%" style="fill:white"/>
    </svg>
    </div>
</div>
</template>

<style lang="scss">
    .rink {
        aspect-ratio: 15/27;
       border: 1px solid black;
        height: inherit;
        position: relative;
        &:before {
            content: '';
            top: 22.22%;
            width: 100%;
            height: 2px;
             background-color: rgb(0 0 0 / 20%);
            display: block;
            position: absolute;
        }
        &:after {
            content: '';
            height: inherit;
            width: 2px;
            margin: auto;
            background-color: rgb(0 0 0 / 20%);
            display: block;
            position: absolute;
            left: 0%;
            right: 0%;
            top:0;
        }
        .rings__wrapper {
            height: 44.44%;
            width: 80%;
            margin: auto;
        }

    }
</style>
