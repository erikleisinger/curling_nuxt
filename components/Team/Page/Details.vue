<template>
    <header class="team-header__details row justify-center items-center">
        <div class="close-button__container">
            <q-btn flat round icon="close" @click="onBackClick" />
        </div>
        <div
            class="edit-button__container"
            v-if="isOnTeam(props.teamId) || !props.teamId"
        >
            <q-btn
                flat
                round
                :icon="editing || !props.teamId ? 'done' : 'edit'"
                @click="onClickEdit"
                :loading="saving"
                :disable="editing && !editedValues.name"
            />
        </div>
        <div class="avatar-container">
            <TeamAvatar
                :teamId="props.teamId"
                :editable="editing || !props.teamId"
                :emitOnly="editing || !props.teamId"
                @update="updateAvatar"
            />
        </div>
        <h2 class="team-name text-center" v-if="!editing && props.teamId">
            <span v-for="word,i in team.name.split(' ')" :key="i" :style="{'word-break': word.length > 15 ? 'break-word' : ''}">
            {{ `${word} ` }}
            </span>
        </h2>
        <q-input
            dense
            v-else
            v-model="editedValues.name"
            class="name-input"
            :class="{error: isNameError}"
            :maxlength="MAX_TEAM_NAME_LENGTH"
            :rules="[VALIDATION_RULES.REQUIRED, VALIDATION_RULES.MAX_LENGTH(MAX_TEAM_NAME_LENGTH)]"
            hide-bottom-space
            ref="nameInput"
            placeholder="Enter a team name"
        />
        <RinkChip :rinkId="team.rink_id" :canEdit="editing" style="margin:auto" editText="Select home rink" />

        <div class="row justify-center socials-container" v-if="!editing">
            <IconFacebook
                color="rgba(0,0,0,0.3)"
                v-if="team.facebook"
                @click="goSocial(team.facebook)"
            />
            <IconInstagram
                color="rgba(0,0,0,0.3)"
                v-if="team.instagram"
                @click="goSocial(team.instagram)"
            />
            <IconTwitter
                color="rgba(0,0,0,0.3)"
                v-if="team.twitter"
                @click="goSocial(team.twitter)"
            />
        </div>
        <q-input
            v-if="editing || create"
            placeholder="Facebook"
            dense
            :rules="[(val) => validateSocial(val, 'facebook')]"
            v-model="editedValues.facebook"
            hide-bottom-space
        >
            <template v-slot:prepend>
                <IconFacebook color="rgba(0,0,0,0.3)" />
            </template>
        </q-input>
        <q-input
            v-if="editing || create"
            placeholder="Instagram"
            dense
            :rules="[(val) => validateSocial(val, 'instagram')]"
            v-model="editedValues.instagram"
            hide-bottom-space
        >
            <template v-slot:prepend>
                <IconInstagram color="rgba(0,0,0,0.3)" />
            </template>
        </q-input>
        <q-input
            v-if="editing || create"
            placeholder="Twitter"
            dense
            :rules="[(val) => validateSocial(val, 'twitter')]"
            v-model="editedValues.twitter"
            hide-bottom-space
        >
            <template v-slot:prepend>
                <IconTwitter color="rgba(0,0,0,0.3)" />
            </template>
        </q-input>
    </header>
    <section class="team-players__section" v-if="props.teamId">
        <div
            v-for="player in team.players"
            :key="player.id"
            class="column items-center player-avatars__container"
        >
            <TeamPlayerEdit
                :playerId="player.id"
                :teamId="props.teamId"
                :editing="!editing"
                :canRemove="
                    editing &&
                    ((player?.pivot?.status === 'invited' || player?.pivot?.status === 'requested') ||
                        permanentPlayers.length > 1)
                "
                :canRespond="isOnTeam(props.teamId)"
                :canEditPosition="
                    editing && !(player?.pivot?.status === 'invited' || player?.pivot?.status === 'requested')
                "
                :invited="player?.pivot?.status === 'invited'"
                :requested="player?.pivot?.status === 'requested'"
                :canCancel="player?.pivot?.status === 'requested' && player.id === userId"
            >
                <div class="player-avatar__container column items-center">
                    <Avataaar
                        v-bind="player.avatar"
                        class="player-avatar"
                    />
                    <q-badge
                        color="orange"
                        align="bottom"
                        v-if="player.pivot && player.pivot.status === 'invited'"
                        >Invited</q-badge
                    >
                     <q-badge
                        color="orange"
                        align="bottom"
                        v-else-if="player.pivot && player.pivot.status === 'requested'"
                        >Requested</q-badge
                    >
                    <q-badge v-else color="blue" align="bottom">
                        {{
                            TEAM_POSITIONS[player?.pivot?.position]?.name ??
                            "Member"
                        }}
                    </q-badge>
                </div>

                <div class="text-center player-name truncate-text">
                    {{ player.first_name }}
                </div>
                <div class="text-center player-name truncate-text">
                    {{ player.last_name }}
                </div>
            </TeamPlayerEdit>
        </div>
        <div v-if="!team.players?.length">{{ team.name }} has no players.</div>
        <div
            v-if="editing"
            class="column items-center player-avatars__container"
        >
            <div class="player-avatar__add row justify-center items-center">
                <q-btn
                    flat
                    round
                    icon="add"
                    color="white"
                    size="sm"
                    @click="openPlayerSearch"
                />
            </div>
            <div class="text-center player-name truncate-text">
                Invite player
            </div>
        </div>
    </section>
    <section>
        <TeamRequestsHandler :teamId="teamId" v-if="!create && !editing"/>
    </section>
    <section name="options" class="q-pa-sm" v-if="editing">
        <h3 class="text-sm text-bold ">Options</h3>
        <q-item
                        tag="label"
                        v-ripple
                        style="padding-right: 4px; padding-left: 4px"
                    >
                        <q-item-section>
                            <q-item-label>Public</q-item-label>
                            <q-item-label caption
                                >
                                <span v-if="editedValues.public">
                                     Anyone can request to join this team.
                                </span>
                                 <span v-else>
                                     Players must be invited to join this team.
                                </span>
                               
                                </q-item-label
                            >
                        </q-item-section>
                        <q-item-section avatar>
                            <q-toggle
                                v-model="editedValues.public"
                                class="toggle"
                            ></q-toggle>
                        </q-item-section>
                    </q-item>
    </section>
    <section class="danger__section q-pa-sm" v-if="editing">
           <h3 class="text-sm text-bold ">Danger zone</h3>
           <div class="row full-width justify-center q-mt-sm">
        <q-btn flat color="red" @click="confirmDelete = true"
            >Delete team</q-btn
        >
           </div>
    </section>
    <DialogConfirmation
        v-if="!!confirmUnsaved"
        confirmButtonText="Discard"
        cancelButtonText="Cancel"
        @confirm="emit('back')"
        @close="confirmUnsaved = false"
        cancelColor=""
        confirmColor="negative"
    >
        Are you sure you want to close? All unsaved changes will be lost.
    </DialogConfirmation>
    <DialogConfirmation
        v-if="!!confirmDelete"
        confirmButtonText="Delete Team"
        cancelButtonText="Cancel"
        @confirm="deleteTeam"
        @close="closeConfirmDelete"
        cancelColor=""
        confirmColor="negative"
        :disableConfirm="deleting || !teamNameMatch"
        :disableCancel="deleting"
    >
        <h3 class="text-bold text-md">Delete {{ team.name }}?</h3>
        <p class="text-red q-mt-sm">
            This action cannot be undone. All games, badges, and stats will be
            <strong>permanently</strong> removed. Forever!
        </p>
        <p>
            To delete this team, please type the team name into the input below.
        </p>
        <q-input
            outlined
            dense
            :placeholder="team.name"
            v-model="teamDeletionVerification"
        >
        </q-input>
    </DialogConfirmation>
