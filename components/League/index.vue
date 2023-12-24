<template>
    <div class="league__container" v-if="!isLoading">
        <header class="column justify-end league--header" ref="header">
            <div class="league-header__content full-width">
                <h1 class="text-md text-bold text-center " :style="{color: league.color}">{{ league?.name }}</h1>
              
                <h3 class="text-sm text-center" @click="navigateTo(`/rinks/${league?.rink?.id}`)">{{league?.rink?.name}}</h3>
            
    
            
            </div>
             <nav class="rink-nav" ref="nav">
              <q-tabs
                v-model="currentIndex"
                stretch

                class="tabs"
            
            >
                <q-tab label="Standings" :name="0"  />
                <q-tab label="Results" :name="1"/>
                 <q-tab label="Upcoming" :name="2" :disable="true"/>
            
            </q-tabs>
        </nav>
        </header>
       
        <main class="rink__content--container">
            <KeepAlive>
            <LeagueStandings v-if="currentIndex === 0" :leagueId="leagueId"/>
            <LeagueResults v-else-if="currentIndex === 1" :leagueId="leagueId"/>
            </KeepAlive>
          
        </main>

    </div>
</template>
<style lang="scss" scoped>
.league__container {
    height: 100%;
    width: 100%;
    background-color: white;
    .league--header {
        position: relative;
        .league-header__content {
            padding: var(--space-sm);
            z-index: 1;
            width: fit-content;
               
            h1 {
               
                
                font-size: var(--text-xl);
                @include sm {
                     font-size: var(--text-xxxl);
                }

            }
        }
    }

    .rink-nav {
        position: sticky;
        top: 0;
        z-index: 2;
        background-color: white;
        box-shadow: $pretty-shadow;
    }

    .rink__content--container {
        min-height: v-bind(mainHeight)
    }
    .tabs {
        :deep(.q-tab--active) {
            color: v-bind(leagueColor)
        }
    }
}
</style>
<script setup>
import { useQuery } from "@tanstack/vue-query";
import League from '@/store/models/league';
import Rink from '@/store/models/rink'
import {useElementBounding} from '@vueuse/core'

const defaultAvatar = new URL("~/assets/rink.jpg", import.meta.url).href;

const route = useRoute();
const leagueId = Number(route.params.id);

const league = computed(() => useRepo(League).withAll().where('id', leagueId).first())

const {getLeague} = useLeague()

const { isLoading } = useQuery({
    queryKey: ["league", leagueId],
    queryFn: () => getLeague(leagueId),
    refetchOnWindowFocus: false,
    select: (val) => {
        const { setLoading } = useLoading();
        setLoading(false);
        return val;
    },
});

// Tabs
const currentIndex = ref(0)


// Main height calc

const header = ref(null);
const nav = ref(null);

const {height: headerHeight} = useElementBounding(header);
const {height: navHeight} = useElementBounding(nav);

const $q = useQuasar();

const mainHeight = computed(() => `calc((100 * var(--vh, 1vh)) - ${headerHeight.value + navHeight.value}px - ${$q.screen.xs ? 50 : 65}px)`)

const leagueColor = computed(() => league.value?.color)
</script>
<script>
export default {
    name: 'League',
}
</script>
