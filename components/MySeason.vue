<template>
  <AreaSearch
                v-if="showSearch"
                :resourceTypes="['team']"
                inputLabel="Search for a team"
                @select="selectTeam"
            />
    <header ref="header">
        <div class="profile__wrap full-width">
            <ProfileCard :avatar="user.avatar">
                {{ user.firstName }} {{ user.lastName }}
                <template v-slot:subtitle> @{{ user.username }} </template>
                <template v-slot:append>
                    <q-btn
                        flat
                        round
                        icon="logout"
                        @click="logout"
                        color="deep-purple"
                    />
                </template>
            </ProfileCard>
        </div>
    </header>
    <main class="season-content__container" ref="seasonContainer">
 
        <div class="column teams__container" ref="teamContainer">
            <div class="teams-title" :class="{mini: isMini}">My Teams</div>
            <div class="row no-wrap teams__scroller" :class="{ mini: isMini }">
                <div
                    v-for="team in teams"
                    :key="team.id"
                    class="column items-center no-wrap team__container"
                    @click="setVisibleTeam(team.id)"
                    :class="{ selected: visibleTeams.includes(team.id) }"
                >
                    <div class="avatar-container">
                        <Avataaar v-bind="parseAvatar(team.team_avatar)" />
                    </div>
                    <div class="team-name truncate-text">{{ team.name }}</div>
                </div>
                <div class="column items-center no-wrap team__container">
                        <q-btn round icon="add" color="deep-purple" @click="showSearch = true"/>
                </div>
            </div>
        </div>
        <!--  -->
        <div  :style="{height: scrollerHeight}" v-bind="containerProps" >
             <!--  -->
            <div v-bind="wrapperProps" >
                <TeamGameResult
                    v-for="{data: game} in list"
                    :key="game.id"
                    :result="game"
                    @click="expanded = game.id"
                    :expanded="expanded === game.id"
                >
                <div style="position: absolute; height: 100%; width: 100%; pointer-events: all; z-index: 1" @click="viewTeam"/>
                </TeamGameResult>
            </div>
        </div>
    </main>
</template>
<style lang="scss" scoped>
.profile__wrap {
    padding: var(--space-sm);
    border-bottom: 1px solid $grey-4;
}
.season-content__container {
    height: v-bind(mainHeight);
    overflow: auto;
    position: relative;
    .teams__container {
        position: sticky;
        top: 0;
        z-index: 1;
        background-color: white;
        width: 100vw;
        .teams-title {
            margin: var(--space-xxs) var(--space-sm) 0px var(--space-sm);
           
            font-weight: bold;
            font-size: var(--text-md);
            transition: all 0.2s;
            overflow: hidden;
            &.mini {
                max-height: 0px;
                margin: unset;
            }
        }
 .teams__scroller {
        overflow-x: auto;
         width: inherit;
    
        padding: var(--space-xs);

        .team__container {
            max-width: 100px;
            transition: all 0.2s;
            padding: var(--space-xs);
            margin: 0px var(--space-xxxxs);
            .team-name {
                width: 100%;
                max-height: auto;
                transition: all 0.2s;
                font-size: var(--text-sm);
            }
            .avatar-container {
                width: 40px;
                transition: all 0.2s;
            }
            &.selected {
                background-color: rgba(255, 86, 252, 0.2);
                border-radius: 8px;
            }
        }

        &.mini {
            padding: var(--space-xxxxs);
            padding-bottom: 0px;
            .team_container {
                max-width: 4ch;
            }
            .team-name {
                max-height: 0px;
                width: 0px;
            }
            .avatar-container {
                width: 40px;
            }
        }
    }
    }
 
}
  .team-viewer__container {
    position: absolute;
    height: 100px;
    width: 100px;
    background-color: red;
    z-index: $z-dialog;
   }
</style>
<script setup>
import { useUserStore } from "@/store/user";
import { useElementBounding, useScroll, useThrottleFn, useVirtualList } from "@vueuse/core";
import { parseAvatar } from "@/utils/avatar";

const loading = ref(false);



const visibleTeams = ref([]);

const setVisibleTeam = (teamId) => {
    const index = visibleTeams.value.findIndex((id) => id === teamId);
    if (index !== -1) {
        visibleTeams.value.splice(index, 1);
    } else {
        visibleTeams.value.push(teamId);
    }
      
};

const visibleGames = computed(() => {
    if (!visibleTeams?.value?.length) return games.value ?? [];
    return [...games.value].filter((game) => {
        return (
            visibleTeams.value.includes(game.home_id) ||
            visibleTeams.value.includes(game.away_id)
        );
    });
});

/**
 * BEGIN games
 */

const getUserTeams = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("team_profile_junction")
        .select(
            `
        team:team_id (
            id,
            name,
            team_avatar
        )
    `
        )
        .eq("profile_id", user.value.id);
    if (!data || !data?.length) return [];
    return data.map(({ team }) => team);
};

const games = ref([]);
const teams = ref(null);

onMounted(async () => {
    loading.value = true;
    teams.value = await getUserTeams();
    const teamIds = teams.value.map(({ id }) => id);
    if (!teamIds || !teamIds?.length) return;
    const { getTeamGames } = useGame();

    const gameResults = await Promise.all(
        teamIds.map((id) => getTeamGames(id))
    );
    games.value = gameResults.flat().reduce((all, current) => {
        if (all.some(({id}) => id === current.id)) return all;
        return [...all, current]
    }, [])
    loading.value = false;
});

/**
 * END games
 */

/**
 * BEGIN element height calculations
 */

const header = ref(null);
const { height: headerHeight } = useElementBounding(header);
const mainHeight = computed(() => `calc(100% - ${headerHeight.value}px)`);

const teamContainer = ref(null);
const {height: teamContainerHeight} = useElementBounding(teamContainer)
const scrollerHeight = computed(() => `calc(100% - ${teamContainerHeight.value}px)`)

/**
 * END element height calculations
 */

/**
 * BEGIN profile information
 */

const userStore = useUserStore();
const user = computed(() => {
    const {
        id,
        timezone,
        friendId,
        username,
        player,
        firstName,
        lastName,
        avatar,
    } = userStore;
    return {
        id,
        timezone,
        friendId,
        username,
        player,
        firstName,
        lastName,
        avatar,
    };
});

/**
 * END profile information
 */

/**
 * BEGIN utility
 */

const { logout } = useSession();

/**
 * END utility
 */

/**
 * BEGIN scroll
 */

const isMini = ref(false)

const setMini = useThrottleFn((bool) => {
    isMini.value = bool;
}, 100)

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  visibleGames,
  {
    itemHeight: 125,
    overscan: 3,
  },
)

const { y,  } = useScroll(containerProps?.ref, {onScroll: () => {
    const mini = y.value > 100;
    if (mini == isMini.value) return;
    setMini(y.value > 100)
}});

/**
 * END scroll
 */

const showSearch = ref(false);

const selectTeam = (team) => {
    console.log('SELECT: ', team)
}

</script>
