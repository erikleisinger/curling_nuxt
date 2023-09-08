<template>
    <div>
        <div class="column team__header items-center">
            <div class="avatar__container q-mb-sm">
                <TeamAvatar
                    :teamId="teamId"
                    :viewable="false"
                    :editable="canEdit"
                    @update="emit('update', { avatar: $event })"
                    :create="create"
                />
            </div>

            <div class="column items-center">
                <div class="text-sm">Team</div>
                <TeamName
                    :canEdit="canEdit"
                    :teamId="teamId"
                    :create="create"
                    @update="emit('update', { name: $event })"
                />
                <!-- <div class="row items-center">
                                <q-icon class="text-sm" name="home" color="grey-8"/>
                            <h2 class="text-sm">St. Vital Curling Club</h2>
                            </div> -->
            </div>
        </div>
        <slot v-if="!create" />
        <div v-if="showPlayers">
            <TeamPlayerList
                :teamId="teamId"
                :showPending="canEdit"
                :create="create"
                @update="emit('update', { players: $event })"
                @loaded="emit('loaded')"
            >
                <template v-slot:title="{ editing, setEditing, loading }">
                    <div class="row justify-between items-end q-my-sm">
                        <div class="row items-center">
                            <q-icon
                                name="groups_2"
                                color="primary"
                                class="text-md q-mr-sm"
                            />
                            <h2 class="text-md text-bold">Team members</h2>

                            <q-circular-progress
                                v-if="loading"
                                indeterminate
                                color="primary"
                                class="q-ml-sm"
                            />
                        </div>
                        <div v-if="canEdit && !create">
                            <q-btn
                                :icon="editing ? 'close' : 'edit'"
                                flat
                                round
                                dense
                                :color="editing ? 'blue' : 'grey-7'"
                                padding="4px"
                                @click="setEditing(!editing)"
                            />
                        </div>
                    </div>
                    <q-separator />
                </template>
            </TeamPlayerList>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.team__header {
    padding: var(--space-lg);
    padding-bottom: var(--space-sm);

    .avatar__container {
        height: v-bind(avatarWidth);
        max-width: 100%;
        width: v-bind(avatarWidth);
    }
    .edit--floating {
        position: absolute;
        top: 0;
        right: -1.5em;
    }
}
</style>
<script setup>
const props = defineProps({
    avatarWidth: {
        type: String,
        default: "7em",
    },
    canEdit: Boolean,
    create: Boolean,
    showPlayers: Boolean,
    teamId: Number,
});

const emit = defineEmits(['loaded', "update"]);
</script>