</template>
<style lang="scss" scoped>
.team-header__details {
    position: relative;
    display: grid;
    padding: 0px var(--space-sm);
    grid-template-rows: min(200px, 530) 1fr;
    background: linear-gradient(
        180deg,
        rgba(94, 94, 255, 0.65) 0%,
        rgba(255, 255, 255, 1) 100%
    );

    .name-input {
        // text-transform: uppercase;
        text-align: center;
        font-size: var(--text-lg);
        :deep(.q-field__control) {
            &:before {
                border-bottom: 0px !important;
            }
        }
        :deep(.q-field__native) {
            text-align: center;
            font-weight: bold;
        }
        margin-bottom: var(--space-xxxs)
        
    }
    .avatar-container {
        width: min(50vw, 175px);
        margin-right: auto;
        margin-left: auto;
        position: relative;
        .avatar-edit__overlay {
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            z-index: 1;
        }
    }
    .team-name {
        font-weight: bold;
        text-transform: uppercase;
        font-size: var(--text-lg);
        margin-bottom: var(--space-xxxs);
        max-width: 100%;
        span {
            max-width: inherit;
        }
    }
    .rink-name {
        text-align: center;
        font-size: 1em;
    }

    .close-button__container,
    .edit-button__container {
        position: absolute;
        top: 0;

        margin: var(--space-xs);
    }
    .edit-button__container {
        left: 0;
    }
    .close-button__container {
        right: 0;
    }
    .socials-container {
        gap: var(--space-sm);
        margin-top: var(--space-xs);
    }
}
.team-players__section {
    display: flex;
    padding: var(--space-md);
    justify-content: center;
    flex-wrap: wrap;
    .player-avatar,
    .player-avatar__add {
        width: 30px;
    }
    .player-avatar__add {
        width: 30px;
        aspect-ratio: 1/1;
        margin-top: 4px;
        border-radius: 50%;
        background-color: gray;
    }
    .player-name {
        font-size: 0.9em;
        max-width: 100%;
    }

    .player-avatars__container {
        width: 31%;
        margin-bottom: var(--space-md);
        position: relative;
        transition: all 0.5s;
        .delete-player__overlay {
            position: absolute;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1;
            height: 100%;
            width: 100%;
            border-radius: 8px;
        }
        .invitation-badge {
            height: 50px;
            width: 50px;
            position: absolute;
            background-color: red;
            right: 10px;
            bottom: 0;
        }
        .player-avatar__container {
            width: 100%;
            position: relative;
            display: flex;
            justify-content: center;
            .q-badge {
                left: 0 !important;
                right: 0 !important;
                margin: auto;
                width: fit-content;
            }
        }
    }
}
.danger__section {
    margin-bottom: var(--space-sm);
}
</style>
<script setup lang="ts">
import { useDialogStore } from "@/store/dialog";
import { useUserTeamStore } from "@/store/user-teams";
import { useNotificationStore } from "@/store/notification";
import { useTeamRequestStore } from "@/store/team-requests";
import Rink from "@/store/models/rink";
import Team from "@/store/models/team";
import Player from "@/store/models/player";
import { useTeamStore } from "@/store/teams";
import { useQuery } from "@tanstack/vue-query";
import { useQueryClient } from "@tanstack/vue-query";
import { MAX_TEAM_NAME_LENGTH, VALIDATION_RULES } from "@/constants/validation";
import { TEAM_POSITIONS } from "@/constants/team";

