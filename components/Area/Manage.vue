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
                            resourceTypes: ['team'],
                            inputLabel: 'Add team to my teams',
                            filterIds: teams.map(({id}) => id),
                            callback: onAppendClick,
                            append: 'Select',
                            appendCallback: onSelect,
                            persistent: true
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
        :item="team"
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
         <template v-slot:avatar>
                <TeamAvatar :team="team"/>
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

const onSelect = (team) => {
    const {user: userId} = useUser();
    if (!team.profile_id) return;
    if (team?.profile_id === userId.value) {
        addTeam({team, type:'member', is_admin:false})
    } else {
         addTeam({team, type:'fan', is_admin:false})
    }
    toggleGlobalSearch({open: false})
}

const onAppendClick = (team) => {
    console.log('team: ', team)
    //  toggleGlobalSearch({open:false})
    toggleTeamViewer({open: true, team, options: {priority: true}})
   
}

const teams = computed(() => store.userTeams);

const removingTeam = ref(false);

const handleRemove = async (team) => {
    removingTeam.value = true;
    await removeTeam(team);
    removingTeam.value = false;
};
</script>
