<template>
    <div class="help--overlay">
        <div class="edit__container" ref="editContainer" v-if="editingName">
            <q-card>
                <q-card-section
                    :style="{
                        backgroundColor: getColor('mint'),
                        color: 'white',
                    }"
                >
                    <h3>Edit team name</h3>
                    <span class="text-caption"
                        >Words beginning in a lowercase letter will be small;
                        words beginning in an uppercase letter will be
                        large.</span
                    >
                </q-card-section>
                <q-card-section class="q-py-lg">
                    <q-input
                        rounded
                        outlined
                        bg-color="white"
                        v-model="editedTeam.name"
                        :rules="[
                            VALIDATION_RULES.MAX_LENGTH(MAX_NAME_LENGTH),
                            VALIDATION_RULES.REQUIRED,
                        ]"
                        ref="nameInput"
                        placeholder="Team name"
                    >
                        <template v-slot:after>
                            <Button
                                round
                                icon="check"
                                size="14px"
                                color="mint"
                                :disable="nameError"
                                @click="editingName = false"
                            />
                        </template>
                    </q-input>
                </q-card-section>
            </q-card>
        </div>
        <div class="help__container" v-else>
            <div class="help__header row justify-between items-center">
                <h3>{{ isCreating ? "Create new" : "Edit" }} team</h3>
                <q-btn flat round icon="more_vert" color="white" dense>
                    <q-menu>
                        <q-list separator>
                            <q-item
                                @click="deleteConfirmationOpen = true"
                                clickable
                                v-ripple
                            >
                                <q-item-section no-wrap>
                                    <q-item-label> Delete team </q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </div>
            <div
                class="edit-option text-center row items-center"
                @click="editingName = true"
                :class="{ active: editingName }"
            >
                <q-icon
                    :name="
                        editedTeam?.name
                            ? 'check_circle'
                            : 'radio_button_unchecked'
                    "
                    size="1.1em"
                />
                <div>Set team name</div>
            </div>

            <div
                class="edit-option text-center relative-position row items-center"
            >
                <q-icon
                    :name="
                        editedTeam.avatar?.file ||
                        (editedTeam.avatar?.url &&
                            editedTeam.avatar?.url !== defaultAvatar)
                            ? 'check_circle'
                            : 'radio_button_unchecked'
                    "
                    size="1.1em"
                />
                <div>Set team avatar</div>
                <UploaderDraft
                    emitOnly
                    style="left: 0; top: 0; cursor: pointer"
                    @upload="setNewAvatar"
                />
            </div>
            <div
                class="edit-option text-center row items-center"
                @click="searchRink"
            >
                <q-icon
                    :name="
                        editedTeam?.rink?.id
                            ? 'check_circle'
                            : 'radio_button_unchecked'
                    "
                    size="1.1em"
                />
                <div>Set team rink</div>
            </div>

            <div class="row justify-between items-center q-pa-sm help__footer">
                <Button
                    color="white"
                    text-color="slate"
                    @click="close"
                    :disabled="saving"
                    >Cancel</Button
                >
                <Button
                    color="mint"
                    @click="save"
                    :disable="saveDisabled || saving"
                    :loading="saving"
                    >Save</Button
                >
            </div>
        </div>
        <TeamDelete
            :teamId="teamId"
            @close="deleteConfirmationOpen = false"
            v-if="!isCreating && deleteConfirmationOpen"
        />
    </div>
</template>
<style lang="scss" scoped>
.edit__container {
    left: 0;
    right: 0;

    margin: auto;
    width: fit-content;
    z-index: 10;
    pointer-events: all;
    max-width: 450px;
    line-height: 1.1;
    h3 {
        @include smmd-text;
    }
    span {
        line-height: 0.5;
    }
}
.edit__container,
.help__container {
    position: absolute;
    bottom: 25px;
    @include sm {
        bottom: 100px;
    }
    left: 0;
    right: 0;

    margin: 0px auto;
}
.help--overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 10;
    pointer-events: none;

    .help__container {
        width: fit-content;
        min-width: min(400px, 90vw);
        background-color: white;
        color: $app-mint;
        border-radius: 16px;
        font-family: $font-family-header;
        font-size: 1.2rem;
        box-shadow: $pretty-shadow;
        @include chunky-border(4px);
        overflow: hidden;
        .edit-option {
            pointer-events: all;
            margin: var(--space-xs);
            padding: var(--space-xs);
            transition: transform 0.2s;
            cursor: pointer;
            &:hover,
            &.active {
                transform: scale(1.1);
                background-color: $app-mint;
                color: white;

                border-radius: 16px;
                box-shadow: $pretty-shadow;
            }
            div {
                line-height: 1;
            }
            .q-icon {
                margin-top: -2px;
                margin-right: var(--space-xs);
            }
        }
        .help__footer {
            pointer-events: all;
        }

        .help__header {
            padding: var(--space-xs);
            background-color: $app-mint;
            color: white;
            @include smmd-text;
            pointer-events: all;
        }
    }
    .delete--container {
        pointer-events: all;
        margin: var(--space-xs);
        padding: var(--space-xs);
    }
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import { VALIDATION_RULES } from "@/constants/validation";
import { useUserTeamStore } from "@/store/user-teams";
import { useQueryClient } from "@tanstack/vue-query";
const queryClient = useQueryClient();
const MAX_NAME_LENGTH = 25;
const nameInput = ref(null);
const nameError = computed(() => nameInput.value?.hasError);
const { defaultAvatar } = useAvatar();

const props = defineProps({
    teamId: Number,
});

const isCreating = computed(() => Number.isNaN(props.teamId));

const { getColor } = useColor();

const emit = defineEmits(["close"]);

const editingName = ref(false);

const { editedTeam, init, toggleEditing } = useEditTeam();

const setNewAvatar = (file) => {
    const { file: img, path } = file;
    editedTeam.value.avatar = {
        file: img,
        url: window.URL.createObjectURL(img),
        path,
    };
};

const searchRink = () => {
    useDialogStore().toggleGlobalSearch({
        open: true,
        options: {
            resourceTypes: ["rink"],
            inputLabel: "Search for a home rink",
            callback: (val) => {
                editedTeam.value.rink = val;
            },
        },
    });
};

const saveDisabled = computed(
    () => !editedTeam?.value?.name || !editedTeam.value?.rink?.id
);

const saving = ref(false);
const save = async () => {
    saving.value = true;
    const { $api } = useNuxtApp();
    if (props.teamId) {
        await $api.updateTeam(editedTeam.value);
        queryClient.invalidateQueries(["team", "full", props.teamId]);
    } else {
        const teamId = await $api.createTeam(editedTeam.value);
        queryClient.invalidateQueries(["team", "full", props.teamId]);
        await useUserTeamStore().fetchUserTeams(true);
        toggleEditing(false);
        return navigateTo(`/teams/${teamId}`);
    }
    saving.value = false;
    close();
};

const close = () => {
    if (isCreating.value) {
        navigateTo("/");
    } else {
        toggleEditing(false, true);
    }
};

const deleteConfirmationOpen = ref(false);

onBeforeMount(() => {
    init(props.teamId);
});
</script>
