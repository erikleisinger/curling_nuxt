<template>
    <NuxtLayout>
        
           <div class="logout-container--floating" v-if="canEdit">
            <q-btn flat round icon="logout" @click="logout"/>
        </div>
        <header class="player-page__header column justify-center items-center">
            <div class="player-avatar__wrap " :class="{clickable: canEdit}" @click="onClickAvatar">
                <Avataaar v-bind="player.avatar" v-if="!isLoading" />
                
            </div>
            <h2 class="text-lg text-bold text-center">
                {{ player.first_name }} {{ player.last_name }}
            </h2>
            <h3 class="text-sm">@{{ player.username }}</h3>
            <h3 class="text-sm">
                <q-icon name="location_on" color="red" />
                <span>
                {{rink?.name || 'No home rink'}}
                </span>
                <q-btn icon="edit" flat round dense @click="searchRink" size="xs"/>
           
            </h3>
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
                    
                        <LazyTeamAvatarBadge :teamId="team.id" />
                    </div>
                    <h3 class="text-sm text-center truncate-text" style="max-width: 100px">{{ team.name }}</h3>
                </div>
            </section>

            <section
                class="player-badges--section"
                :class="{ 'col-6': !$q.screen.xs }"
            >
                <LazyBadge
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
.logout-container--floating {
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
        margin-bottom: var(--space-md);
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
            height: min-content;
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
import Rink from '@/store/models/rink'
import {useUserStore} from '@/store/user'
import { useQuery } from "@tanstack/vue-query";
import {useDialogStore} from '@/store/dialog'

const { logout } = useSession();

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

const teamsDone = ref(false)

const { isLoading: isLoadingTeams } = useQuery({
    queryKey: ["player", "teams", route.params.id],
    queryFn: getPlayerTeams,
    select: (val) => {
        teamsDone.value = true;
        return val
    }
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
             const isDuplicateArray = typeof team_id === 'object'           
            return [
                ...all.filter(({name}) => name !== current.name), 
                {
                    ...current,
                    team_id: [...(isDuplicateArray ? team_id : [team_id]), ...((isDuplicateArray && duplicate.team_id?.includes(current.team_id) || duplicate.team_id === current.team_id) ? [] : [current.team_id])],
                    created_at: toTimezone(current.created_at, null, false, true).unix() > toTimezone(created_at, null, false, true).unix() ? current.created_at : created_at
                }
            ]

        }
        return [...all, current];
    }, [])
    .sort((a,b) => dayjs(b.created_at).unix() - dayjs(a.created_at).unix())
    return e;
};

const badgesEnabled = computed(() => !!teamsDone.value)
const badgesDone = ref(false)

const { isLoading: isLoadingBadges, data: badges } = useQuery({
    queryKey: ["player", "team", "badges", route.params.id],
    queryFn: getBadges,
    enabled: badgesEnabled,
    select: (val) => {
         badgesDone.value = true;
        return val;
    }
  
});

const pageLoaded = computed(() => (!badgesEnabled.value || !!badgesDone.value) && !!teamsDone.value)

watch(pageLoaded, (val) => {
    if (!val) return;
    const {setLoading} = useLoading();
    setTimeout(() => {
    setLoading(false)
    }, 50)

}, {immediate: true})



const canEdit = computed(() => useUserStore().id === route.params.id)
const editing = ref(false);

const rink = computed(() => useRepo(Rink).where('id', player.value.rink_id).first())

const {toggleGlobalSearch} = useDialogStore();

const searchRink = () => {
    if (!canEdit.value) return;
    toggleGlobalSearch({
        open: true,
        options: {
            inputLabel: "Search for a rink",
            resourceTypes: ["rink"],
            callback: async (selection) => {
                const client = useSupabaseClient();
                await client.from('profiles').update({
                    rink_id: selection.id
                }).eq('id', player.value.id)
                await useUserStore().getCurrentUser();
            },
        },
    });
};

const onClickAvatar = () => {
    if (!canEdit.value) return;
    editing.value = true;
}
</script>
<script>
export default {
    name: "Player",
};
</script>
