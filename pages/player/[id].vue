<template>
    <NuxtLayout>
        <div class="edit-container--floating" v-if="canEdit">
            <q-btn flat round icon="edit" @click="editing = true"/>
        </div>
        
        <header class="player-page__header column justify-center items-center">
            <div class="player-avatar__wrap">
                <Avataaar v-bind="player.avatar" v-if="!isLoading" />
            </div>
            <h2 class="text-lg text-bold text-center">
                {{ player.first_name }} {{ player.last_name }}
            </h2>
            <h3 class="text-sm">@{{ player.username }}</h3>
        </header>
        <main class="player--info">
            <section
                class="player-teams--section hide-scroll"
                :class="{ 'col-6': !$q.screen.xs }"
            >
                <div
                    v-for="team in teams"
                    :key="team.id"
                    class="player-team__container"
                    @click="navigateTo(`/teams/${team.id}`)"
                >
                    <div class="player-team__avatar">
                        <TeamAvatarBadge :teamId="team.id" />
                    </div>
                    <h3 class="text-sm text-center">{{ team.name }}</h3>
                </div>
            </section>
            <section
                class="player-badges--section"
                :class="{ 'col-6': !$q.screen.xs }"
            >
                <Badge
                    :badge="badge"
                    v-for="badge in badges"
                    :key="badge.id"
                    :showTeam="true"
                />
            </section>
        </main>
         <q-dialog v-model="editing" persistent  >
        <q-card >
          <AvataaarGenerator role="main" v-model="player.avatar"  @close="editing = false"/>
        </q-card>
    </q-dialog>
    </NuxtLayout>
</template>
<style lang="scss" scoped>
.edit-container--floating {
    position: absolute;
    top: 0;
    right: 0;
    margin: var(--space-sm);
}
.player-page__header {
    .player-avatar__wrap {
        width: min(250px, 50vw);
        margin-bottom: var(--space-sm);
    }
}
.player--info {
    padding: 0px var(--space-md);
    display: flex;
    flex-direction: column;
    @include sm {
        flex-direction: row;
    }
    margin-top: var(--space-md);
    .player-teams--section,
    .player-badges--section {
        display: flex;
        flex-wrap: nowrap;
        max-width: 100%;
        @include sm {
            max-width: 50%;

            flex-wrap: wrap;
        }
        overflow: auto;

        box-sizing: border-box;
        flex-grow: 1;
    }
    .player-teams--section {
        @include sm {
            margin-left: var(--space-sm);
        }
        .player-team__container {
            width: min-content;
            padding: var(--space-sm);
            cursor: pointer;
        }
    }
    :deep(.player-badges--section) {
        @include sm {
            margin-right: var(--space-sm);
        }
        .badge__container {
            margin-right: var(--space-sm);
        }
    }
}
</style>
<script setup>
import Player from "@/store/models/player";
import TeamPlayer from "@/store/models/team-player";
import Team from "@/store/models/team";
import {useUserStore} from '@/store/user'
import { useQuery } from "@tanstack/vue-query";

const route = useRoute();
const client = useSupabaseClient();
const $q = useQuasar();

// PLAYER INFO
const player = computed(() =>
    useRepo(Player).where("id", route.params.id).first()
);

const getPlayer = async () => {
    const { data } = await client
        .from("profiles")
        .select("*")
        .eq("id", route.params.id)
        .single();
    useRepo(Player).save(data);
    return data;
};

const { isLoading } = useQuery({
    queryKey: ["player", route.params.id],
    queryFn: getPlayer,
});

// PLAYER TEAMS

const teams = computed(() =>
    useRepo(TeamPlayer)
        .with("team")
        .where("player_id", route.params.id)
        .get()
        .map(({ team }) => team).sort((a,b) => sortAlphabetically(a.name, b.name))
);

const {sortAlphabetically} = useSort()

const getPlayerTeams = async () => {
    const { data } = await client
        .from("team_profile_junction")
        .select(
            `
        id,
        team:team_id (
            id,
            name,
            avatar_url,
            rink_id
        )
        `
        )
        .eq("profile_id", route.params.id);
    const teams = data.filter(({ team }) => !!team).map(({ team }) => team);
    useRepo(Team).save(teams);
    useRepo(TeamPlayer).save(
        teams.map((t) => ({
            team_id: t.id,
            player_id: route.params.id,
        }))
    );
    return teams
};

const { isLoading: isLoadingTeams, isSuccess: teamsDone } = useQuery({
    queryKey: ["player", "teams", route.params.id],
    queryFn: getPlayerTeams,
});

//BADGES

const dayjs = useDayjs();
const {toTimezone} = useTime()
const getBadges = async () => {
    const { data } = await client
        .from("badges")
        .select("*")
        .in(
            "team_id",
            teams.value.map(({ id }) => id)
        );
    const e = data
    .reduce((all, current) => {
        const duplicate = all.find(({name}) => name === current.name)
       
        if (duplicate) {
             const {team_id, created_at} = duplicate;
            return [
                ...all.filter(({name}) => name !== current.name), 
                {
                    ...current,
                    team_id: [...(typeof current.team_id === 'object' ? current.team_id : [current.team_id]), team_id],
                    created_at: toTimezone(current.created_at, null, false, true).unix() > toTimezone(created_at, null, false, true).unix() ? current.created_at : created_at
                }
            ]

        }
        return [...all, current];
    }, [])
    .sort((a,b) => dayjs(b.created_at).unix() - dayjs(a.created_at).unix())
    return e;
};

const badgesEnabled = computed(() => !!teams.value.length)

const { isLoading: isLoadingBadges, data: badges, isSuccess: badgesDone } = useQuery({
    queryKey: ["player", "team", "badges", route.params.id],
    queryFn: getBadges,
    enabled: badgesEnabled,
});

const pageLoaded = computed(() => !!badgesDone.value && !!teamsDone.value)

watch(pageLoaded, (val) => {
    if (!val) return;
    const {setPageLoading} = useLoading();
    setPageLoading(false)
}, {immediate: true})



const canEdit = computed(() => useUserStore().id === route.params.id)
const editing = ref(false);
</script>
<script>
export default {
    name: "Player",
};
</script>
