<template>
  <header class="season__header row items-center no-wrap" v-if="!!user?.id">
            <div class="avatar__container">
                <Avataaar v-bind="user.avatar" @click="navigateTo(`/player/${user.id}`)"/>
            </div>
            <div>
            <h1 class="text-bold text-center">
                My Season
            </h1>
            <h2 class="text-italic" style="margin-top: -6px">2023-2024</h2>
            </div>
        </header>
        <q-separator/>
    <main class="row">
      
        <section name="teams" :class="$q.screen.xs ? 'col-12' : 'col-6'">
            <div class="row justify-between items-center header-text">
                <div class="">
            <h3> Teams <div class="underline"/></h3>
                <h4>{{teams.length ?? 0}} teams</h4>
                </div>
                <q-btn flat  @click="toggleTeamCreator({open: true})" round icon="add" dense/>
            </div>  
           
            <div class="row cards__container section-content" ref="container" >
                <TeamCard
                    v-for="team in teams"
                    :key="team.id"
                    :teamId="team.id"
                    :dense="$q.screen.xs"
                />
                <div v-if="!teams.length" class="full-width row justify-center items-center q-my-sm" >
                    <q-btn rounded color="primary" @click="toggleTeamCreator({open: true})" >Create a team</q-btn> <div class="q-mx-sm">or</div>
                     <q-btn rounded color="primary" @click="toggleGlobalSearch({
                    open: true,
                    options: {
                        inputLabel: 'Search for a team',
                        resourceTypes: ['team'],
                        callback: (val) => {
                            navigateTo(`/teams/${val.id}?request=true`)
                        }
                    }
                    

                })">Search for a team</q-btn>
                </div>
            </div>
        </section>

        <!-- HOME RINK -->

         <section name="home rink" :class="$q.screen.xs ? 'col-12' : 'col-6'">
             <div class="header-text">
            <h3 >Club news <div class="underline"/></h3>
            <h4 v-if="homeRink?.name">{{homeRink.name}}</h4>
             </div>
             <RinkNews v-if="homeRink?.id" :rinkId="homeRink.id"/>
         </section>


        <!-- LEAGUES -->

        <section name="leagues" :class="$q.screen.xs ? 'col-12' : 'col-6'">
            <div class="header-text">
            <h3 > Leagues <div class="underline"/></h3>
            <h4>{{leagues?.length ?? 0}} leagues</h4>
            </div>
            <!-- <q-separator /> -->
            <q-list v-if="loadingLeagues">
                <q-item>
                    <q-item-section avatar>
                        <q-skeleton type="circle" width="30px" height="30px"/>
                    </q-item-section>
                    <q-item-section>
                        <q-skeleton width="80%" height="1em"/>
                          <q-skeleton width="60%" height="0.9em" type="QChip" style="margin-top: 4px"/>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section avatar>
                        <q-skeleton type="circle" width="30px" height="30px"/>
                    </q-item-section>
                    <q-item-section>
                        <q-skeleton width="80%" height="1em"/>
                          <q-skeleton width="60%" height="0.9em" type="QChip" style="margin-top: 4px"/>
                    </q-item-section>
                </q-item>
            </q-list>
            <q-list separator v-else>
                <q-item
                    v-for="league in leagues"
                    :key="league.id"
                     
                     
                >
                    <q-item-section avatar>
                        <div style="width: 30px">
                            <TeamAvatar :teamId="league.team_id" />
                        </div>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label
                            class="text-bold"
                            :style="{ color: league.color }"
                             
                         
                        >
                        <span style="width:fit-content" class="clickable" @click="navigateTo(`/leagues/${league.id}`)">
                            {{ league.name }}
                        </span>
                        </q-item-label>
                        <q-item-label caption style="margin:0" >
                            <RinkChip :rinkId="league?.rink?.id"  />
                        </q-item-label>
                    </q-item-section>
                    <q-item-section avatar>
                        <div class="text-sm">
                            <div>{{ league.win ?? 0 }} W</div>
                            <div>{{ league.loss ?? 0 }} L</div>
                            <div v-if="league.tie">{{ league.tie ?? 0 }} T</div>
                        </div>
                    </q-item-section>
                </q-item>
            </q-list>
            <div v-if="!loadingLeagues && !leagues.length" class="full-width row justify-center q-mt-md">
                <q-btn rounded color="primary" @click="toggleGlobalSearch({
                    open: true,
                    options: {
                        inputLabel: 'Search for a league',
                        resourceTypes: ['league'],
                        callback: (val) => {
                            navigateTo(`/leagues/${val.id}`)
                        }
                    }
                    

                })">Search for a league</q-btn>
            </div>
        </section>
    </main>
