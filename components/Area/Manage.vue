<template>
    <h1 class="text-md text-bold q-pa-md row justify-between items-center">
        <div>My Teams</div>
        <q-fab
            direction="down"
            dense
            padding="8px"
            :persistent="false"
            icon="add"
            color="primary"
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
                            callback: onOptionClick,
                            
                            persistent: true
                        },
                    })
                "
                no-wrap
            >
            <!-- append: 'Select', -->
                            <!-- appendCallback: onSelect, -->
                Search for a team
            </q-fab-action>
        </q-fab>
    </h1>
    <div    v-for="team in teams"
        :key="team.id" class="team">
    <ProfileCard
        type="team"
        :item="team"
        :onClick="() => toggleTeamViewer({open: true, team})"
    >
       
        {{ team.name }}
        <!-- <template v-slot:append>
            <q-btn flat round :icon="team.is_admin ? 'edit' : 'visibility'" color="primary"  @click="toggleTeamViewer({open: true, team})"/>
            <q-btn
                flat
                round
                icon="delete"
                color="negative"
                @click="handleRemove(team)"
                :disable="removingTeam"
            />
           
        </template> -->
         <template v-slot:avatar>
                <TeamAvatar :team="team"/>
            </template>
    </ProfileCard>
    </div>
</template>
<style lang="scss" scoped>
    .team {
        border-bottom: 1px solid $grey-4;
        cursor: pointer;
        &:hover {
            background-color: rgba(103, 58, 183, 0.2);
        }
    }
</style>
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

const onOptionClick = (team) => {
    toggleTeamViewer({open: true, team, options: {priority: true, readOnly: true}})
   
}

const teams = computed(() => store.userTeams);

const removingTeam = ref(false);

const handleRemove = async (team) => {
    removingTeam.value = true;
    await removeTeam(team);
    removingTeam.value = false;
};
</script>
