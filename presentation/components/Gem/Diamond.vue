<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        fill="none"
        viewBox="0 0 18 18"
        style=""
    >
        <rect
            id="backgroundrect"
            width="100%"
            height="100%"
            x="0"
            y="0"
            fill="none"
            stroke="none"
            style=""
            class=""
        />

        <g class="currentLayer" style="">
            <title>Layer 1</title>
            <path
                :fill="base"
                d="M18,13 V5 l-4,-5 H4 L0,5 v8 l4,5 h10 l4,-5 z"
                id="svg_1"
                class=""
            />
              <!-- fill="#61F5FF" -->
            <!-- dark -->
            <path
              :fill="dark"
                d="M18,13 V5 l-4,1.5 v5 L12,14 H6 l-2,4 h10 l4,-5 z"
                id="svg_2"
                class=""
            ></path>
              <!-- fill="#1AD0DC" -->
            <!-- light -->
            <path
                :fill="light"
                d="M0,5 v8 l4,-1.5 v-5 L6,4 h6 l2,-4 H4 L0,5 z"
                id="svg_3"
                class=""
            />
            <!-- fill="#9FF9FF" -->
        </g>
    </svg>
</template>
<script setup>
const {calculateGemShades} = useGem();

const {base, light, dark} = calculateGemShades('#ffc107')
</script>