const queryClient = useQueryClient();

const props = defineProps<{
    create?: boolean;
    teamId?: number | undefined;
}>();
const emit = defineEmits(["back"]);

const team = computed(() =>
    props.teamId
        ? useRepo(Team).withAll().where("id", props.teamId).first()
        : {
              name: null,
              avatar_url: null,
              players: [],
          }
);

const permanentPlayers = computed(() =>
    team.value.players.filter(({ pivot }) => !pivot.status)
);
const visiblePlayers = computed(() =>
    isOnTeam() || editing.value ? team.value.players : permanentPlayers.value
);

const {getTeamPlayers} = useTeam();

const {isLoading: isLoadingPlayers} = useQuery({
    queryKey: ['team', 'players', props.teamId],
    queryFn: () => getTeamPlayers(props.teamId),
    refetchOnWindowFocus: false
})

const { getTeamAvatar } = useAvatar();

const { isLoading, data: avatar } = getTeamAvatar(props.teamId);

const editing = ref(false);

const editedValues = ref({});

const setEditedValues = (wipe = false) => {
    if (wipe) {
        editedValues.value = {
            name: null,
            avatar_url: null,
            players: [],
            rink_id: null,
            facebook: null,
            instagram: null,
            twitter: null,
            public: false,
        };
    } else {
        editedValues.value = {
            name: team.value?.name,
            avatar_url: team.value?.avatar_url,
            players: team.value?.players,
            rink_id: team.value?.rink_id || null,
            facebook: team.value?.facebook,
            instagram: team.value?.instagram,
            twitter: team.value?.twitter,
            public: team.value?.public
        };
    }
};

