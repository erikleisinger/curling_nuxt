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
        <!--  -->
        <!-- -->
        Are you sure you want to close? All unsaved changes will be lost.
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

        <template v-slot:footer v-if="!loading">
            <div class="row justify-end team-viewer__footer" v-if="isEditing">
                <!-- <q-btn
                    unelevated
                    color="negative"
                    class="'col-6'"
                    icon="delete_outline"
                    label="discard"
                    :class="`col-${12 / footerButtonsLength}`"
                    @click="discardChanges"
                    square
                    :disable="saving"
                    v-if="teamId"
                /> -->
                <q-btn
                    unelevated
                    color="positive"
                    class="col-12"
                    icon="save"
                    label="save"
                    @click="onSave"
                    square
                    :disable="saving"
                />
            </div>
            <div
                class="row justify-between full-width no-wrap team-viewer__footer"
                v-else-if="!isEditing"
            >
                <q-btn
                    unelevated
                    color="primary"
                    :class="`col-${12 / footerButtonsLength}`"
                    icon="group_add"
                    label="Follow team"
                    :size="
                        $q.screen.sm || footerButtonsLength === 1 ? 'lg' : 'md'
                    "
                    @click="addToMyTeams('fan')"
                    square
                    v-if="!isOnTeam"
                />
                <q-btn
                    unelevated
                    color="primary"
                    :class="`col-${12 / footerButtonsLength}`"
                    icon="group_add"
                    label="Join team"
                    :size="
                        $q.screen.sm || footerButtonsLength === 1 ? 'lg' : 'md'
                    "
                    @click="addToMyTeams('member')"
                    square
                    v-if="!isOnTeam"
                />
                <q-btn
                    unelevated
                    :class="`col-${12 / footerButtonsLength}`"
                    icon="group_remove"
                    label="Leave team"
                    :size="
                        $q.screen.sm || footerButtonsLength === 1 ? 'lg' : 'md'
                    "
                    @click="removePlayer(userStore.id)"
                    square
                    v-if="isOnTeam"
                />
                <q-btn
                    unelevated
                    color="positive"
                    :class="`col-${12 / footerButtonsLength}`"
                    icon="edit"
                    label="edit"
                    :size="
                        $q.screen.sm || footerButtonsLength === 1 ? 'lg' : 'md'
                    "
                    @click="toggleEditing"
                    v-if="canEdit"
                    square
                />
            </div>
        </template>

        <template v-slot:buttonRight>
            <q-btn flat round icon="close" @click="handleClose" />
        </template>
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
                    <div v-if="!player.status">
                        <TeamPositionChip
                            :canEdit="isEditing"
                            position="skip"
                            v-model="player.position"
                        />
                    </div>
                    <div v-if="!player.status">
                        <TeamAdminChip
                            :canEdit="isEditing && player.id !== userStore.id"
                            v-model="player.is_admin"
                            v-if="isEditing || player.is_admin"
                        />
                    </div>

                    <!-- <q-btn flat round icon="edit" color="grey-8" v-if="isEditing" @click="toggleEditPlayer"/> -->

                    <!-- <div class="column" v-if="isEditing">
                         <q-btn dense color="primary" v-if="!player.is_admin" icon="stars" rounded>Make admin</q-btn>
                           <q-btn dense color="negative" v-else icon="stars" rounded>Remove admin</q-btn>
                    </div> -->

                    <!-- <q-icon
                        name="stars"
                        color="grey-4"
                        size="md"
                    
                        v-if="isEditing"
                    /> -->
                    <!-- <q-icon
                        name="delete"
                        color="negative"
                        size="md"
                        @click="removePlayer(player.id)"
                        v-if="
                            !player.is_admin &&
                            teamId &&
                            isEditing &&
                            !isOwner(player.id)
                        "
                    /> -->
                    <RequestStatus
                        v-else
                        :requesteeId="player.id"
                        :resourceId="teamId"
                        :status="player.status"
                        canEdit
                        @cancel="cancelRequest(player.id)"
                        :waiting="!teamId"
                    />
                </div>
            </div>
            <!-- Add new player -->
            <div class="row items-center justify-between" v-if="isEditing">
                <div class="row items-center">
                    <div
                        style="width: 50px; aspect-ratio: 1/1"
                        class="row items-center justify-center"
                    >
                        <q-btn
                            round
                            icon="add"
                            color="primary"
                            @click="toggleAddPlayer"
                        />
                    </div>
                    <div class="q-ml-sm column justify-center">
                        <div>Add new player</div>
                    </div>
                </div>
            </div>

            <div class="q-mx-sm q-my-md row" @click="showFans = !showFans">
                <div class="text-md text-bold">
                    Followers ({{ visiblePlayers?.teamFans?.length }})
                </div>
                <div>
                    <q-icon
                        :name="showFans ? 'expand_less' : 'expand_more'"
                        color="primary"
                        dense
                        size="sm"
                    />
                </div>
            </div>
            <div v-if="showFans">
                <div
                    v-for="player in visiblePlayers.teamFans"
                    :key="player.id"
                    class="row items-center justify-between"
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
.selection__menu {
    background-color: rgba(0, 0, 0, 0.5);
}
.player__container {
    display: grid;
    grid-template-columns: 50px auto max-content;
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
const { options } = dialogStore.teamViewer;
const teamId = dialogStore.teamViewer.team?.id;
const team = ref({
    name: null,
    team_avatar: {},
});
const teamPlayers = ref([]);

const showFans = ref(true);

const visiblePlayers = computed(() => {
    const obj = {
        teamMembers: [],
        teamFans: [],
    };
    teamPlayers.value.forEach((player) => {
        if (player.type === "fan") {
            obj.teamFans.push(player);
        } else {
            obj.teamMembers.push(player);
        }
    });
    if (!teamId) {
        obj.teamMembers = [...obj.teamMembers, ...newTeamPlayers.value];
    }
    return obj;
});

/**
 * EDITING PLAYERS
 */

const toggleEditPlayer = (id) => {
    if (editing.value === id) {
        editing.value = null;
    } else {
        editing.value = id;
    }
};

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
        console.log(userStore.id)
    loading.value = false;
});