</template>
<style lang="scss" scoped>
$gap: 6px;
section {
    margin-bottom: var(--space-sm);
}
main {
    margin-top: var(--space-sm);
}
.header-text {
    padding: var(--space-xs);
    padding-left: var(--space-sm);
    padding-right: var(--space-sm);
    margin-bottom: var(--space-sm);
    box-shadow: $pretty-shadow;
    border: 1px solid rgba(0,0,0,0.08);
    color: white;
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjNDAzYzNmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2U9IiMxZTI5MmQiPjwvcGF0aD4KPC9zdmc+");
    @include sm {
        margin-right: var(--space-xs);
    margin-left: var(--space-xs);
    border-radius: 16px;
    }
    h3 {
    text-transform: uppercase;
    font-size: var(--text-lg);
    font-weight: bold;
    position: relative;
  
    width: fit-content;
    .underline {
        position: absolute;
        bottom: 1px;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: var(--q-primary);
    }
    }
    h4 {
        font-size: var(--text-sm);
    }
}
.cards__container {
    margin-top: var(--space-sm);
      margin-left: var(--space-xs);
    gap: $gap;
    flex-wrap: nowrap;
    overflow: auto;
    @include sm {
        flex-wrap: wrap;
        padding: 0px var(--space-xs);
  
    }
    :deep(.team-card__container) {
        min-width: v-bind(cardWidth);
        @include sm {
            width: 100%;
        }
    }
}
.season__header {
    padding: var(--space-xs);
    h1 {
        font-size: var(--text-lg);
        @include sm {
            font-size: var(--text-xxl);
        }
    }
    h2 {
        font-size: var(--text-sm);
          @include sm {
            font-size: var(--text-md);
        }
    }
.avatar__container {
    width: 50px;
    margin-right: var(--space-sm);
        @include sm {
            width: 75px;
        }
   
}
}

</style>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import {useDialogStore} from '@/store/dialog'
import { useQuery } from "@tanstack/vue-query";
import { useElementBounding } from "@vueuse/core";
import Player from '@/store/models/player';
import Rink from '@/store/models/rink'
import gsap from 'gsap';


const {toggleTeamCreator, toggleGlobalSearch} = useDialogStore();


const $q = useQuasar();

const { user: userId } = useUser();


const user = computed(() => useRepo(Player).where('id', userId.value).first())

const homeRink = computed(() => useRepo(Rink).where('id', user.value?.rink_id).first())



const { sortAlphabetically } = useSort();
const teams = computed(() =>
    useUserTeamStore().userTeams.sort((a, b) =>
        sortAlphabetically(a.name, b.name)
    )
);

const getLeagueWinloss = async (leagueIds) => {
    const client = useSupabaseClient();
    const { data } = await client
        .rpc("get_league_winloss", {
            league_ids_param: leagueIds,
        })
        .in(
            "team_id",
            teams.value.map(({ id }) => id)
        );

    return data;
};

const getUserLeagues = async () => {
    const client = useSupabaseClient();

    const { data } = await client
        .from("league_teams")
        .select(
            `
            team_id,
            league:league_id (
                id,
                name,
                color,
                font_color,
                icon,
                rink:rink_id (
                    id,
                    name,
                    city,
                    province,
                    sheets
                )
            )
        `
        )
        .in(
            "team_id",
            teams.value.map(({ id }) => id)
        );

    const leagueIds = data.map(({ league }) => league.id);
    const winloss = await getLeagueWinloss(leagueIds);

    return data.map((d) => {
        return {
            ...d,
            ...d.league,
            ...winloss.find(
                ({ team_id, league_id }) =>
                    team_id === d.team_id && league_id === d.league.id
            ),
        };
    });
};

// const isLeagueQueryEnabled = computed(() => !!teams.value?.length);
const { getLeagueGames } = useGame();

const { isLoading: loadingLeagues, data: leagues } = useQuery({
    queryKey: ["user", "leagues", userId.value],
    queryFn: getUserLeagues,
    refetchOnWindowFocus: false,
    // enabled: isLeagueQueryEnabled,
});

const container = ref(null);

const { width: containerWidth } = useElementBounding(container);

const numCards = computed(() => Math.ceil(containerWidth.value / 200));
const cardWidth = computed(() => {
    if ($q.screen.xs) {
        return '200px'
    } 
    return `calc(${100 / numCards.value}% - 8px)`
});

const animate = () => {
    gsap.from('.underline', {
        scaleX: 0,
        delay: 0.5,
        duration: 0.5,
        transformOrigin: 'left',
        stagger: 0.3,
    })
    gsap.from('.header-text h3', {
        x: 50,
        opacity: 0,
        duration: 1.5,
        stagger: 0.3,
        ease: 'power'
    })
}
onMounted(() => {
    animate()
    
})
</script>