const selectedRink = computed(() => {
    if (
        !originalValues.value.rink_id &&
        !team.value.rink_id &&
        !editedValues.value.rink_id
    )
        return {};
    return (
        useRepo(Rink)
            .where("id", editedValues.value.rink_id || team.value.rink_id)
            .first() ?? {}
    );
});

const originalValues = ref({});

const setOriginalValues = () => {
    originalValues.value = {
        name: team.value?.name,
        avatar_url: team.value?.avatar_url,
        players: team.value?.players,
        rink_id: team.value?.rink_id,
        facebook: team.value?.facebook,
        instagram: team.value?.instagram,
        twitter: team.value?.twitter,
        public: team.value?.public,
    };
};

// VALIDATION

const { objTheSame } = useValidation();

const confirmUnsaved = ref(false);

const areUnsavedChanges = () => {
    return objTheSame(editedValues.value, originalValues.value);
};

const nameInput = ref(null);
const isNameError = computed(() => nameInput.value?.hasError)

//

const onBackClick = () => {
    if (editing.value && !areUnsavedChanges()) {
        confirmUnsaved.value = true;
    } else {
        emit("back");
    }
};

const createTeam = async () => {
    if (!editedValues.value.name) return;
    const client = useSupabaseClient();
    const { data } = await client
        .from("teams")
        .insert({
            name: editedValues.value.name,
            rink_id: editedValues.value.rink_id,
            instagram: editedValues.value.instagram,
            twitter: editedValues.value.twitter,
            facebook: editedValues.value.facebook,
        })
        .select("id")
        .single();
    const { id } = data;
    return id;
};

const saving = ref(false);

const onClickEdit = async () => {
    // Begin edit state
    if (!editing.value && !!props.teamId) {
        setOriginalValues();
        setEditedValues(false);
        editing.value = true;
        // End edit state & save
    } else if (props.teamId) {
        let hasChanged = false;
        let updates = {};
        if (editedValues.value.name !== originalValues.value.name) {
            saving.value = true;
            hasChanged = true;
            updates.name = editedValues.value.name;
        }

        if (editedValues.value.facebook !== originalValues.value.facebook) {
            saving.value = true;
            hasChanged = true;
            updates.facebook = cleanUrl(editedValues.value.facebook);
        }

        if (editedValues.value.instagram !== originalValues.value.instagram) {
            saving.value = true;
            hasChanged = true;
            updates.instagram = cleanUrl(editedValues.value.instagram);
        }

        if (editedValues.value.twitter !== originalValues.value.twitter) {
            saving.value = true;
            hasChanged = true;
            updates.twitter = cleanUrl(editedValues.value.twitter);
        }
        if (editedValues.value.rink_id !== originalValues.value.rink_id) {
            saving.value = true;
            hasChanged = true;
            updates.rink_id = editedValues.value.rink_id;
        }

         if (editedValues.value.public !== originalValues.value.public) {
            saving.value = true;
            hasChanged = true;
            updates.public = editedValues.value.public;
        }

        if (hasChanged) {
            await useTeamStore().updateTeam(updates, props.teamId);
        }

        if (editedValues.value.avatar_url !== originalValues.value.avatar_url) {
            hasChanged = true;
            saving.value = true;

            await updateTeamAvatar(props.teamId);
        }

        if (hasChanged)
            queryClient.invalidateQueries({
                queryKey: ["team", "full", props.teamId],
            });

        setEditedValues(true);
        setOriginalValues();
        editing.value = false;
        saving.value = false;
    } else {
        saving.value = true;
        const id = await createTeam();
        if (editedValues.value.avatar_url) await updateTeamAvatar(id);
        useUserTeamStore().fetchUserTeams(true);

        return navigateTo(`/teams/${id}`);
    }
};

