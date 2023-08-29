<template>
    <DialogConfirmation
        v-if="!!confirmUnsaved"
        confirmButtonText="Discard"
        cancelButtonText="Cancel"
        @confirm="toggleTeamViewer({ open: false })"
        @close="confirmUnsaved = false"
        cancelColor=""
        confirmColor="negative"
    >
        Are you sure you want to close? All unsaved changes will be lost.
    </DialogConfirmation>
    <DialogConfirmation
        v-if="!!playerToRemove"
        confirmButtonText="Leave team"
        cancelButtonText="Cancel"
        @confirm="removePlayer"
        @close="playerToRemove = false"
        cancelColor=""
        confirmColor="negative"
    >

       Are you sure you want to remove {{playerToRemove?.name}} from the team?
  
    
    </DialogConfirmation>
    <DialogFloating
        :priority="!!options.priority"
        :loading="saving || loading"
        maxHeight="700px"
        maxWidth="500px"
    >
        <template v-slot:title>
            {{
                !teamId ? "Create team" : !isEditing ? "View team" : "Edit team"
            }}
        </template>
        <template v-slot:header>
            <div
                class="request-notification__header"
                v-if="pendingUserRequest || pendingUserInvite"
            >
                <div v-if="pendingUserInvite" class="column">
                    <div class="q-mb-sm">
                        {{ team.name }} has invited you to join their team.
                    </div>
                    <div class="row justify-between">
                        <q-btn color="negative" @click="respondToRequest(pendingUserInvite.requestId, 'rejected')">Reject</q-btn>
                        <q-btn color="positive" @click="respondToRequest(pendingUserInvite.requestId, 'accepted')">Accept</q-btn>
                    </div>
                </div>
                <div v-else-if="pendingUserRequest">
                    Your request to join {{ team.name }} has been sent and is
                    waiting for team response.
                </div>
            </div>
        </template>
        <template v-slot:buttonRight>
            <q-btn flat round icon="close" @click="handleClose" />
        </template>
        <div class="menu-button__wrap">
            <q-fab
                direction="down"
                dense
                padding="8px"
                :persistent="false"
                icon="more_vert"
                color="primary"
                vertical-actions-align="left"
                flat
                v-model="menuOpen"
            >
           
             
                <q-fab-action
                    color="primary"
                    @click="isEditing = true"
                    icon="edit"
                    label="Edit team"
                    v-if="canEdit"
                />
                     <q-fab-action
                    color="primary"
                       @click="toggleAddPlayer"
                    icon="person_add"
                    label="Invite player"
                    v-if="canEdit"
                />
                <q-fab-action
                    color="primary"
                    icon="mail"
                    label="Request to join"
                    v-if="!isOnTeam && !pendingUserRequest"
                    @click="requestToJoin"
                />
                <q-fab-action
                    color="secondary"
                    icon="person_remove"
                    label="Leave team"
                    v-if="isOnTeam && canRemovePlayer(userStore.id)"
                    @click="playerToRemove = {
                        id: userStore.id,
                        name: 'yourself'
                    }"
                />
            </q-fab>
        </div>
        <header class="column items-center header no-wrap">
            <div style="width: 100px; position: relative; aspect-ratio: 1/1">
                <div
                    class="avatar-upload__overlay row items-center justify-center"
                    v-if="isEditing"
                    :class="{
                        upload: team?.avatar_type !== 'avataaar',
                        avataaar: team?.avatar_type === 'avataaar',
                    }"
                >
                    <q-fab
                        flat
                        round
                        icon="edit"
                        color="white"
                        direction="down"
                        :persistent="false"
                    >
                        <q-fab-action
                            rounded
                            color="primary"
                            icon="add"
                            no-wrap
                        >
                            <UploaderDraft
                                @upload="onAvatarUpload"
                                resourceType="team"
                                :resourceId="teamId"
                                :emitOnly="true"
                            />
                            Upload new image
                        </q-fab-action>
                        <q-fab-action
                            rounded
                            color="primary"
                            icon="add"
                            no-wrap
                            @click="selectPlayerAvatarMode = true"
                            v-if="visiblePlayers?.teamMembers?.length"
                        >
                            Select player avatar
                        </q-fab-action>
                    </q-fab>
                </div>
                <Avataaar
                    v-bind="
                        typeof team?.team_avatar === 'object'
                            ? team?.team_avatar
                            : parseAvatar(team?.team_avatar)
                    "
                    v-if="team?.avatar_type === 'avataaar'"
                />
                <div
                    v-if="team?.avatar_type === 'upload'"
                    class="avatar-uploaded__container"
                >
                    <q-img
                        :src="avatarUrl"
                        spinner-color="white"
                        height="100%"
                    ></q-img>
                </div>
            </div>
            <div class="text-md text-bold team-name">
                <q-input
                    dense
                    rounded
                    outlined
                    v-if="isEditing"
                    label="Team name"
                    v-model="team.name"
                />
                <div v-else>{{ team?.name || "Unnamed team" }}</div>
            </div>
        </header>
        <main class="q-px-md">
            <div class="text-md text-bold q-my-md q-mx-sm">
                Team members ({{ visiblePlayers?.teamMembers?.length }})
            </div>
            <div
                v-for="player in visiblePlayers.teamMembers"
                :key="player.id"
                class="row items-center player__container"
            >
            <div v-if="isEditing">
                
                <q-btn icon="person_remove" color="red" flat round @click="playerToRemove = {
                    id: player.id,
                    name: `${player.first_name} ${player.last_name}`
                }" :disable="!canRemovePlayer(player.id)">
                    <q-tooltip v-if="!canRemovePlayer(player.id)">
                        Can't remove the only admin on the team
                    </q-tooltip>
                </q-btn>
            </div>
                <div
                    style="width: 50px"
                    class="member-avatar__wrap"
                    @click="handlePlayerAvatarClick(player)"
                >
                    <div
                        style="width: inherit"
                        class="member-avatar__container"
                    >
                        <div
                            class="avatar-highlight--helper"
                            :class="{
                                'help--highlight help--animation':
                                    selectPlayerAvatarMode,
                            }"
                        />
                        <Avataaar
                            v-bind="player.avatar"
                            class="player-avatar"
                            :class="{
                                'help--animation': selectPlayerAvatarMode,
                            }"
                        />
                    </div>
                </div>
                <div class="q-ml-sm" style="display: inherit">
                    <div class="truncate-text">
                        {{ player.first_name }} {{ player.last_name }}
                        <!-- <span class="text-sm">@{{player.username}}</span> -->
                    </div>
                    <div>
                        <ProfileChip
                            :id="player.id"
                            :username="player.username"
                        />
                    </div>
                </div>

                <div class="column items-end">
                    <TeamPositionChip
                        :canEdit="isEditing"
                        position="skip"
                        v-model="player.position"
                    />

                    <TeamAdminChip
                        :canEdit="isEditing && player.id !== userStore.id"
                        v-model="player.is_admin"
                        v-if="isEditing || player.is_admin"
                    />
                </div>
            </div>


            <div
                class="q-mx-sm q-my-md row"
                @click="showPendingInvites = !showPendingInvites"
                v-if="canEdit"
            >
                <div class="text-md text-bold">Pending Invitations ({{pendingInvites?.length}})</div>
                <div>
                    <q-icon
                        :name="
                            showPendingInvites ? 'expand_less' : 'expand_more'
                        "
                        color="primary"
                        dense
                        size="sm"
                    />
                </div>
            </div>
            <div v-if="showPendingInvites && canEdit">
                <div
                    v-for="player in pendingInvites"
                    :key="player.id"
                    class="row items-end justify-between"
                >
                    <div class="row items-center">
                        <div style="width: 50px">
                            <Avataaar />
                        </div>
                        <div class="q-ml-sm column">
                            <div>
                                {{ player.first_name }} {{ player.last_name }}
                            </div>
                            <ProfileChip
                                :id="player.id"
                                :username="player.username"
                            />
                        </div>
                    </div>
                    <div class="row items-center">
                        <InvitationStatus
                        resourceType="team"
                        :canEdit="canEdit"
                        :invitation="player"
                        @cancel="cancelInvite(player.id)"
                        />
                    </div>
                </div>
            </div>
            <div
                class="q-mx-sm q-my-md row"
                @click="showRequests = !showRequests"
                v-if="canEdit"
            >
                <div class="text-md text-bold">Requests to join ({{pendingRequests?.length}})</div>
                <div>
                    <q-icon
                        :name="showRequests ? 'expand_less' : 'expand_more'"
                        color="primary"
                        dense
                        size="sm"
                    />
                </div>
            </div>
            <div v-if="canEdit && showRequests">
                <div
                    v-for="player in pendingRequests"
                    :key="player.id"
                    class="row items-end justify-between"
                >
                    <div class="row items-center">
                        <div style="width: 50px">
                            <Avataaar />
                        </div>
                        <div class="q-ml-sm column">
                            <div>
                                {{ player.first_name }} {{ player.last_name }}
                            </div>
                            <ProfileChip
                                :id="player.id"
                                :username="player.username"
                            />
                        </div>
                    </div>
                    <div class="row items-center">
             
                        <q-btn dense rounded icon="close" color="red" stretch @click="respondToRequest(player.requestId, 'rejected')"/>
                                   <q-btn dense rounded icon="check" color="green" stretch class="q-ml-sm" @click="respondToRequest(player.requestId, 'accepted')"/>
                       
                    </div>
                </div>
            </div>
        </main>
        <template v-slot:footer v-if="isEditing">
            <div class="row full-width">
            <q-btn color="red" stretch @click="discardChanges" icon="close" class="col-6" size="lg"/>
            <q-btn color="green" stretch @click="saveNewTeam" icon="check" class="col-6" size="lg"/>
            </div>
        </template>
    </DialogFloating>
