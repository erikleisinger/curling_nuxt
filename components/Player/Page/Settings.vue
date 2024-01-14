<template>
    <main class="player-settings__container">
        <section name="profile" class="player-settings__section">
            <header>
                <h2>Profile</h2>
                <q-separator />
            </header>
            <PlayerPageSettingsField
                title="First name"
                v-model="editedFirstName"
                value="first_name"
                :playerId="playerId"
            />
            <PlayerPageSettingsField
                title="Last name"
                v-model="editedLastName"
                value="last_name"
                :playerId="playerId"
            />
            <PlayerPageSettingsField
                title="Username"
                v-model="editedUserName"
                value="username"
                :playerId="playerId"
            />
            <PlayerPageSettingsField
                title="Home rink"
                v-model="editedRink"
                value="rink_id"
                :playerId="playerId"
            >
                <template v-slot:display="{ value }">
                    {{ value?.name }}
                </template>
            </PlayerPageSettingsField>
            <!-- <PlayerPageSettingsField
                title="Timezone"
                v-model="editedTimezone"
                value="timezone"
                :playerId="playerId"
            >
                <template v-slot:selection>
                    <q-select
                    
                        :options="
                            Intl.supportedValuesOf('timeZone').map((val) => ({
                                value: val,
                                label: val,
                            }))
                        "

                        use-input
                        clearable
                       
                    />
                </template>
            </PlayerPageSettingsField> -->
            <div class="full-width q-mt-md row justify-center">
            <Button color="mint" @click="emit('editAvatar')">Edit avatar</Button>
            </div>
        </section>
    </main>
</template>
<style lang="scss" scoped>
.player-settings__container {
    padding: var(--space-sm);
    .player-settings__section {
        border-radius: 16px;
        background-color: white;
        box-shadow: $pretty-shadow;
        padding: var(--space-sm);
        header {
            padding: var(--space-xs) 0px;
            .q-separator {
                margin-top: var(--space-sm);
                background-color: $app-mint;
            }
        }

        h2 {
            @include smmd-text;
        }
        h5 {
            line-height: 1;
            color: rgba(0, 0, 0, 0.9);
            font-size: 1rem;
        }
    }
}
</style>
<script setup>
import Player from "@/store/models/player";
const props = defineProps({
    playerId: String,
});

const emit = defineEmits(['editAvatar'])

const player = computed(() =>
    useRepo(Player).with("rink").where("id", props.playerId).first()
);

// EDITING

const editedFirstName = ref(player?.value?.first_name);
const editedLastName = ref(player?.value?.last_name);
const editedUserName = ref(player?.value?.username);
const editedRink = ref(player?.value?.rink);
const editedTimezone = ref(player?.value?.timezone);
</script>
