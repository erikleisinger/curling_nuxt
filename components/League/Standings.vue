<template>
    <div v-if="league.pools?.length && !isLoading">
        <section v-for="pool in league.pools" :key="pool.id" class="pool-section">
            <h2 class="text-md text-bold pool-header" >{{pool?.name}}</h2>
            <q-separator :style="{backgroundColor: league.color}" size="2px"/>
        <q-list  separator>
            <q-item style="min-height: 0">
                <q-item-section avatar style="min-width: 50px" class="text-sm text-bold">
                    Rank
                </q-item-section>
                 <q-item-section avatar >
                    
                </q-item-section>
               
                <q-item-section class="text-sm text-bold">
                    Team 
                </q-item-section>
                <q-item-section avatar class="text-sm text-bold">
                    W L T
                </q-item-section>
            </q-item>
            <q-item v-for="{team}, index in pool.teams.sort((a,b) => rankOrder.indexOf(a.team?.id) - rankOrder.indexOf(b.team?.id))" :key="team.id">
                  <q-item-section avatar style="min-width: 50px">
                        {{index + 1}}
                </q-item-section>
                <q-item-section avatar>
                    <div style="width: 30px">
                        <TeamAvatar :teamId="team.id"/>
                    </div>
                </q-item-section>
                <q-item-section>
                    {{team?.name}}
                </q-item-section>
                <q-item-section avatar>
                   <div class="row" v-if="standings">
                    {{standings[team.id]?.win}}
                      {{standings[team.id]?.loss}}
                        {{standings[team.id]?.tie}}
                   </div>
                </q-item-section>
              
            </q-item>
        </q-list>
        </section>
    </div>
</template>
<style lang="scss" scoped>
.pool-section {
    margin: var(--space-xs);
    box-shadow: $pretty-shadow;
    padding: var(--space-xs);
    border-radius: 16px;
    .pool-header {
        padding: var(--space-xs);
        padding-top: 0px;
    }
}

</style>
<script setup>
import League from '@/store/models/league'
import {useQuery} from '@tanstack/vue-query'
    const props = defineProps({
        leagueId: Number,
    })

    const league = computed(() => useRepo(League).withAllRecursive().where('id', props.leagueId).first())

    const getLeagueStandings = async () => {
        const client = useSupabaseClient();
        const {data} = await client.from('games').select('id').eq('league_id', props.leagueId);
        const gameIds = data.map(({id}) => id);

        const {data: stats} = await client.from('team_stats').select('*').in('game_id', gameIds).not('team_id', 'is', null)

        const formatted = stats.reduce((all, current) => {
            const allClone = {...all}
            if (!allClone[current.team_id]) allClone[current.team_id] = {
                win: 0,
                loss: 0,
                tie: 0,
            }
            return {
                ...allClone,
                [current.team_id]: {
                    win: allClone[current.team_id].win + current.win,
                    loss: allClone[current.team_id].loss + current.loss,
                    tie: allClone[current.team_id].tie + current.tie
                }
            }
        }, {})

  

        return formatted;
    }
    

    const {isLoading, data:standings} = useQuery({
        queryKey: ['league', 'standings', props.leagueId],
        queryFn: getLeagueStandings,
        refetchOnWindowFocus: false,
    })

    const rankOrder = computed(() => {
        if (!standings.value) return;
        return Object.entries(standings.value).reduce((all, [key, value]) => {
            return [...all, {
                id: key,
                winlosstieValue: (value.loss * 0) + (value.tie * 1) + (value.win * 3)
            }]
        }, []).sort((a,b) => b.winlosstieValue - a.winlosstieValue).map(({id}) => Number(id))
    })


</script>