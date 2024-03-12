<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 462 402"
        width="60"
    >
        <rect
            id="backgroundrect"
            width="100%"
            height="100%"
            x="0"
            y="0"
            fill="none"
            stroke="none"
        />
        <g class="currentLayer" style="">
            <title>Layer 1</title>
            <g class="" style="" id="svg_1">
                <path
                    d="M135,0 c-3.1,0 -9.2,3.8600000000000003 -14.2,11.74 c-3.4,5.26 -6,11.86 -7.5,18.26 h168 l22.5,62 H103 c-3.5,0 -9.8,3.7 -14.8,10.4 c-2.7,3.5 -4.8,7.7 -6.2,11.6 h297.2 c-1.6,-3.3 -3.9,-6.8 -6.8,-9.9 c-5.9,-6.3 -13.5,-10.1 -17.4,-10.1 h-5.5 l-48,-94 H135 zm-48,132 c-28.25,0 -49.54,17.5 -64.51,40 c-12.09,18.2 -19.31,39.6 -21.65,54 H461.2 c-2.4,-14.4 -9.6,-35.8 -21.7,-54 c-15,-22.5 -36.3,-40 -64.5,-40 H87 zM0,244 v46 h462 v-46 H0 zm0.8400000000000001,64 c2.34,14.4 9.56,35.8 21.65,54 c14.97,22.5 36.26,40 64.51,40 h288 c28.2,0 49.5,-17.5 64.5,-40 c12.1,-18.2 19.3,-39.6 21.7,-54 H0.8399999999999999 z"
                    :fill="color"
                    fill-opacity="1"
                    id="svg_2"
                />
            </g>
        </g>
    </svg>
</template>
<script setup>
    const props = defineProps({
        color: {
            type: String,
            default: 'white'
        }
    })
</script>
