<template>
    <h1 class="text-md text-bold q-pa-md row justify-between items-center">
        <!-- <div class="no-teams__text--floating" v-if="!teams.length"></div> -->
        <div>My Teams</div>
   
            <HelpOverlay v-if="!teams.length" :element="helpElement">
                {{helpText}}
            </HelpOverlay>
                 <div ref="addButtonContainer" >
        <q-fab
            direction="down"
            dense
            padding="8px"
            :persistent="false"
            icon="add"
            color="primary"
            vertical-actions-align="right"
            v-model="buttonOpen"
            :class="{'help--highlight help--animation': helpElement === addButtonContainer && !teams.length}"
        >
            <q-fab-action
                rounded
                color="primary"
                icon="add"
                @click="toggleTeamViewer({ open: true })"
                no-wrap
                ref="buttonOption"
                style="width: fit-content"
                  :class="{'help--highlight help--animation': !teams.length}"
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
                            filterIds: teams.map(({ id }) => id),
                            callback: onOptionClick,

                            persistent: true,
                        },
                    })
                "
                no-wrap
                    :class="{'help--highlight help--animation': !teams.length}"
            >
                <!-- append: 'Select', -->
                <!-- appendCallback: onSelect, -->
                Search for a team
            </q-fab-action>
        </q-fab>
        </div>
    </h1>

    <div v-for="team in teams" :key="team.id" class="team">
        <ProfileCard
            type="team"
            :item="team"
            :onClick="() => toggleTeamViewer({ open: true, team })"
        >
            {{ team.name }}
            <template v-slot:avatar>
                <TeamAvatar :team="team" />
            </template>
        </ProfileCard>
    </div>

<!-- NO TEAMS helper -->
    
</template>
<style lang="scss" scoped>
.team {
    border-bottom: 1px solid $grey-4;
    cursor: pointer;
    &:hover {
        background-color: rgba(103, 58, 183, 0.2);
    }
}
.no-teams__text--floating {
    position: absolute; 
    color: white; 
    z-index: 1; 
    right: 75px;
    margin-left: var(--space-sm);
    background-color: rgba(0,0,0,0.8);
    border-radius: 8px;
    padding: var(--space-xs);
}

</style>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import { useDialogStore } from "@/store/dialog";
import {useElementBounding} from '@vueuse/core'

const dialogStore = useDialogStore();
const { toggleGlobalSearch, toggleTeamViewer, teamViewer, globalSearch } = dialogStore;

const store = useUserTeamStore();

const { removeTeam, addTeam } = store;

const onSelect = (team) => {
    const { user: userId } = useUser();
    if (!team.profile_id) return;
    if (team?.profile_id === userId.value) {
        addTeam({ team, type: "member", is_admin: false });
    } else {
        addTeam({ team, type: "fan", is_admin: false });
    }
    toggleGlobalSearch({ open: false });
};

const onOptionClick = (team) => {
    toggleTeamViewer({
        open: true,
        team,
        options: { priority: true, readOnly: true },
    });
};

const teams = computed(() => store.userTeams);

const removingTeam = ref(false);

const handleRemove = async (team) => {
    removingTeam.value = true;
    await removeTeam(team);
    removingTeam.value = false;
};
const addButtonContainer =  ref(null)
const pos = useElementBounding(addButtonContainer)

const buttonOpen = ref(false)

const buttonOption = ref(null)

const helpText = computed(() => {
    if (teams.value.length) return null;
    if (!buttonOpen.value) return "It looks like you don't have any teams. Let's get you one!"
    if (buttonOpen.value) return "If someone you know has already created a team, then you can search for it. Otherwise, create a new one!"
})

const helpElement = computed(() => {
    if (teamViewer.open || globalSearch.open) return null;
    if (!buttonOpen.value) return addButtonContainer.value;
    return buttonOption.value
})
</script>
