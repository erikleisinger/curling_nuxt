<template>
    <DialogFloating @close="toggleTeamViewer({ open: false })">
        <template v-slot:buttonLeft>
            <div>
            <q-btn flat round icon="edit" color="white" @click="isEditing = !isEditing" v-if="canEdit && !isEditing"/>
            <q-btn flat round icon="save" v-if="isEditing" @click="isEditing = !isEditing"/>
            </div>
        </template>
        <header class="column items-center header no-wrap">
            <div style="width: 100px">
                <Avataaar v-bind="parseAvatar(team?.team_avatar)"/>
            </div>
            <div class="text-md text-bold team-name">
                <q-input dense rounded outlined v-if="isEditing" label="Team name" v-model="team.name"/>
                <div v-else>{{team?.name || 'Unnamed team'}}</div>
            </div>
            </header>
            <main class="q-px-md">
                <div v-for="player in visiblePlayers.teamMembers" :key="player.id" class="row items-center justify-between">
                    <div class="row items-center">
                      <div style="width: 50px">
                    <Avataaar/>

                      </div>
                     <div class="q-ml-sm column">
                        <div >{{player.first_name}} {{player.last_name}}</div>
                    <ProfileChip :id="player.id" :username="player.username" />
                    </div>
                    </div>
                    <div v-if="!player.status">
                    <q-icon name="stars" :color="player.is_admin ? 'primary' : 'grey-4'" size="md" @click="toggleAdmin(player)" v-if="isEditing" />
                     <q-icon name="delete" color="negative" size="md" @click="removePlayer(player.id)" v-if="isEditing && !isOwner(player.id)" />

                    </div>
                    <RequestStatus v-else :requesteeId="player.id" :resourceId="teamId" :status="player.status" canEdit @cancel="cancelRequest(player.id)"/>
                    
                </div>
                <!-- Add new player -->
                <div class="row items-center justify-between" @click="toggleAddPlayer" v-if="isEditing">
                    <div class="row items-center">
                      <div style="width: 50px; aspect-ratio: 1/1" class="row items-center justify-center">
                   
                    <q-btn flat round icon="add" color="primary"/>
                      </div>
                     <div class="q-ml-sm column justify-center">
                       <div>Add new player</div>
                    </div>
                    </div>
                </div>

                <div class="q-mx-sm q-my-md row " @click="showFans = !showFans" v-if="!isEditing">
                    <div class="text-md text-bold">Followers ({{visiblePlayers?.teamFans?.length}})</div>
                    <div>
                    <q-icon  :name="showFans ? 'expand_less' : 'expand_more'" color="primary" dense size="sm"/>
                    </div>
                </div>
                <div v-if="!isEditing && showFans">
                     <div v-for="player in visiblePlayers.teamFans" :key="player.id" class="row items-center justify-between">
                    <div class="row items-center">
                      <div style="width: 50px">
                    <Avataaar/>

                      </div>
                     <div class="q-ml-sm column">
                        <div >{{player.first_name}} {{player.last_name}}</div>
                    <ProfileChip :id="player.id" :username="player.username" />
                    </div>
                    </div>
                
                    
                </div>
                </div>
            </main>
        <!-- <template v-slot:prependButton>
              <RequestStatus v-if="request && !canEdit" :initialStatus="request.status" :profileId="team.profile_id" :resourceId="team.id"  resourceType="team"/> -->
        <!-- </template> -->
        <!-- <main :style="`height: calc(100% - ${height}px); overflow: auto`">
            <TeamPlayerList :item="team" />
        </main> -->
    </DialogFloating>
