<template>

    <div class="rank-item row no-wrap justify-between items-center" :class="{highlight: userTeamIds.includes(stat.team_id)}">
        <div class="row rank-item__team no-wrap items-center">
        <h3 style="width: 0.5em" class="text-center">
        {{rank}}
        </h3>
        <div style="width: 1.5em; height: fit-content">
            <TeamAvatar :teamId="stat.team_id"/>
        </div>
        <h2 >
            {{stat.team?.name ?? 'Unknown team'}}
        </h2>
        </div>
        <h4>
            {{STAT_RANK_ORDER[type](stat).toFixed(isPercent ? 2 : 3)}}
        </h4>
    </div> 

</template>
<style lang="scss" scoped>
    .rank-item {
    &.highlight {
    //    background-color: rgba(0,0,0,0.4);
       border: 2px solid;
       border-color: v-bind(color);
    //    color: v-bind(color);
        padding: var(--space-xs);
        border-radius: 8px;
    }
        h3 {
            @include smmd-text;
            line-height: 1;
            height: fit-content;
        }
        h2 {
            @include smmd-text;
            line-height: 1;
             height: fit-content;
        }
        &:not(:first-child) {
            margin-top: var(--space-sm)
        }
        .rank-item__team {
 gap: var(--space-xs);
 height: fit-content;
        }
    }
</style>
<script setup>
import {STAT_RANK_ORDER, NON_PERCENT_STATS} from '@/constants/stats'
    const props = defineProps({
        color: String,
        rank: Number,
        stat: Object,
        type: String,
    })
    const isPercent = !NON_PERCENT_STATS.includes(props.type);
    const {userTeamIds} = useTeam();
</script>