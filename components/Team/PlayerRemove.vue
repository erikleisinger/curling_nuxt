<template>
    <slot v-bind:remove="remove" />
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
                <q-btn flat @click="confirmOpen = false">Cancel</q-btn>
                <q-btn flat color="red" @click="onRemove">{{
                    requestStatus ? "Cancel invitation" : "Remove"
                }}</q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script setup>
import { useTeamRequestStore } from "@/store/team-requests";
import { useQueryClient } from "@tanstack/vue-query";
import Player from "@/store/models/player";
import TeamPlayer from "@/store/models/team-player";

const queryClient = useQueryClient();

const props = defineProps({
    playerId: String,
    teamId: Number,
});
const remove = () => {
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
        queryKey: ["team", "players", props.teamId],
    });

    removing.value = false;
    confirmOpen.value = false;
};
</script>