</template>
<style lang="scss" scoped>
.request-notification__header {
    background-color: $green;
    color: white;
    display: flex;
    justify-content: center;
    padding: var(--space-sm);
    font-weight: bold;
}
.menu-button__wrap {
    position: absolute;
    top: 0;
    left: 0;
    margin: var(--space-sm);
}
.selection__menu {
    background-color: rgba(0, 0, 0, 0.5);
}
.player__container {
    display: grid;
    grid-template-columns: min-content 50px auto max-content;
    max-width: 100%;
}
.header {
    height: fit-content;
    padding: var(--space-md);
    padding-top: var(--space-lg);
    .team-name {
        margin-top: var(--space-sm);
    }
}
.avatar-upload__overlay {
    position: absolute;

    &.avataaar {
        margin-top: calc(100% * 0.05 * -1);
        aspect-ratio: 1/1;
        width: calc(100% - 0.2em);
    }
    &.upload {
        height: 100%;
        width: 100%;
    }
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1;
    border-radius: 50%;
}
.avatar-uploaded__container {
    width: 100px;
    aspect-ratio: 1/1;
    background-color: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 50px;
    overflow: hidden;
}
.member-avatar__wrap {
    position: relative;
    aspect-ratio: 1/1;
    overflow: visible;
    .member-avatar__container {
        overflow: visible;
        transition: all 0.2s;
        cursor: pointer;
        &:hover {
            transform: scale(1.2);
            .help--animation {
                animation: unset;
            }
        }

        &:not(:hover) {
            .avatar-highlight--helper {
                height: 80%;
                bottom: 0;
                top: 0;
                left: 0;
                right: 0;
                margin: auto;
                width: 80%;
                position: absolute;
                border-radius: 50%;
            }
        }
    }
}
.team-viewer__footer {
    :deep(.q-btn) {
        &:not(:nth-child(1)) {
            border-left: 1px solid rgba(0, 0, 0, 0.2);
        }
    }
}
</style>
<script setup lang="ts">
import { useDialogStore } from "@/store/dialog";
import { useTeamRequestStore } from "@/store/team-requests";
import { useTeamStore } from "@/store/teams";
import { useUserTeamStore } from "@/store/user-teams";
import { useUserStore } from "@/store/user";
import { parseAvatar } from "@/utils/avatar";
import Team from "@/types/team";
import { vElementHover } from "@vueuse/components";
const dialogStore = useDialogStore();

