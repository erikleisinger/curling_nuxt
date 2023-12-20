<template>
    <div class="container">
        <slot/>
        <div class="overlay clickable" v-if="!disabled" >
            <q-menu v-model="menuOpen">
                <q-list>
                    <q-item clickable v-ripple @click="remove" v-if="canRemove">
                        <q-item-section avatar>
                            <q-icon name="person_remove" />
                        </q-item-section>
                        <q-item-section label>
                            {{pending ? 'Cancel invitation' : 'Remove from team'}}
                        </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple v-if="canEditPosition">
                        <q-item-section avatar>
                            <q-icon name="groups"/>
                        </q-item-section>
                        <q-item-section label>
                            Edit position
                        </q-item-section>
                        <q-menu>
                            <q-item v-for="position in Object.keys(TEAM_POSITIONS)" :key="position" @click="changePlayerPosition(position)" clickable v-ripple>
                                <!-- <q-item-section avatar>
                                    <q-icon :name="TEAM_POSITIONS[position].icon"/>
                                </q-item-section>        -->
                                <q-item-section label>
                                    {{TEAM_POSITIONS[position].name}}
                                </q-item-section>
                            </q-item>
                        </q-menu>
                    </q-item>
                </q-list>
            </q-menu>
        </div>
    </div>
    <q-dialog v-model="confirmOpen">
        <q-card
            v-if="removing"
            style="min-width: 200px"
            class="column items-center q-pb-sm q-pa-md"
        >
            <div class="q-mb-sm">Removing {{ playerName }}...</div>
            <q-circular-progress indeterminate size="sm" />
        </q-card>
        <q-card v-else>
            <q-card-section>
                <div class="text-h6" v-if="!requestStatus">
                    Remove {{ playerName }} from team?
                </div>
                <div class="text-h6" v-else>
                    Cancel invitation to {{ playerName }}?
                </div>
            </q-card-section>
            <q-card-actions class="row justify-between">
                <q-btn flat @click="confirmOpen = false">Back</q-btn>
                <q-btn flat color="red" @click="onRemove">{{
                    requestStatus ? "Cancel invitation" : "Remove"
                }}</q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<style lang="scss" scoped>
.container {
    position: relative;
    height: 100%;
    width: 100%;
    .overlay {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
    }
}

</style>
<script setup>
import { useTeamRequestStore } from "@/store/team-requests";
import { useQueryClient } from "@tanstack/vue-query";
import Player from "@/store/models/player";
import TeamPlayer from "@/store/models/team-player";
import {TEAM_POSITIONS} from '@/constants/team'

const queryClient = useQueryClient();

const props = defineProps({
    canEditPosition: Boolean,
    canRemove: Boolean,
    disabled: Boolean,
    pending: Boolean,
    playerId: String,
    teamId: Number,
});
const remove = () => {
    menuOpen.value = false;
    confirmOpen.value = true;
};
const confirmOpen = ref(false);

const player = computed(() =>
    useRepo(Player).where("id", props.playerId).first()
);
const requestStatus = computed(
    () =>
        useRepo(TeamPlayer)
            .where("team_id", props.teamId)
            .where("player_id", props.playerId)
            .first()?.status ?? null
);
const playerName = computed(
    () => `${player.value.first_name} ${player.value.last_name}`
);

const removePlayer = async () => {
    const client = useSupabaseClient();
    const { errors } = await client
        .from("team_profile_junction")
        .delete()
        .eq("profile_id", props.playerId)
        .eq("team_id", props.teamId);
    console.log(errors);
    if (errors) console.error(errors);
};

const removing = ref(false);

const onRemove = async () => {
    removing.value = true;

    if (requestStatus.value) {
        await useTeamRequestStore().deleteTeamRequest({
            teamId: props.teamId,
            profileId: props.playerId,
        });
    } else {
        await removePlayer();
    }

    queryClient.invalidateQueries({
        queryKey: ["team", "full", props.teamId],
    });

    removing.value = false;
    confirmOpen.value = false;
};

const menuOpen = ref(false)

const changePlayerPosition = async (position) => {
    menuOpen.value = false;
    const client = useSupabaseClient();
    await client.from('team_profile_junction').update({
        position
    }).eq('team_id', props.teamId).eq('profile_id', props.playerId);
    queryClient.invalidateQueries({
        queryKey: ["team", "full", props.teamId],
    });
}
</script>
