<template>
    <LinescoreGrid2
            :gameId="gameId"

            class="q-mb-lg"
          
        />
</template>
<style lang="scss" scoped>
    .avatar {
        height: unset;
        width: 100%;
        padding: var(--space-xxxs);
        margin-top: unset;
    
    }
</style>
<script setup>


    const props = defineProps({
        gameId: Number,
    })

</script>