const tab = ref("stats");

const { toggleTeamViewer, toggleGlobalSearch } = dialogStore;

const teamRequestStore = useTeamRequestStore();

const { sendTeamRequest, updateTeamRequestStatus } = teamRequestStore;

/**
 * STORES
 */

const userStore = useUserStore();
const teamStore = useTeamStore();

/**
 * VARS
 */

const loading = ref(false);
const isEditing = ref(false);
const editing = ref(null);
const confirmUnsaved = ref(false);
const playerToRemove = ref(false);
const menuOpen = ref(false)
const { options } = dialogStore.teamViewer;
const teamId = dialogStore.teamViewer.team?.id;
const team = ref({
    name: null,
    team_avatar: {},
});
const teamPlayers = ref([]);

const showPendingInvites = ref(true);
const showRequests = ref(true);

const visiblePlayers = computed(() => {
    const obj = {
        teamMembers: [],
    };
    teamPlayers.value.forEach((player) => {
        obj.teamMembers.push(player);
    });
    if (!teamId) {
        obj.teamMembers = [...obj.teamMembers, ...newTeamPlayers.value];
    }
    return obj;
});


/**
 * INIT
 */

onMounted(async () => {
    loading.value = true;
    if (!teamId) {
        isEditing.value = true;
        getPlayers();
    } else {
        await getTeam(teamId);
        await getPlayers();
        await getPendingRequests();
    }
    loading.value = false;
});