</template>
<style lang="scss" scoped>
$header-height: 2em;
.result__container {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 30% 40% 30%;
}
.team-viewer__wrap {
    display: grid;
    grid-template-rows: 2em calc(40% - $header-height / 2) calc(
            60% - $header-height / 2
        );
}
.header {
    height: 30%;
    padding: var(--space-md);
    .team-name {
        margin-top: var(--space-sm)
    }
}
</style>
<script setup lang="ts">
import { useDialogStore } from "@/store/dialog";
import {useSocialStore} from '@/store/social';
import { useTeamStore } from "@/store/teams";
import {useUserTeamStore} from '@/store/user-teams'
import { useUserStore } from "@/store/user";
import { parseAvatar } from "@/utils/avatar";
import { useElementSize } from "@vueuse/core";
import Team from "@/types/team";
const editorStore = useDialogStore();

const tab = ref("stats");

const { toggleTeamViewer, toggleGlobalSearch } = editorStore;

const toggleAddPlayer = () => {
    toggleGlobalSearch({open: true, options: {
        inputLabel: 'Search for a user to add',
        resourceTypes: ['profile'],
        callback: inviteUser
    }})
}

const inviteUser = async (user) => {
    const socialStore = useSocialStore();
    await socialStore.sendTeamRequest({
        requestee_profile_id: user.profile_id,
        team_id: teamId
    })
    getPendingRequests();
}

const { format } = useTime();

const loading = ref(false);

const teamStore = useTeamStore();

const teamId = editorStore.teamViewer.team?.id;

const team = ref({
    name: null,
    team_avatar: {}
})

const isEditing = ref(false);

const visiblePlayers = computed(() => {

    const obj = {
        teamMembers: [],
        teamFans: []
    }
    teamPlayers.value.forEach((player) => {
        if (isEditing.value && player.status === 'pending') return;
        if (player.type === 'fan') {
            obj.teamFans.push(player)
        } else  {
            obj.teamMembers.push(player)
        }
    })
    return obj;
})

const teamPlayers = ref([])

const getPlayers = async () => {
    const client = useSupabaseClient();
    const {data} = await client.from('team_profile_junction').select(`
        id,
        position,
        is_admin,
        user:profile_id (
            id,
            username,
            first_name,
            last_name,
            avatar_url
        ),
        type
    `).eq('team_id', teamId)
    teamPlayers.value = data.map((p) => ({rowId: p.id, ...p, ...p.user, status: null}))
}

onBeforeMount(() => {
    if (!teamId) {
        isEditing.value = true;
        return;
    }
    team.value = teamStore.teams.find((t) => t.id === teamId) ||
        editorStore.teamViewer.team;
    
})

const canEdit = computed(() => {
    return teamPlayers.value.some((tp) => tp.id === userStore.id && tp.is_admin === true)
})

const getPendingRequests = async () => {
    const socialStore = useSocialStore();
    const requests = await socialStore.getTeamRequestsByTeam(teamId);
    teamPlayers.value = [...teamPlayers.value, ...requests.reduce((all, current) => {
        if (current.status === 'accepted') return all;
        return [...all, {
            ...current.requestee,
            status: 'pending',

        }]
    }, [])]
    
}

onMounted(async () => {
    if (!teamId) return;
    await getPlayers();
    getPendingRequests();
    
})

const userStore = useUserStore();

const togglingAdmin = ref(false)
const toggleAdmin = async (player) => {
    const {rowId, id, is_admin} = player;
    if (isOwner(id)) return;

    if (togglingAdmin.value || !canEdit.value) return;
    togglingAdmin.value = true;
    const userTeamStore = useUserTeamStore();
    await userTeamStore.updateTeamProfile(rowId, {
        is_admin
    })
    await getPlayers();
    togglingAdmin.value = false;
}

const cancelRequest = (userId) => {
    const index = teamPlayers.value.findIndex(({id}) => id === userId);
    if (index === -1) return;
    teamPlayers.value.splice(index, 1)
}


const removePlayer = async (userId) => {
    const client = useSupabaseClient();
    const {errors} = await client.from('team_profile_junction').delete().eq('profile_id', userId).eq('team_id', teamId)
    if (errors) console.error(errors);
    getPlayers();
}

const isOwner = (profile_id) => {
    if (!teamId) return false;
    return team.value?.owner?.id === profile_id
}

const showFans = ref(false)
</script>
