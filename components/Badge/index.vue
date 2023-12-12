<template>
    <div class="badge__container ">
        <div class="row no-wrap items-center q-mb-sm">
        <BadgeIcon height="2em" class="q-mr-sm" :badge="badge.name"/>
        <div>
            <h2 class="text-sm text-bold">{{BADGE_NAMES[badge.name]}}</h2>
            
        </div>
        
        </div>
        <div class="text-sm badge-description">{{BADGE_DESCRIPTIONS[badge.name]}}</div>
        <div class="text-xs text-right">
            {{toTimezone(badge.created_at, null, false, true).fromNow()}}
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .badge__container {
        display: grid;
        grid-template-rows: 2.5em 2.5em 1em;
        padding: var(--space-xs);
        border-radius: 8px;
   background-color: rgba(0, 0, 0, 0.015);
   height: min-content;
   max-width: 150px;
   .badge-description {
    min-height: 2em;
   }
    }
</style>
<script setup>
    const props = defineProps({
        badge: Object,
    })

    const BADGE_NAMES = {
        'win_1': 'Chicken Dinner 1',
        'win_5': 'Chicken Dinner 5',
        'win_10': 'Chicken Dinner 10',
        'win_25': 'Chicken Dinner 25',
        'win_50': 'Chicken Dinner 50',
        'win_100': 'Chicken Dinner 100',
        shutout: 'Shutout',
        handshakes: 'Handshakes'
    }

    const BADGE_DESCRIPTIONS = {
        'win_1': 'Won 1 game (chicken cutlet)',
        'win_5': 'Won 5 games (5 piece chicken nuggies)',
        'win_10': 'Won 10 games (10 piece chicken nuggies)',
        'win_25': 'Won 25 games (1/4 chicken combo + fries)',
        'win_50': 'Won 50 games (chicken potroast)',
        'win_100': 'Won 100 games (full blown honey-basted chicken)',
        shutout: 'Opponent scores no points',
        handshakes: 'Won a game by handshakes'
    }

    const {toTimezone} = useTime();
</script>
<script>
export default {
    name: 'Badge'
}
</script>