/**
 * FETCH
 */

const pendingInvites = ref([]);
const pendingRequests = ref([]);

const getPendingRequests = async () => {
    const fetchedRequests = await teamRequestStore.getTeamRequestsByTeam(
        teamId
    );
    const { invs, reqs } = fetchedRequests.reduce(
        (all, current) => {
            if (current.status === "accepted") return all;
            console.log(current);
            if (current?.requestee && current.requestee?.id) {
                return {
                    ...all,
                    invs: [
                        ...all.invs,
                        {
                            requestId: current.id,
                            ...current.requestee,
                            avatar: current.requestee.avatar
                                ? JSON.parse(current.requestee.avatar)
                                : {},
                            status: "pending",
                        },
                    ],
                };
            } else if (current.requester) {
                return {
                    ...all,
                    reqs: [
                        ...all.reqs,
                        {
                            requestId: current.id,
                            ...current.requester,
                            avatar: current.requester.avatar
                                ? JSON.parse(current.requester.avatar)
                                : {},
                            status: "pending",
                        },
                    ],
                };
            }
            return all;
        },
        { invs: [], reqs: [] }
    );
    pendingInvites.value = invs;
    pendingRequests.value = reqs;
};

const getPlayers = async () => {
    if (!teamId) {
        teamPlayers.value = [
            {
                rowId: 0,
                id: userStore.id,
                is_admin: true,
                type: "member",
                avatar: userStore.avatar ? JSON.parse(userStore.avatar) : null,
                username: userStore.username,
                first_name: userStore.first_name,
                last_name: userStore.last_name,
            },
        ];
    } else {
        const client = useSupabaseClient();
        const { data } = await client
            .from("team_profile_junction")
            .select(
                `
        id,
        position,
        is_admin,
        user:profile_id (
            id,
            username,
            first_name,
            last_name,
            avatar
        ),
        type
    `
            )
            .eq("team_id", teamId);

        teamPlayers.value = data.map((p) => ({
            rowId: p.id,
            ...p,
            ...p.user,
            status: null,
            avatar: p.user.avatar ? JSON.parse(p.user.avatar) : {},
        }));
    }
};

const getTeam = async (teamId) => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("teams")
        .select(
            `
        id,
        name,
        team_avatar,
        avatar_url,
        avatar_type,
        profile_id
    `
        )
        .eq("id", teamId);
    const [fetchedTeam] = data;
    team.value = fetchedTeam;

    if (fetchedTeam?.avatar_type === "upload" && fetchedTeam?.avatar_url)
        await getAvatar();
};

/**
 * STATE DETERMINERS
 */

const $q = useQuasar();

const canEdit = computed(() => {
    return teamPlayers.value.some(
        (tp) => tp.id === userStore.id && tp.is_admin === true
    );
});

const isOnTeam = computed(() =>
    teamPlayers.value.some(({ id }) => id === userStore.id)
);

const canRemovePlayer = (userId: string) => {
    const memberEntry = teamPlayers.value.find(({id}) => id === userId)
    if (!memberEntry) return true;
    if (!memberEntry.is_admin) return true;
    return teamPlayers.value.filter(({is_admin}) => !!is_admin)?.length > 1;
}





/**
 * ADD/REMOVE PLAYERS
 */

const newTeamPlayers = ref([]);

const handleGlobalSelect = (player) => {
    if (teamId) {
        const { profile_id } = player;
        inviteUser(profile_id);
    } else {
        newTeamPlayers.value.push({
            ...player,
            username: player.name,
            status: "pending",
        });
    }
};

const toggleAddPlayer = () => {
    toggleGlobalSearch({
        open: true,
        options: {
            inputLabel: "Search for a user to add",
            resourceTypes: ["profile"],
            callback: handleGlobalSelect,
            filterIds: [...visiblePlayers.value.teamMembers].map(
                ({ id }) => id
            ),
        },
    });
};

const pendingUserRequest = computed(() =>
    pendingRequests.value.find(({ id }) => id === userStore.id)
);
const pendingUserInvite = computed(() =>
    pendingInvites.value.find(({ id }) => id === userStore.id)
);

const respondToRequest = async (id, status: string) => {
    await updateTeamRequestStatus({id, status})
    getPlayers();
    getPendingRequests();
    if (status === 'accepted') await useUserTeamStore().fetchUserTeams(true);
}

