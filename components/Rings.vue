<template>

        <svg :width="size" :height="size" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="rings">
<!-- <circle cx="16" cy="16" r="16" fill="#6CC0E5"/>
<ellipse cx="16" cy="16.25" rx="11" ry="11.25" fill="white"/>
<circle cx="16" cy="16" r="6.5" fill="#FB4F4F"/>
<circle cx="16" cy="16" r="2.5" fill="white"/> -->
<circle cx="16" cy="16" r="16" :fill="twelveft"/>
<ellipse cx="16" cy="16.25" rx="11" ry="11.25" :fill="eightft"/>
<circle cx="16" cy="16" r="6.5" :fill="fourft"/>
<circle cx="16" cy="16" r="2.5" :fill="buttonft"/>
</svg>

</template>

<script setup>
    const props = defineProps({
    size: {
        type: String,
        default: "35px",
    },
    twelveft: {
        type: String,
        default: "#347fc4"
    },
    eightft: {
        type: String,
        default: "white"
    },
    fourft: {
         type: String,
        default: "#ed254e"
    },
    buttonft: {
 type: String,
        default: "white"
    }
});
</script>