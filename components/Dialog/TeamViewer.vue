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
    <DialogFloating :priority="!!options.priority">
        <template v-slot:buttonLeft>
            <div>
                <q-btn
                    flat
                    round
                    icon="edit"
                    color="white"
                    @click="isEditing = !isEditing"
                    v-if="canEdit && !isEditing"
                />
                <q-btn
                    flat
                    round
                    icon="save"
                    v-if="isEditing"
                    @click="onSave"
                />
            </div>
        </template>
        <template v-slot:buttonRight>
            <q-btn flat round icon="close" @click="handleClose" />
        </template>
        <header class="column items-center header no-wrap">
            <div
                style="
                    width: 100px;
                    position: relative;
                    aspect-ratio: 1/1;
                "
            >
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
                        >
                            Select player avatar
                        </q-fab-action>
                    </q-fab>
                </div>
                <Avataaar
                    v-bind="team?.team_avatar"
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
        <main class="q-px-md q-mt-lg">
            <div
                v-for="player in visiblePlayers.teamMembers"
                :key="player.id"
                class="row items-center justify-between no-wrap player__container"
            >
                
                    <div
                        style="width: 50px"
                        class="member-avatar__wrap"
                        @click="handlePlayerAvatarClick(player)"
                    >
                        <div
                            style="width: inherit"
                            class="member-avatar__container"
                            :class="{ 'highlight': selectPlayerAvatarMode }"
                        >
                            <Avataaar v-bind="player.avatar" />
                        </div>
                    </div>
                    <div class="q-ml-sm column col-shrink">
                        <div class="truncate-text full-width">
                            {{ player.first_name }} {{ player.last_name }}
                        </div>
                        <div>
                            <ProfileChip
                                :id="player.id"
                                :username="player.username"
                            />
                        </div>
                    </div>
            
                <div v-if="!player.status" class="row no-wrap">
                        <q-icon
                            name="stars"
                            :color="player.is_admin ? 'primary' : 'grey-4'"
                            size="md"
                            @click="toggleAdmin(player)"
                            v-if="isEditing"
                        />
                        <q-icon
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
                        />
                    </div>
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
            <!-- Add new player -->
            <div
                class="row items-center justify-between"
                @click="toggleAddPlayer"
                v-if="isEditing"
            >
                <div class="row items-center">
                    <div
                        style="width: 50px; aspect-ratio: 1/1"
                        class="row items-center justify-center"
                    >
                        <q-btn flat round icon="add" color="primary" />
                    </div>
                    <div class="q-ml-sm column justify-center">
                        <div>Add new player</div>
                    </div>
                </div>
            </div>

            <div
                class="q-mx-sm q-my-md row"
                @click="showFans = !showFans"
                v-if="!isEditing"
            >
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
            <div v-if="!isEditing && showFans">
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
$header-height: 2em;
.player__container {
    display: grid;
    grid-template-columns: 50px 1fr auto;
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
        &.highlight {
            transform: scale(1.1);
            position: absolute;
            top: 0;
            z-index: 100;
            box-shadow: $pretty-shadow;
            border-radius: 50%;
            cursor: pointer;
            &:hover {
                transform: scale(1.2);
            }
        }
    }
}
</style>
<script setup lang="ts">
import { useDialogStore } from "@/store/dialog";
import { useSocialStore } from "@/store/social";
import { useTeamStore } from "@/store/teams";
import { useUserTeamStore } from "@/store/user-teams";
import { useUserStore } from "@/store/user";
import { parseAvatar } from "@/utils/avatar";
import { useElementSize } from "@vueuse/core";
import Team from "@/types/team";
const dialogStore = useDialogStore();

const tab = ref("stats");

const { toggleTeamViewer, toggleGlobalSearch } = dialogStore;

const { options } = dialogStore.teamViewer;

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

const inviteUser = async (user) => {
    const socialStore = useSocialStore();
    await socialStore.sendTeamRequest({
        requestee_profile_id: user.profile_id,
        team_id: teamId,
    });
    getPendingRequests();
};

const { format } = useTime();

const loading = ref(false);

const teamStore = useTeamStore();

const teamId = dialogStore.teamViewer.team?.id;

const team = ref({
    name: null,
    team_avatar: {},
});

const isEditing = ref(false);

const visiblePlayers = computed(() => {
    const obj = {
        teamMembers: [],
        teamFans: [],
    };
    teamPlayers.value.forEach((player) => {
        // if (isEditing.value && player.status === "pending") return;
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

const userStore = useUserStore();

const teamPlayers = ref([]);

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
                first_name: userStore.firstName,
                last_name: userStore.lastName,
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

onBeforeMount(async () => {
    // team.value =
    //     teamStore.teams.find((t) => t.id === teamId) ||
    //     dialogStore.teamViewer.team;
});

const canEdit = computed(() => {
    return teamPlayers.value.some(
        (tp) => tp.id === userStore.id && tp.is_admin === true
    );
});

const getPendingRequests = async () => {
    const socialStore = useSocialStore();
    const requests = await socialStore.getTeamRequestsByTeam(teamId);
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

onMounted(async () => {
    if (!teamId) {
        isEditing.value = true;
        getPlayers();
        return;
    }
    await getTeam(teamId);
    await getPlayers();
    getPendingRequests();
});

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

const cancelRequest = (userId) => {
    const index = teamPlayers.value.findIndex(({ id }) => id === userId);
    if (index === -1) return;
    teamPlayers.value.splice(index, 1);
};

const removePlayer = async (userId) => {
    const client = useSupabaseClient();
    const { errors } = await client
        .from("team_profile_junction")
        .delete()
        .eq("profile_id", userId)
        .eq("team_id", teamId);
    if (errors) console.error(errors);
    getPlayers();
};

const isOwner = (profile_id) => {
    if (!teamId) return false;
    return team.value?.owner?.id === profile_id;
};

const showFans = ref(false);

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

const saving = ref(false);

const saveNewTeam = async () => {
    const newTeam = await teamStore.insertTeam(
        team.value,
        newTeamPlayers.value.map(({ profile_id }) => profile_id)
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

const onSave = async () => {
    saving.value = true;
    const newTeam = await saveNewTeam();
    if (newTeam) {
        await useUserTeamStore().fetchUserTeams(true);
        toggleTeamViewer({ open: false });
        setTimeout(() => {
            toggleTeamViewer({ open: true, team: newTeam });
        }, 10);
    }

    saving.value = true;
};

const confirmUnsaved = ref(false);

const handleClose = () => {
    if (teamId && isEditing.value) {
        confirmUnsaved.value = true;
    } else {
        toggleTeamViewer({ open: false });
    }
};
</script>