const inviteUser = async (userId) => {
    await sendTeamRequest({
        requestee_profile_id: userId,
        team_id: teamId,
    });
    getPendingRequests();
};

const requestToJoin = async () => {
    await sendTeamRequest({
        requester_profile_id: userStore.id,
        team_id: teamId,
    });
    getPendingRequests();
};

const cancelRequest = (userId) => {
    const index = teamPlayers.value.findIndex(({ id }) => id === userId);
    if (index === -1) return;
    teamPlayers.value.splice(index, 1);
};
const cancelInvite = (userId) => {
    const index = pendingInvites.value.findIndex(({ id }) => id === userId);
    if (index === -1) return;
    pendingInvites.value.splice(index, 1);
};


const removePlayer = async () => {
    if (!playerToRemove?.value) return;
    loading.value = true;
    const client = useSupabaseClient();
    const { errors } = await client
        .from("team_profile_junction")
        .delete()
        .eq("profile_id", playerToRemove.value?.id)
        .eq("team_id", teamId);
    if (errors) console.error(errors);
    await getPlayers();
    if (playerToRemove?.id === userStore.id) await useUserTeamStore().fetchUserTeams(true);
    loading.value = false;
    playerToRemove.value = null;
};

/**
 * ADMIN
 */

const togglingAdmin = ref(false);
const toggleAdmin = async (player) => {
    if (!teamId) return;
    const { rowId, id, is_admin } = player;

    if (togglingAdmin.value || !canEdit.value) return;
    togglingAdmin.value = true;
    const userTeamStore = useUserTeamStore();
    await userTeamStore.updateTeamProfile(rowId, {
        is_admin,
    });
    await getPlayers();
    togglingAdmin.value = false;
};

const toggleEditing = () => {
    if (!canEdit.value) return;
    isEditing.value = !isEditing.value;
};

/**
 * AVATAR
 */

const newTeamAvatar = ref(null);

const pendingAvatar = ref(null);

const onAvatarUpload = async ({ file, path }) => {
    pendingAvatar.value = {
        file,
        path,
    };
    const url = URL.createObjectURL(file);
    team.value.avatar_type = "upload";
    avatarUrl.value = url;
};

const avatarUrl = ref(null);

const getAvatar = async () => {
    const client = useSupabaseClient();
    const { data } = await client.storage
        .from("Avatars")
        .download(team.value.avatar_url);
    const url = URL.createObjectURL(data);
    avatarUrl.value = url;
};

const selectPlayerAvatarMode = ref(false);
const handlePlayerAvatarClick = async (player) => {
    if (!selectPlayerAvatarMode.value) return;
    if (!teamId) {
        team.value.team_avatar = player.avatar;
        team.value.avatar_type = "avataaar";
    } else {
        const client = useSupabaseClient();
        const { errors } = await client
            .from("teams")
            .update({ avatar_type: "avataaar", team_avatar: player.avatar })
            .eq("id", teamId);

        if (errors) return;
        await getTeam(teamId);
    }
    selectPlayerAvatarMode.value = false;
};

/**
 * SAVE
 */

const saving = ref(false);

const onSave = async () => {
    saving.value = true;
    const newTeam = await saveNewTeam();
    if (newTeam) {
        toggleTeamViewer({ open: false });
        setTimeout(() => {
            toggleTeamViewer({
                open: true,
                team: newTeam,
                options: {
                    priority: options.priority,
                    readOnly: options.readOnly,
                },
            });
        }, 10);
    }
    await useUserTeamStore().fetchUserTeams(true);

    saving.value = false;
};

const saveNewTeam = async () => {
    const newTeam = await teamStore.insertTeam(
        team.value,
        newTeamPlayers.value.map(({ profile_id }) => profile_id),
        teamPlayers.value.map((player) => ({
            id: player.id,
            is_admin: player.is_admin,
            position: player.position,
        }))
    );
    if (!newTeam) return false;

    if (team.value.avatar_type === "upload" && pendingAvatar.value) {
        const successful = await teamStore.uploadAvatarToTeam(
            pendingAvatar.value.path,
            pendingAvatar.value.file,
            newTeam?.id
        );
        if (!successful) return false;
    }
    isEditing.value = false;
    return newTeam;
};

const discardChanges = () => {
    isEditing.value = false;
    toggleTeamViewer({ open: false });
    nextTick(() => {
       toggleTeamViewer({ open: true, team: team.value }); 
    })
};

const handleClose = () => {
    if (isEditing.value) {
        confirmUnsaved.value = true;
    } else {
        toggleTeamViewer({ open: false });
    }
};
</script>
