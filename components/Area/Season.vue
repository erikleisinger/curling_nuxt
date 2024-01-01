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

        <!-- TEAMS -->
  
        <section name="teams" :class="$q.screen.xs ? 'col-12' : 'col-6'" >
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

<!-- UPCOMING -->

            <section name="upcoming" :class="$q.screen.xs ? 'col-12' : 'col-6'" v-if="homeRink">
         <div class="row justify-between items-center header-text">
                <div class="">
            <h3> Upcoming games <div class="underline"/></h3>
                <h4 v-if="!isLoadingUpcoming">You have {{!upcomingGames?.length ? 'no games' : upcomingGames?.length === 1  ? 'a game' : `${upcomingGames.length} games`}} coming up!</h4>
                <h4 v-else>...</h4>
                </div>

            </div> 
            <div v-if="isLoadingUpcoming">
             <q-item
                v-for="i in Array.from(Array(1).keys())"
                :key="i"
                class="justify-center"
            >
                <q-item-section avatar style="min-width: 100px">
                    <div class="row no-wrap justify-end items-center">
                           <q-skeleton width="80px" height="1em" class="q-mr-sm"></q-skeleton>
                    <q-skeleton type="QAvatar" width="30px" height="30px"></q-skeleton>
                    </div>
                </q-item-section>

                <q-item-section style="max-width: 50px">
                    <q-item-label class="row justify-center">
                        <q-skeleton type="text" width="40px"></q-skeleton>
                    </q-item-label>
                    <q-item-label caption class="row justify-center">
                        <q-skeleton type="text" width="40px"></q-skeleton>
                    </q-item-label>
                </q-item-section>
                <q-item-section avatar style="min-width: 100px">
                    <div class="row no-wrap justify-end items-center">
                             <q-skeleton type="QAvatar" width="30px" height="30px"></q-skeleton>
                           <q-skeleton width="80px" height="1em" class="q-ml-sm"></q-skeleton>
               
                    </div>
                </q-item-section>
            </q-item>
            </div>
            <TeamGameResult v-for="game in upcomingGames" :key="game.id" :gameId="game.id" :home="game.home"/>

      </section>

        <!-- HOME RINK -->

         <section name="home rink" :class="$q.screen.xs ? 'col-12' : 'col-6'" style="margin-bottom: 0px">
             <div class="header-text row justify-between items-center" style="margin-bottom: 0px">
                <div>
            <h3 >Club news <div class="underline"/></h3>
            <h4 >{{homeRink?.name ?? "Unknown rink"}}</h4>
                </div>
                <div v-if="homeRink?.id">
                <q-btn flat round icon="exit_to_app"  @click="navigateTo(`/rinks/${homeRink.id}`)"/>
                </div>
             </div>
             <RinkNews v-if="homeRink?.id" :rinkId="homeRink.id"/>
              <div v-if="!homeRink?.id" class="full-width row justify-center items-center q-my-sm q-mt-md " >
                     <q-btn rounded color="primary" @click="toggleGlobalSearch({
                    open: true,
                    options: {
                        inputLabel: 'Search for your home rink',
                        resourceTypes: ['rink'],
                        callback: ({id}) => {
                            updateHomeRink(id)
                        }
                    }
                    

                })">Select a home rink</q-btn>
                </div>
         </section>


        <!-- LEAGUES -->

        <section name="leagues" :class="$q.screen.xs ? 'col-12' : 'col-6'" v-if="homeRink">
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
.upcoming-game__container {
    flex-wrap: wrap;
    .upcoming-game__item {
        display: grid!important;
        grid-template-columns: 1fr 50px 1fr;
        .q-item__section--avatar {
            padding: unset;
        }
    }

}

section {
    padding-bottom: var(--space-sm);
    @include bg-white-diagonal;
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
    background: $bg-black-carbon;
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
import Game from '@/store/models/game';
import GameTeam from '@/store/models/game-team'
import Team from '@/store/models/team'
import {useUserStore} from '@/store/user'
import {useDialogStore} from '@/store/dialog'
import { useQuery } from "@tanstack/vue-query";
import { useElementBounding } from "@vueuse/core";
import Player from '@/store/models/player';
import Rink from '@/store/models/rink'
import gsap from 'gsap';

const {getCurrentUser, updateHomeRink} = useUserStore();

const {toTimezone} = useTime()


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

const dayjs = useDayjs();
// UPCOMING GAMES

const getUpcomingGames = async () => {
    const client = useSupabaseClient();
    const {data} = await client.from('scheduled_games').select(`
    id, 
    start_time,
    league:league_id (
        id,
        name,
        color
    ),
    team_1 (
        id,
        name
    ),
    team_2 (
        id,
        name
    ),
    rink_id,
    league_drawtime_id (
        time
    )
    `).or(`team_1.in.(${teams?.value?.map(({id}) => id)}),team_2.in.(${teams?.value?.map(({id}) => id)})`).gte('start_time', dayjs().toISOString()).order('start_time', {ascending: true}).limit(3)

0;
    const games = []

    data.forEach((game) => {
        const {rink_id, start_time, league_drawtime_id} = game;
        const {time} = league_drawtime_id ?? {}
        console.log('start: ', dayjs(start_time).unix(), start_time, time)
        const id = Number((Math.random() * 1000000000000).toFixed())
        useRepo(Game).save({
            id,
            rink_id,
            start_time: dayjs(time ?? start_time).unix()

        })
        useRepo(Team).save({...game.team_1})
        useRepo(Team).save({...game.team_2})

        useRepo(GameTeam).save({
            id,
            game_id: id,
            team_id: game.team_1.id
        })
         useRepo(GameTeam).save({
            id,
            game_id: id,
            team_id: game.team_2.id
        })

        games.push({
            id,
            home: teams?.value?.some(({id}) => game.team_1.id) ? game.team_1.id : game.team_2.id
        })
    })


    return games;
}

const {isLoading: isLoadingUpcoming, data: upcomingGames} = useQuery({
    queryKey: ['upcoming', 'games', userId.value],
    queryFn: getUpcomingGames,
    refetchOnWindowFocus: false
})
</script>