const updateTeamAvatar = async (teamId: number) => {
    const { file, path } = editedValues.value.avatar_url;
    if (file && path)
        await useTeamStore().uploadAvatarToTeam(path, file, teamId);
    queryClient.invalidateQueries({
        queryKey: ["teamavatar", teamId],
    });
};

const { toggleGlobalSearch } = useDialogStore();

const openPlayerSearch = () => {
    toggleGlobalSearch({
        open: true,
        options: {
            inputLabel: "Search for a user to invite",
            resourceTypes: ["profile"],
            callback: inviteUser,
            filterIds: [...team.value.players].map(({ id }) => id),
        },
    });
};

const selectRink = (rink) => {
    useRepo(Rink).save(rink);
    const { id } = rink;
    editedValues.value.rink_id = id;
};

const openRinkSearch = () => {
    toggleGlobalSearch({
        open: true,
        options: {
            callback: selectRink,
            inputLabel: "Search for a rink",
            resourceTypes: ["rink"],
        },
    });
};

const inviteUser = async (e) => {
    await useTeamRequestStore().sendTeamInvitation({
        requestee_profile_id: e.profile_id,
        team_id: props.teamId,
    });
    queryClient.invalidateQueries({
        queryKey: ["team", "players", props.teamId],
    });
};

const { isOnTeam } = useTeam();

const updateAvatar = (data) => {
    editedValues.value.avatar_url = data;
};

const onPlayerClick = ({ id }) => {
    if (editing.value) return;
    return navigateTo(`/player/${id}`);
};

const validateSocial = (input, type) => {
    try {
        const scrubbed = input.replaceAll("http://.", "", "https://", "");
        const url = new URL(`https://${scrubbed}`);

        const { origin } = url;

        return (
            origin === `https://www.${type}.com` ||
            origin === `https://${type}.com` ||
            origin === `${type}.com` ||
            `Must be a valid ${type} url.`
        );
    } catch {
        return "Invalid url";
    }
};

const cleanUrl = (url: string) => {
    const scrubbed = url?.replaceAll("http://.", "", "https://", "");
    return `https://${scrubbed}`;
};

const goSocial = (url: string) => {
    return navigateTo(cleanUrl(url), {
        open: {
            target: "_blank",
        },
    });
};
const { user: userId } = useUser();
onMounted(() => {
    if (!props.create) return;

    editedValues.value.rink_id = useRepo(Player)
        .where("id", userId.value)
        .first()?.rink_id;
});

// Team deletion

const confirmDelete = ref(false);
const teamDeletionVerification = ref(null);

const teamNameMatch = computed(
    () => teamDeletionVerification.value === team.value.name
);

const closeConfirmDelete = () => {
    teamDeletionVerification.value = null;
    confirmDelete.value = false;
};
const deleting = ref(false);
const deleteTeam = async () => {
    const { setLoading } = useLoading();
    setLoading(true);
    const notStore = useNotificationStore();
    const notId = notStore.addNotification({
        text: `Deleting ${team.value.name}`,
        state: "pending",
    });
    try {
        const client = useSupabaseClient();

        const { name } = { ...team.value };

        await client.from("teams").delete().eq("id", team.value.id);

        await useUserTeamStore().fetchUserTeams(true);

        notStore.updateNotification(notId, {
            state: "completed",
            text: `${name} was deleted.`,
        });
    } catch (error) {
        notStore.updateNotification(notId, {
            state: "failed",
            text: `Error deleting: ${error}`,
        });
    }

    return navigateTo("/");

    setTimeout(() => {
        useRepo(Team).where("id", team.value.id).delete();
        setLoading(false);
    }, 1000);
};
</script>
<script lang="ts">
export default {
    name: "TeamDetails",
};
</script>