/**
 * FETCH
 */

const getPendingRequests = async () => {
    const teamRequestStore = useTeamRequestStore();
    const requests = await teamRequestStore.getTeamRequestsByTeam(teamId);
    teamPlayers.value = [
        ...teamPlayers.value,
        ...requests.reduce((all, current) => {
            if (current.status === "accepted") return all;
            return [
                ...all,
                {
                    ...current.requestee,
                    status: "pending",
                },
            ];
        }, []),
    ];
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
            avatar: p.avatar ? JSON.parse(p.avatar) : {}
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

const isOwner = (profile_id) => {
    if (!teamId) return false;
    return team.value?.owner?.id === profile_id;
};

const footerButtonsLength = computed(() => {
    if (!canEdit.value) return 1;
    if (isEditing.value) {
        if (teamId) return 2;
        return 1;
    }
    if (options.readOnly || isOnTeam.value) return 2;
    return 3;
});

/**
 * ADD/REMOVE PLAYERS
 */

const addToMyTeams = async (type: string) => {
    loading.value = true;
    const is_admin = type === "fan" ? false : !!isOwner(userStore.id);
    await useUserTeamStore().addTeam({ team: team.value, type, is_admin });
    await getPlayers();
    await useUserTeamStore().fetchUserTeams(true);
    loading.value = false;
};

const newTeamPlayers = ref([]);

const handleGlobalSelect = (player) => {
    if (teamId) {
        inviteUser(player);
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
            filterIds: [
                ...visiblePlayers.value.teamMembers,
                ...visiblePlayers.value.teamFans,
            ].map(({ id }) => id),
        },
    });
};

const inviteUser = async (user) => {
    const teamRequestStore = useTeamRequestStore();
    await teamRequestStore.sendTeamRequest({
        requestee_profile_id: user.profile_id,
        team_id: teamId,
    });
    getPendingRequests();
};

const cancelRequest = (userId) => {
    const index = teamPlayers.value.findIndex(({ id }) => id === userId);
    if (index === -1) return;
    teamPlayers.value.splice(index, 1);
};

const removePlayer = async (userId) => {
    console.log("remove");
    loading.value = true;
    const client = useSupabaseClient();
    const { errors } = await client
        .from("team_profile_junction")
        .delete()
        .eq("profile_id", userId)
        .eq("team_id", teamId);
    if (errors) console.error(errors);
    await getPlayers();
    if (userId === userStore.id) await useUserTeamStore().fetchUserTeams(true);
    loading.value = false;
};

/**
 * ADMIN
 */

const togglingAdmin = ref(false);
const toggleAdmin = async (player) => {
    if (!teamId) return;
    const { rowId, id, is_admin } = player;
    if (isOwner(id)) return;

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
    return newTeam;
};

const discardChanges = () => {
    isEditing.value = false;
    getTeam(teamId);
};

const handleClose = () => {
    if (isEditing.value) {
        confirmUnsaved.value = true;
    } else {
        toggleTeamViewer({ open: false });
    }
};
</script>
