<template>
                         <div
                            :style="{
                                backgroundColor:
                                    index === 0 ? league.color : 'white',
                            }"
                            class="standing__item"
                        >
                            <div class="row items-center no-wrap">
                                <div class="text-md text-bold q-mr-md">
                                    {{ index + 1 }}
                                </div>
                                <div
                                    style="width: 40px; min-width: 40px"
                                    class="q-mr-md"
                                >
                                    <TeamAvatar :teamId="team?.id" />
                                     <LeagueStandingsMenu  :teamId="teamId" :leagueId="leagueId"  />
                                </div>
                                <div
                                    class="row no-wrap justify-between items-center"
                                    style="flex-grow: 1"
                                >
                                    <h4
                                        class="text-md text-bold"
                                        style="height: fit-content"
                                    >
                                        {{ team?.name }}
                                        <LeagueStandingsMenu  :teamId="teamId" :leagueId="leagueId"  />
                                    </h4>
                                    <div class="row no-wrap items-center">
                                    <div
                                        class="text-sm q-ml-md"
                                        style="
                                            line-height: 01em;
                                            min-width: 50px;
                                        "
                                    >
                                    <slot/>
                                       
                                    </div>
                                    
                                    </div>
                                </div>
                            </div>
                        </div>
</template>
<style lang="scss" scoped>
    
.standing__item {
    padding: var(--space-xs);
    background-color: white;
    &:first-child {
        transform: scale(1.05);
        border-radius: 8px;
        padding: var(--space-sm);
        color: white;
    }
    &:not(:first-child) {
        border-bottom: 1px solid rgba(0,0,0,0.1);
    }
}
</style>
<script setup>
import {useConfirmDialog} from '@vueuse/core'
import Team from '@/store/models/team'
import League from '@/store/models/league'
    const props = defineProps({
        leagueId: Number,
        teamId: Number,
        index: Number,
    })

    const team = computed(() => useRepo(Team).where('id', props.teamId).first());
     const league = computed(() => useRepo(League).where('id', props.leagueId).first());


</script>