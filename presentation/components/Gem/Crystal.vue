<template>
    <svg
        width="100"
        viewBox="0 0 12 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g clip-path="url(#clip0_206_699)">
            <path d="M0 4L6 0L12 4V14L6 18L0 14V4Z" :fill="base" />
            <path
                d="M10.5 13V5.5L12 4V14L6 18L6.04473 16.0296L10.5 13Z"
                :fill="dark"
            />
            <path d="M0 4L6 0V2L1.5 5V12.5L0 14V4Z" :fill="mat ? base : light" />
        </g>
    </svg>
</template>
<script setup>

const props = defineProps({
    color: String,
    mat: Boolean,
})

const { calculateGemShades } = useGem();

const { light, dark, base } = calculateGemShades(props.color)
</script>
