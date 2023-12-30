<template>
    <div class="container">
        <slot />
        <div class="overlay clickable">
            <q-menu v-model="menuOpen">
                <q-list>
                    <q-item
                        clickable
                        v-ripple
                        @click="navigateTo(`/player/${player.player_id}`)"
                    >
                        <q-item-section avatar>
                            <q-icon name="visibility" />
                        </q-item-section>
                        <q-item-section label> View player </q-item-section>
                    </q-item>
                    <q-item
                        clickable
                        v-ripple
                        @click="remove"
                        v-if="canRemove && !invited && !requested"
                    >
                        <q-item-section avatar>
                            <q-icon
                                :name="
                                    requested
                                        ? 'question_answer'
                                        : 'person_remove'
                                "
                            />
                        </q-item-section>
                        <q-item-section label>
                            Remove from team
                        </q-item-section>
                    </q-item>
                    <q-item
                        clickable
                        v-ripple
                        @click="remove"
                        v-if="canRespond && (invited || requested)"
                    >
                        <q-item-section avatar>
                            <q-icon name="question_answer" />
                        </q-item-section>
                        <q-item-section label>
                            {{
                                invited
                                    ? "Cancel invitation"
                                    : "Respond to request"
                            }}
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple v-if="canEditPosition">
                        <q-item-section avatar>
                            <q-icon name="groups" />
                        </q-item-section>
                        <q-item-section label> Edit position </q-item-section>
                        <q-menu>
                            <q-item
                                v-for="position in Object.keys(TEAM_POSITIONS)"
                                :key="position"
                                @click="changePlayerPosition(position)"
                                clickable
                                v-ripple
                            >
                                <!-- <q-item-section avatar>
                                    <q-icon :name="TEAM_POSITIONS[position].icon"/>
                                </q-item-section>        -->
                                <q-item-section label>
                                    {{ TEAM_POSITIONS[position].name }}
                                </q-item-section>
                            </q-item>
                        </q-menu>
                    </q-item>
                    <q-item
                        clickable
                        v-ripple
                        v-if="canCancel"
                        @click="onRemove"
                    >
                        <q-item-section avatar>
                            <q-icon name="speaker_notes_off" />
                        </q-item-section>
                        <q-item-section label> Cancel request </q-item-section>
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
                <div class="text-h6" v-else-if="requestStatus === 'invited'">
                    Cancel invitation to {{ playerName }}?
                </div>
                <div class="text-h6" v-else-if="requestStatus === 'requested'">
                    {{ playerName }} has requested to join the team.
                </div>
            </q-card-section>
            <q-card-actions class="row justify-between">
                <q-btn
                    v-if="requestStatus === 'requested'"
                    flat
                    color="red"
                    @click="decline"
                    >Decline request</q-btn
                >
                <q-btn flat @click="confirmOpen = false" v-else>Back</q-btn>
                <q-btn
                    flat
                    color="green"
                    v-if="requestStatus === 'requested'"
                    @click="approve"
                    >Approve request</q-btn
                >
                <q-btn flat color="red" @click="onRemove" v-else>{{
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
import {useUserTeamStore} from '@/store/user-teams'
import { useQueryClient } from "@tanstack/vue-query";
import Player from "@/store/models/player";
import TeamPlayer from "@/store/models/team-player";
import { TEAM_POSITIONS } from "@/constants/team";

const queryClient = useQueryClient();

const props = defineProps({
    canCancel: Boolean,
    canEditPosition: Boolean,
    canRemove: Boolean,
    canRespond: Boolean,
    editing: Boolean,
    invited: Boolean,
    playerId: String,
    requested: Boolean,
    teamId: Number,
});

const emit = defineEmits(['end'])
const remove = () => {
    menuOpen.value = false;
    confirmOpen.value = true;
};
const confirmOpen = ref(false);

const player = computed(() => {
    const p = useRepo(TeamPlayer)
        .with("player")
        .where("player_id", props.playerId)
        .where("team_id", props.teamId)
        .first();
    return {
        ...p,
        ...p.player,
    };
});
const requestStatus = computed(() => player.value?.status);
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
    if (errors) console.error(errors);
};

const removing = ref(false);

const onRemove = async () => {
    removing.value = true;

    if (requestStatus.value) {
        if (requestStatus.value === "requested") {
            await useTeamRequestStore().deleteTeamRequest({
                teamId: props.teamId,
                profileId: props.playerId,
            });
        } else if (requestStatus.value === "invited") {
            await useTeamRequestStore().deleteTeamInvitation({
                teamId: props.teamId,
                profileId: props.playerId,
            });
        }
    } else {
        const {user:userId} = useUser();
        await removePlayer();
        if (userId.value === props.playerId) {
            useUserTeamStore().fetchUserTeams(true)
            emit('end')
        }
    }

    queryClient.invalidateQueries({
        queryKey: ["team", "players", props.teamId],
    });

    removing.value = false;
    confirmOpen.value = false;
};

const decline = async () => {
    removing.value = true;
    const client = useSupabaseClient();
    await client
        .from("team_requests")
        .update({
            status: "rejected",
        })
        .eq("team_id", props.teamId)
        .eq("requester_profile_id", props.playerId);

    queryClient.invalidateQueries({
        queryKey: ["team", "players", props.teamId],
    });
    removing.value = false;
    confirmOpen.value = false;
};

const approve = async () => {
    removing.value = true;
    const client = useSupabaseClient();
    await client
        .from("team_requests")
        .update({
            status: "accepted",
        })
        .eq("team_id", props.teamId)
        .eq("requester_profile_id", props.playerId);

    queryClient.invalidateQueries({
        queryKey: ["team", "players", props.teamId],
    });
    removing.value = false;
    confirmOpen.value = false;
};

const menuOpen = ref(false);

const changePlayerPosition = async (position) => {
    menuOpen.value = false;
    const client = useSupabaseClient();
    await client
        .from("team_profile_junction")
        .update({
            position,
        })
        .eq("team_id", props.teamId)
        .eq("profile_id", props.playerId);
    queryClient.invalidateQueries({
        queryKey: ["team", "full", props.teamId],
    });
};
</script>
