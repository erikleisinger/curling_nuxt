<template>
 <div class="overview-section">
        <div class="overview-tile">
            <q-skeleton v-if="isLoading" :height="$q.screen.xs ? '56px' : '75px'" :width="$q.screen.xs ? '50px' : '50px'" style="margin:auto"/>
            <h2 v-else class="overview-h2" ref="winPercentRef">{{winPercent}}<span class="append">%</span></h2>
              <q-skeleton v-if="isLoading" height="0.9em" width="75px" style="margin-top: 2px"/>
             <h3 class="yellow overview-h3" v-else>wins</h3>
        </div>
         <div class="overview-tile">
              <q-skeleton v-if="isLoading" :height="$q.screen.xs ? '56px' : '75px'" :width="$q.screen.xs ? '50px' : '50px'" style="margin:auto"/>
            <h2 v-else class="overview-h2">{{gameCount}}</h2>
             <q-skeleton v-if="isLoading" height="0.9em" width="75px" style="margin-top: 2px"/>
            <h3 class="red overview-h3" v-else>games played</h3>
         </div>
        <div class="overview-tile">
               <q-skeleton v-if="isLoading" :height="$q.screen.xs ? '56px' : '75px'" :width="$q.screen.xs ? '50px' : '50px'" style="margin:auto"/>
            <h2 v-else class="overview-h2">{{badgeCount}}</h2>
            <q-skeleton v-if="isLoading" height="0.9em" width="75px" style="margin-top: 2px"/>
             <h3 class="blue overview-h3" v-else>badges earned</h3>
        </div>
       </div>
</template>

<style lang="scss" scoped>
    .overview-section {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        .overview-tile {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            @include line-tight;
            
            h2 {
                font-family: $font-family-header;
                @include xl-text;
                .append {
                    font-size: 16px;
                    line-height: 16px;
                    @include sm {
                        font-size: 24px;
                    }
                }

              
            }
            h3 {
                font-family: $font-family-header;
                
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
import gsap from 'gsap';
import {Flip} from 'gsap/Flip';
gsap.registerPlugin(Flip)

const props = defineProps({
    teamIds: Array,
})

    const userTeamIds = ref(props.teamIds)

    const getGamesPlayed = async () => {
        const client = useSupabaseClient();
        const {count } = await client.from('games').select('*', {count: 'exact'}).or(`home.in.(${userTeamIds.value.join(',')}),away.in.(${userTeamIds.value.join(',')})`)
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
        const {data} = await client.from('team_stats').select('win, loss, tie', {count:'exact'}).in('team_id', userTeamIds.value)
        const wins = data.filter(({win}) => !!win);
        const losses = data.filter(({loss}) => !!loss);
        const ties = data.filter(({tie}) => !!tie);
        const totalGames = wins.length + ties.length + losses.length;

        return ((wins.length / totalGames) * 100).toFixed(0)
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
    const winPercentRef = ref(null)
     const gameCountRef = ref(null);
     const badgeCountRef = ref(null);
    const animateRefs = (el) => {
        // const tl = gsap.timeline
        nextTick(() => {
            gsap.from('.overview-h2', {
                scale: 0,
                duration:1,
                stagger: 0.4,
                ease: 'elastic',
                delay: 0.1,
            })
            gsap.from('.overview-h3', {
                scaleY: 0,
                duration:0.1,
                stagger: 0.4,
                delay: 0.3,
            })
            })
    }



    watch(winPercentRef, (val) => {
        if (!!val) animateRefs()
    })

   
    // watch(gameCountRef, (val) => {
    //     if (!!val) animateRef(val)
    // })


    // watch(badgeCountRef, (val) => {
    //     if (!!val) animateRef(val)
    // })

const isLoading = computed(() => isLoadingBadgeCount.value || isLoadingGames.value || isLoadingWinPercent.value)

    </script>