<template>
 <div class="overview-section">
        <div class="overview-tile">
            <q-skeleton v-if="isLoadingWinPercent" :height="$q.screen.xs ? '56px' : '75px'" :width="$q.screen.xs ? '50px' : '50px'" style="margin:auto"/>
            <h2 v-else>{{winPercent}}<span class="append">%</span></h2>
             <h3 class="yellow">wins</h3>
        </div>
         <div class="overview-tile">
              <q-skeleton v-if="isLoadingGames" :height="$q.screen.xs ? '56px' : '75px'" :width="$q.screen.xs ? '50px' : '50px'" style="margin:auto"/>
            <h2 v-else>{{gameCount}}</h2>
            <h3 class="red">games played</h3>
         </div>
        <div class="overview-tile">
               <q-skeleton v-if="isLoadingBadgeCount" :height="$q.screen.xs ? '56px' : '75px'" :width="$q.screen.xs ? '50px' : '50px'" style="margin:auto"/>
            <h2 v-else>{{badgeCount}}</h2>
             <h3 class="blue">badges earned</h3>
        </div>
       </div>
</template>

<style lang="scss" scoped>
    .overview-section {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        .overview-tile {
            text-align: center;
            
            h2 {
                font-family: $font-family-header;
                line-height: 56px;
                font-size: 56px;
                .append {
                    font-size: 16px;
                    line-height: 16px;
                    @include sm {
                        font-size: 24px;
                    }
                }

                @include sm {
                    font-size: 75px;
                    line-height: 70px;
                }
            }
            h3 {
                font-family: $font-family-header;
                font-size: 18px;
                line-height: 12px;
                &.yellow {
                    color: $app-yellow;
                }
                 &.red {
                    color: $app-red;
                }
                 &.blue {
                    color: $app-blue;
                }
                @include sm {
                    font-size: 22px;
                    line-height: 18px;
                }
            }
        }
    }
</style>
<script setup>
import {useUserTeamStore} from '@/store/user-teams'
    import {useQuery} from '@tanstack/vue-query';

    const userTeamIds = computed(() => useUserTeamStore().userTeams.map(({id}) => id))

    const getGamesPlayed = async () => {
        const client = useSupabaseClient();
        const {count, data} = await client.from('games').select('*', {count: 'exact'}).or(`home.in.(${userTeamIds.value.join(',')}),away.in.(${userTeamIds.value.join(',')})`)
        console.log(data)
        return count;
    }

    const {user:userId} = useUser()

    const isGamesFetchEnabled = computed(() => !!userId.value && !!userTeamIds.value?.length)
    
    const {isLoading: isLoadingGames, data:gameCount} = useQuery({
        queryKey: ['games', 'played', userId.value],
        queryFn: getGamesPlayed,
        refetchOnWindowFocus: false,
        enabled: isGamesFetchEnabled
    })


    const getWinPercentage = async () => {
        const client = useSupabaseClient();
        const {count} = await client.from('team_stats').select('*', {count:'exact'}).in('team_id', userTeamIds.value).eq('win', 1)
 
        return ((count / gameCount.value) * 100).toFixed(0)
    }

    const isWinPercentFetchEnabled = computed(() => !!gameCount.value > 0)

     const {isLoading: isLoadingWinPercent, data:winPercent} = useQuery({
        queryKey: ['winpercent', userId.value],
        queryFn: getWinPercentage,
        refetchOnWindowFocus: false,
        enabled: isWinPercentFetchEnabled
    })


    const getBadgeCount = async () => {
        const client = useSupabaseClient();
        const {count} = await client.from('badges').select('*', {count: 'exact'}).or(`team_id.in.(${userTeamIds.value.join(',')}),profile_id.eq.${userId.value}`)

        return count;
    }

     const isBadgeCountFetchEnabled = computed(() => !!userId.value && !!userTeamIds.value?.length)

     const {isLoading: isLoadingBadgeCount, data:badgeCount} = useQuery({
        queryKey: ['badgecount', userId.value],
        queryFn: getBadgeCount,
        refetchOnWindowFocus: false,
        enabled: isBadgeCountFetchEnabled
    })
</script>