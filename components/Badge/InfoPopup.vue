<template>
     <DialogInfo v-if="!!open" @close="open = false" class="badges-info__popup">
        <div class="column items-center badges-info__popup--inner">
            <div class="badge-icon__container">
            <BadgeIcon height="7em" class="q-mr-sm" :badge="badge.name" />
            </div>
            <div class="badge-popup__content column items-center">
                 <div class="cutout"/>
            <h2 class="text-xl text-bold text-uppercase text-center" style="margin-top: 8px; line-height: 1.4em">
                {{ BADGE_NAMES[badge.name] }}
            </h2>
            <p class="text-sm text-italic text-center q-px-md">
                {{ BADGE_DESCRIPTIONS[badge.name] }}
            </p>
             
                </div>
        
             <div class="badge-popup__additional" :class="BADGE_BACKGROUNDS[badge.name]">
             <div class="badge-popup__additional--inner">
                 <p class="text-sm text-center text-bold row justify-center" >
       
               <div v-if="!!globalCount" style="width: fit-content"> {{globalCount}}% of teams have this badge.</div>
               <q-skeleton v-else type="text" width="185px"/>
      
            </p>
                <div class="badge-popup__game-result">

                </div>
          
            <p class="text-sm row justify-center text-center other-info" v-if="!!game">
                   <div class="col-12 text-italic">
                         Earned on {{ toTimezone(badge.created_at, "MMMM DD, YYYY", false) }}
                   </div>
                     <div class="col-12 text-italic row justify-center" style="gap: var(--space-xs)">
                        <div>vs.</div><div style="width: 1.5em">     <TeamAvatar :teamId="game?.opposition?.id"/></div><div> {{game?.opposition?.name}}</div>
                   </div>
                   <div class="text-underline clickable" @click="navigateTo(`/games/view/${badge.game_id}`)">
                    View game
                    </div>  
            </p>
            <div v-else class="column items-center">
 <q-skeleton type="text" width="185px"/>
  <q-skeleton  type="text" width="100px"/>
   <q-skeleton  type="text" width="80px"/>
            </div> 
        
             </div>
            </div>

        </div>
    </DialogInfo>
</template>
<style lang="scss" scoped>
    .badges-info__popup--inner {
    border-radius: 16px;
     background-color:white;
       box-shadow: $pretty-shadow;
.badge-popup__content {
   
    padding: 0px var(--space-sm);
    position: relative;
    width: 100%;
    z-index: 2;
    padding-top: 4em;
    padding-bottom: var(--space-xs);
    @include sm {
        padding-bottom: var(--space-sm)
    }
      .cutout {
            position: absolute;
            width: 100%;
            height: 7em;
            bottom: 0;
            background-color:white;
            z-index: -1;
            border-radius: 50%;
            clip-path: inset(50% 0 0 0);
        }

}
    .badge-icon__container,
    .badge-icon__backdrop {
        position: absolute;
        top: -2.5em;
        left: 0;
        right: 0;
        margin: auto;
        width: 7em;
    }

    .badge-popup__additional {
        color: white;
background-size: cover;
background-position: center;
        margin-top: -3.5em;
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
        width: 100%;
        position: relative;
        padding-top: 2.9em;
        min-height: 178px;
        @include sm {
            padding-top: 2.9em;

        }
       
        .badge-popup__additional--inner {
            margin-top: var(--space-md);
            padding: 0px var(--space-lg);
        }
        .global-count {
            transition: all 0.2s;
        }
    
    }
}
</style>
<style lang="scss">
.badges-info__popup {
   .q-card {
        background-color:transparent;
        box-shadow: unset;
        position: relative;
        overflow: visible;
    }
    @include sm {
        transform: scale(1.8)
    }



}
</style>
<script setup>
import {useQuery} from '@tanstack/vue-query'
import { BADGE_NAMES, BADGE_DESCRIPTIONS, BADGE_BACKGROUNDS } from "@/constants/badges";
const props = defineProps({
    badge: Object,
    modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const open = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})
    const { toTimezone } = useTime();
const {getGames} = useGame();
const isShowing = computed(() => open.value)

const {isLoading, data: game} = useQuery({
    queryKey: ['game', Number(props.badge.game_id)],
     queryFn: () =>
        getGames({
            team_id_param: null,
            game_id_param: Number(props.badge.game_id),
        }),
    select: (teams) => {
        const opposition = teams.find(({team_id}) => team_id !== props.badge.team_id)
        const home = teams.find(({team_id}) => team_id === props.badge.team_id)
        return {
            opposition: opposition?.team,
            home: home?.team,
            points_for: home?.points_scored ?? 0,
            points_against: opposition?.points_scored ?? 0
        }
    },
    enabled: isShowing
})

const getBadgeCountGlobal = async () => {
    const client = useSupabaseClient();
    const {data} = await client.from('badges').select('*').eq('name', props.badge.name).eq('earned', true)

    const {data: teams} = await client.from('teams').select('id');

    const numTeamsWithBadge = data?.length ?? 0;
    const numTeams = teams?.length ?? 0;
    return Number(((numTeamsWithBadge / numTeams)  * 100).toFixed(0))
}

const {isLoading: isLoadingGlobalCount, data: globalCount} = useQuery({
    queryKey: ['badge', 'globalcount', props.badge.name],
    queryFn: getBadgeCountGlobal,
    enabled: isShowing,
    select: (val) => {
        return val;
    }
})
</script>