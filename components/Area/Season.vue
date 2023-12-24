<template>
  <header class="season__header row items-center" v-if="!!user?.id">
            <div class="avatar__container">
                <Avataaar v-bind="user.avatar"/>
            </div>
            <div>
            <h1 class="text-bold text-center">
                {{user.first_name}}'s Season
            </h1>
            <h2 class="text-italic" style="margin-top: -6px">2023-2024</h2>
            </div>
        </header>
        <q-separator/>
    <main class="row">
      
        <section name="teams" :class="$q.screen.xs ? 'col-12' : 'col-6'">
            <h3 class="header-text"> Teams</h3>
            <!-- <q-separator /> -->
            <div class="row cards__container" ref="container" >
                <TeamCard
                    v-for="team in teams"
                    :key="team.id"
                    :teamId="team.id"
                    :dense="$q.screen.xs"
                />
                <div v-if="!teams.length" class="q-pa-sm">
                    You have no teams!
                </div>
            </div>
        </section>
        <section name="leagues" :class="$q.screen.xs ? 'col-12' : 'col-6'">
            <h3 class="header-text"> Leagues</h3>
            <!-- <q-separator /> -->
            <q-list separator v-if="leagues?.length">
                <q-item
                    v-for="league in leagues"
                    :key="league.id"
                    clickable
                    v-ripple
                    @click="navigateTo(`/leagues/${league.id}`)"
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
                            {{ league.name }}
                        </q-item-label>
                        <q-item-label caption>
                            {{ league.rink?.name }}
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
            <div v-else class="q-pa-sm">You aren't in any leagues!</div>
        </section>
    </main>
</template>
<style lang="scss" scoped>
$gap: 6px;
.header-text {
    padding: var(--space-xs);
    padding-left: var(--space-sm);
    padding-bottom: 0;
    text-transform: uppercase;
    font-size: var(--text-md);
    font-weight: bold;
}
.cards__container {
    margin-top: var(--space-sm);
    padding: 0px var(--space-xs);
    margin-left: var(--space-xs);
    gap: $gap;
    :deep(.team-card__container) {
        width: v-bind(cardWidth);
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
import { useQuery } from "@tanstack/vue-query";
import { useElementBounding } from "@vueuse/core";
import Player from '@/store/models/player'


const $q = useQuasar();

const { user: userId } = useUser();


const user = computed(() => useRepo(Player).where('id', userId.value).first())

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

const isLeagueQueryEnabled = computed(() => !!teams.value?.length);
const { getLeagueGames } = useGame();

const { isLoading: loadingLeagues, data: leagues } = useQuery({
    queryKey: ["user", "leagues", userId.value],
    queryFn: getUserLeagues,
    refetchOnWindowFocus: false,
    enabled: isLeagueQueryEnabled,
});

const container = ref(null);

const { width: containerWidth } = useElementBounding(container);

const numCards = computed(() => Math.ceil(containerWidth.value / 200));
const cardWidth = computed(() => `calc(${100 / numCards.value}% - 8px)`);
</script>
