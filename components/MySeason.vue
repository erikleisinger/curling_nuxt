<template>
    <AreaSearch
        v-if="showSearch"
        :resourceTypes="['team']"
        inputLabel="Search for a team"
        @select="selectTeam"
        style="position: fixed; top: 0; z-index: 1000; background-color: white"
    >
        <template v-slot:before>
            <q-btn flat round icon="close" @click="showSearch = false" />
        </template>
    </AreaSearch>
    <div class="season__wrap">
        <!-- <header ref="header">
            <div class="q-pa-lg bg-primary">
                <h1 class="text-xl text-bold full-width text-center text-white">
                    2023-2024 Season
                </h1>
                <h2 class="text-md full-width text-center">
                    <ProfileChip
                        :id="userStore.id"
                        :username="userStore.username"
                    />
                </h2>
            </div>
        </header> -->
        <main class="season-content__container">
            <div style="height: 100%">
                <!-- <div class="team-table__item">
                    <div class="text-center">Team</div>
                    <div class="text-center">WLT</div>
                    <div class="text-center" v-if="$q.screen.gt.xs">P/G</div>
                    <div class="text-center" v-if="$q.screen.gt.xs">HE</div>
                    <div class="text-center">More</div>
                </div> -->
                <div
                    v-for="team in teams"
                    :key="team.id"
                    class="team-table__item"
                >
                    <ProfileCard type="team" :item="team">
                        {{ team.name }}
                        <template v-slot:avatar>
                            <TeamAvatar :team="team" />
                        </template>
                        <template v-slot:append> </template>
                    </ProfileCard>
                    <!-- <div class="row justify-center" >
                        <ChartTeamWinLoss
                            v-if="!loading"
                            :wins="team.wins ?? 0"
                            :losses="team.losses ?? 0"
                            :ties="team.ties ?? 0"
                        />
                    </div>
                    <div class="row justify-center" v-if="$q.screen.gt.xs">
                        <ChartTeamPointsPerGame
                            v-if="!loading"
                            :for="team.points_for"
                            :against="team.points_against"
                            :labels="false"
                        />
                    </div>
                    <div class="row justify-center" v-if="$q.screen.gt.xs">
                        <ChartTeamHammerEfficiency
                            v-if="!loading"
                            :for="team.hammer_conversion_count"
                            :forces="team.hammer_force_count"
                            :steals="team.hammer_steal_count"
                            :teamId="team.id"
                            :totalEnds="team.hammer_end_count"
                        />
                    </div> -->
                    <!-- <div class="row items-center q-px-sm justify-center">
                        <q-btn
                            icon="read_more"
                            flat
                            round
                            color="primary"
                            @click="viewTeam(team.id)"
                        />
                    </div> -->
                </div>
                <div class="team-table__item" style="overflow: visible">
                    <ProfileCard>
                        Add team
                        <template v-slot:avatar>
                            <q-fab
                                direction="down"
                                dense
                                padding="8px"
                                :persistent="false"
                                icon="add"
                                color="primary"
                                vertical-actions-align="left"
                            >
                                <q-fab-action
                                    rounded
                                    color="primary"
                                    icon="add"
                                    @click="toggleTeamViewer({ open: true })"
                                    no-wrap
                                    ref="buttonOption"
                                    style="width: fit-content"
                                    label="Create new team"
                                >
                                </q-fab-action>
                                <q-fab-action
                                    rounded
                                    icon="search"
                                    color="white"
                                    text-color="primary"
                                    label="Search for a team to join"
                                    @click="
                                        toggleGlobalSearch({
                                            open: true,
                                            options: {
                                                resourceTypes: ['team'],
                                                inputLabel:
                                                    'Search for a team to join',
                                                filterIds: teams.map(
                                                    ({ id }) => id
                                                ),
                                                callback: (team) => {
                                                    toggleTeamViewer({
                                                        open: true,
                                                        team,
                                                        options: {
                                                            priority: true,
                                                        },
                                                    });
                                                },

                                                persistent: true,
                                            },
                                        })
                                    "
                                    no-wrap
                                >
                                </q-fab-action>
                            </q-fab>
                        </template>
                        <template v-slot:append> </template>
                    </ProfileCard>
                </div>
            </div>
        </main>
    </div>
</template>
<style lang="scss" scoped>
$col-width: 80px;
.season__wrap {
    height: 100%;
    overflow: auto;
    .season-content__container {
        min-height: v-bind(mainHeight);
        height: v-bind(mainHeight);
        overflow: auto;
        position: relative;
        max-width: 100%;
        .team-table__item {
            display: grid;
            grid-template-columns: 1fr repeat(2, $col-width);
            overflow: hidden;
            @include sm {
                grid-template-columns: 1fr repeat(4, $col-width);
            }
        }
    }
}
</style>
<script setup>
import { useUserStore } from "@/store/user";
import { useDialogStore } from "@/store/dialog";
import { useUserTeamStore } from "@/store/user-teams";
import { useElementBounding } from "@vueuse/core";

const $q = useQuasar();

const viewTeam = (teamId) => {
    return navigateTo(`teams/${teamId}`);
};

const userTeamStore = useUserTeamStore();

const loading = ref(false);

/**
 * team records
 */

const wins = ref(0);
const losses = ref(0);
const ties = ref(0);

const winLossRecord = ref([]);

const getWinsLosses = async () => {
    const { client, fetchHandler } = useSupabaseFetch();
    const { data } = await fetchHandler(
        () =>
            client.rpc("get_team_wins", {
                team_ids_param: teams.value.map(({ id }) => id),
            }),
        { onError: "Error fetching data" }
    );
    data.forEach((record) => {
        const index = teams.value.findIndex(({ id }) => id === record.team_id);
        if (index === -1) return;
        teams.value.splice(index, 1, {
            ...teams.value[index],
            ...record,
        });
    });

    winLossRecord.value = data;
};

/**
 * teams
 */

const teams = computed(() => userTeamStore.userTeams);

/**
 * init
 */

const init = async () => {
    loading.value = true;

    const teamIds = teams.value.map(({ id }) => id);
    if (!teamIds || !teamIds?.length) {
        games.value = [];
    } else {
        await getWinsLosses()
    }

    loading.value = false;
};

onMounted(async () => {
    init();
});

/**
 * element height calculations
 */

const header = ref(null);
const { height: headerHeight } = useElementBounding(header);
const mainHeight = computed(() => `calc(100% - ${headerHeight.value}px)`);

/**
 * profile information
 */

const userStore = useUserStore();

/**
 * BEGIN utility
 */

const { toggleGlobalSearch, toggleTeamViewer } = useDialogStore();

const { logout } = useSession();

const showSearch = ref(false);

const selectTeam = (team) => {
    showSearch.value = false;
    addTeam(team);
};
</script>
