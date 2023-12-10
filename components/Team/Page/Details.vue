<template>
    <header class="team-header__details row justify-center items-center">
        <div class="back-button__container">
            <q-btn flat round icon="arrow_back_ios" @click="emit('back')" />
        </div>
        <div class="edit-button__container" v-if="isOnTeam(props.teamId)">
            <q-btn
                flat
                round
                :icon="editing ? 'done' : 'edit'"
                @click="onClickEdit"
                :loading="saving"
            />
        </div>
        <div class="avatar-container">
            <TeamAvatar
                :teamId="props.teamId"
                :editable="editing"
                :emitOnly="editing"
                @update="onAvatarUpdate"
            />
            <div
                class="avatar-edit__overlay row justify-center items-center"
                style="pointer-events: none"
                v-if="editing"
            >
                <q-icon flat round name="edit" size="md" color="white" />
            </div>
        </div>
        <h2 class="team-name text-center" v-if="!editing">
            {{ team.name }}
        </h2>
        <q-input dense v-else v-model="editedValues.name" />
        <h3 class="rink-name">Home rink</h3>
    </header>
    <section class="team-players__section">
        <div
            v-for="player in team.players"
            :key="player.id"
            class="column items-center player-avatars__container"
        >
            <div
                class="delete-player__overlay row justify-center items-center"
                v-if="editing && team.players.length > 1"
            >
                <TeamPlayerRemove
                    v-slot="{ remove }"
                    :playerId="player.id"
                    :teamId="props.teamId"
                >
                    <q-btn
                        icon="close"
                        text-color="white"
                        flat
                        stretch
                        class="full-width"
                        @click="remove"
                    ></q-btn>
                </TeamPlayerRemove>
            </div>
            <Avataaar v-bind="player.avatar" class="player-avatar" />
            <div class="text-center player-name truncate-text">
                {{ player.first_name }}
            </div>
            <div class="text-center player-name truncate-text">
                {{ player.last_name }}
            </div>
        </div>
        <div
            v-if="editing"
            class="column items-center player-avatars__container"
        >
            <div class="player-avatar__add row justify-center items-center">
                <q-btn flat round icon="add" color="white" size="sm" />
            </div>
            <div class="text-center player-name truncate-text">Add player</div>
        </div>
    </section>
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
        word-break: break-all;
    }
    .rink-name {
        text-align: center;
        font-size: 1em;
    }

    .back-button__container,
    .edit-button__container {
        position: absolute;
        top: 0;

        padding: var(--space-xs);
    }
    .edit-button__container {
        right: 0;
    }
    .back-button__container {
        left: 0;
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
        width: 33.33%;
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
    }
}
</style>
<script setup lang="ts">
import Team from "@/store/models/team";
import { useTeamStore } from "@/store/teams";
import { useQuery} from '@tanstack/vue-query'
import { useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();

const props = defineProps<{
    teamId: number;
}>();
const emit = defineEmits(["back"]);

const team = computed(() =>
    useRepo(Team).with("players").where("id", props.teamId).first()
);

const { getTeamAvatar } = useAvatar();

const { isLoading, data: avatar } = getTeamAvatar(props.teamId)




const editing = ref(false);

const editedValues = ref({});

const setEditedValues = (wipe = false) => {
    if (wipe) {
        editedValues.value = {
            name: null,
            avatar_url: null,
            players: [],
        };
    } else {
        editedValues.value = {
            name: team.value?.name,
            avatar_url: team.value?.avatar_url,
            players: team.value?.players,
        };
    }
};

const originalValues = ref({});

const setOriginalValues = () => {
    originalValues.value = {
        name: team.value?.name,
        avatar_url: team.value?.avatar_url,
        players: team.value?.players,
    };
};

const saving = ref(false);

const onClickEdit = async () => {
    // Begin edit state
    if (!editing.value) {
        setOriginalValues();
        setEditedValues(false);
        editing.value = true;
        // End edit state & save
    } else {
        let hasChanged = false;
        if (editedValues.value.name !== originalValues.value.name) {
            saving.value = true;
            hasChanged = true;
            await useTeamStore().updateTeamName(
                editedValues.value.name,
                props.teamId
            );
        }

        if (editedValues.value.avatar_url !== originalValues.value.avatar_url) {
            hasChanged = true;
            saving.value = true;
            const { file, path } = editedValues.value.avatar_url;
            if (file && path)
                await useTeamStore().uploadAvatarToTeam(
                    path,
                    file,
                    props.teamId
                );
           queryClient.invalidateQueries({
                    queryKey: ['teamavatar', props.teamId],
                });
        }

        if (hasChanged) queryClient.invalidateQueries({
                queryKey: ["team", "page",props.teamId],
            });
        saving.value = false;

        setEditedValues(true);
        editing.value = false;
    }
};

const onAvatarUpdate = async (data) => {
    editedValues.value.avatar_url = data;
};

const { isOnTeam } = useTeam();
</script>
<script lang="ts">
export default {
    name: "TeamDetails",
};
</script>
