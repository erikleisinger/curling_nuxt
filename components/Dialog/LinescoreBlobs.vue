<template>
<div class="column full-height justify-between items-between full-width no-wrap" :style="{transform, transition: 'all 1s'}">
        <svg viewBox="0 0 258 215" fill="none" xmlns="http://www.w3.org/2000/svg" >
<path d="M250.302 72.5631C219.614 22.7194 176.15 -7.36699 118.302 1.5631C60.4539 10.4932 -28.3327 37.6567 8.80173 72.5631C28.975 91.526 57.6457 68.1273 78.3017 86.5631C100.636 106.496 81.2389 135.966 98.3017 160.563C136.698 215.913 240.431 239.686 269.802 179.063C288.237 141.012 272.469 108.568 250.302 72.5631Z" fill="#F0F0F0"/>
</svg>
    <svg width="512" height="386" viewBox="0 0 512 386" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M502.619 276.688C467.377 355.745 361.124 263.745 282.112 299.087C199.685 335.955 203.038 469.904 113.609 457.419C20.8782 444.473 -0.252555 339.708 0.390834 246.08C0.971479 161.582 28.9738 104.122 95.1242 51.5452C213.287 -42.3716 401.465 -1.30912 473.279 131.452C500.81 182.347 526.179 223.838 502.619 276.688Z" fill="#E1E1E1"/>
</svg>



</div>
</template>
<script setup>
    const props = defineProps({
        step: Number
    })
    const translate = ref(300)

    watch(() => props.step, (newVal, oldVal) => {
        
        if (newVal > oldVal) {
            translate.value -= 100
        } else {
            translate.value += 100
        }
    })

    const transform = computed(() => `translateX(${translate.value}px)`)
</script>
