<template>
    <div class="season__wrap">
        <header class="season__header row justify-between no-wrap align-center">
            <h1 class="text-md text-bold row justify-between items-center">
                My teams
            </h1>
            <q-btn flat round icon="add" dense @click="newTeamOpen = true" />
        </header>
        <q-separator />
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
            </div>
        </main>
    </div>
    <q-dialog v-model="newTeamOpen" persistent>
        <q-card class="team-details__viewer">
            <TeamPageDetails @back="newTeamOpen = false" />
        </q-card>
    </q-dialog>
</template>
<style lang="scss" scoped>
$col-width: 80px;
.team-details__viewer {
    width: min(100vw, 500px);
    height: min(100vh, 600px);
}
.season__wrap {
    height: 100%;
    overflow: auto;
    .season__header {
        padding: var(--space-sm);
    }
    .season-content__container {
        overflow: hidden;
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
    .team-request__container {
        padding: var(--space-xs);
    }
}
</style>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import Team from "@/store/models/team";
import { useQuery } from "@tanstack/vue-query";

const $q = useQuasar();

const userTeamStore = useUserTeamStore();

const newTeamOpen = ref(false);

/**
 * teams
 */

const teams = computed(() =>
    useRepo(Team)
        .where("id", (val) =>
            userTeamStore.userTeams.some(({ id }) => id === val)
        )
        .get()
);

/**
 * element height calculations
 */
</script>
