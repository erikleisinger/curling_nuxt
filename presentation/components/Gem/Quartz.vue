<template>
   <svg width="60" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_206_705)">
<path d="M0 5L3 18H11L14 5L7 0L0 5Z" :fill="base"/>
<path d="M0 5L3 18L4.21663 16.1849L2.34045 5.22952L6.99467 2.17371L7 0L0 5Z" :fill="dark"/>
<path d="M4.22094 16.1834L3 18H11L14 5L7 0L7.04168 2.1267L11.6489 5.13549L9.90944 16.1364L4.22094 16.1834Z" :fill="light"/>
</g>
<defs>
<clipPath id="clip0_206_705">
<rect width="14" height="18" fill="white"/>
</clipPath>
</defs>
</svg>

</template>
<script setup>
    const {calculateGemShades} = useGem();

    const {base, dark, light} = calculateGemShades('#a140ff')
</script>
