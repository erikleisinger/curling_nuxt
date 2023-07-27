<template>
    <GlobalLoading v-if="globalLoading" infinite/>
    <!-- <div v-else style="height: inherit; width: inherit">
        wow -->
        <template v-else>
    <slot />
        </template>
    <!-- </div> -->
    <Banner/>
</template>
<script setup>
    const {globalLoading} = useLoading();
</script>

