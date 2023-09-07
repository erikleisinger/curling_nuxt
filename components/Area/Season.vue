<template>
    <div class="season__wrap">
        <main class="season-content__container">
            <div style="height: 100%">

                <div
                    v-for="team in teams"
                    :key="team.id"
                    class="team-table__item"
                >
                    <ProfileCard type="team" :item="team">
                        {{ team.name }}
                        <template v-slot:avatar>
                            <TeamAvatar :teamId="team?.id" viewable />
                        </template>
                        <template v-slot:append> </template>
                    </ProfileCard>
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
            grid-template-columns: 1fr;
            overflow: hidden;
            @include sm {
                grid-template-columns: 1fr repeat(4, $col-width);
            }
        }
    }
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import { useUserTeamStore } from "@/store/user-teams";
import { useElementBounding } from "@vueuse/core";
import Team from '@/store/models/team'

const $q = useQuasar();

const userTeamStore = useUserTeamStore();

/**
 * teams
 */

const teams = computed(() => useRepo(Team).where('id', (val) => userTeamStore.userTeams.some(({id}) => id === val)).get());

/**
 * element height calculations
 */

const header = ref(null);
const { height: headerHeight } = useElementBounding(header);
const mainHeight = computed(() => `calc(100% - ${headerHeight.value}px)`);


/**
 * BEGIN utility
 */

const { toggleGlobalSearch, toggleTeamViewer } = useDialogStore();


</script>
