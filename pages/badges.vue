<template>
<div class="badges-grid">
    <div v-for="badge in Object.keys(BADGE_NAMES)" :key="badge">
        <Badge :badge="{
            name: badge,
            team_id: null,
            created_at: null,
            info: {
                value: 0
            },
            earned: Math.random() >= 0.5
        }"/>
    </div>
</div>
</template>
<style lang="scss" scoped>
    .badges-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
</style>    
<script setup>
    import {BADGE_NAMES} from '@/constants/badges'
</script>