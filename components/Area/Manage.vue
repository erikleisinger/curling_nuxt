<template>
    <h1 class="text-md text-bold q-pa-md row justify-between items-center">
        <div>Manage Teams</div>
        <q-fab
            direction="down"
            dense
            padding="8px"
            :persistent="false"
            icon="add"
            vertical-actions-align="right"
        >
            <q-fab-action
                rounded
                color="primary"
                icon="add"
                @click="toggleTeamViewer({ open: true })"
                no-wrap
            >
                Create new team
            </q-fab-action>
            <q-fab-action
                rounded
                icon="search"
                color="white"
                text-color="primary"
                @click="
                    toggleGlobalSearch({
                        open: true,
                        options: {
                            inputLabel: 'Add team to my teams',
                            callback: addTeam,
                        },
                    })
                "
                no-wrap
            >
                Search for a team
            </q-fab-action>
        </q-fab>
    </h1>
    <ProfileCard
        v-for="team in teams"
        :key="team.id"
        :avatar="team.team_avatar"
    >
        <template v-slot:overline> Team </template>
        {{ team.name }}
        <template v-slot:append>
            <q-btn flat round :icon="team.is_admin ? 'edit' : 'visibility'" color="primary"  @click="toggleTeamViewer({open: true, team})"/>
            <q-btn
                flat
                round
                icon="delete"
                color="negative"
                @click="handleRemove(team)"
                :disable="removingTeam"
            />
        </template>
    </ProfileCard>
</template>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import { useDialogStore } from "@/store/dialog";

const dialogStore = useDialogStore();
const { toggleGlobalSearch, toggleTeamViewer } = dialogStore;

const store = useUserTeamStore();

const { removeTeam, addTeam } = store;

const teams = computed(() => store.userTeams);

const removingTeam = ref(false);

const handleRemove = async (team) => {
    removingTeam.value = true;
    await removeTeam(team);
    removingTeam.value = false;
};
</script>
