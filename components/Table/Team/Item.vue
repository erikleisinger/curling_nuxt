<template>
    <q-item-section
        :style="{ transform: deleteOpen ? 'translateX(-3em)' : '' }"
        ref="teamItem"
        style="transition: transform 0.3s; display: block"
        
   
    >
        <div style="max-height: 2em; position: relative" class="q-my-sm">
            <InputName :name="item.name" @save="saveName" :disabled="readOnly">
                <template v-slot:text>
                    <h2 class="text-md text-bold truncate-text">
                        {{ item.name }}
                    </h2>
                </template>
            </InputName>
            <div
                style="
                    position: absolute;
                    top: 0;
                    right: 0;
                    height: 10px;
                    height: 100%;
                "
                class="row items-center"
            >
                <q-badge
                    v-if="
                        item.subject === 'requester' &&
                        item.status === 'pending'
                    "
                    outline
                    rounded
                    click
                    color="orange"
                    :label="`Pending`"
                    @click="
                        cancelRequest({
                            team_id: item.id,
                            requestee_profile_id: item.profile_id,
                        })
                    "
                ></q-badge>
                <q-badge
                    v-else-if="
                        item.subject === 'requestee' &&
                        item.status !== 'accepted' &&
                        item.status !== 'rejected'
                    "
                    outline
                    rounded
                    click
                    color="pink"
                    :label="`Incoming request`"
                >
                    <q-btn
                        flat
                        round
                        size="sm"
                        @click="
                            confirmRequest({
                                team_id: item.id,
                                requester_profile_id: item.requester_id,
                            })
                        "
                        >Y</q-btn
                    >
                    <q-btn
                        flat
                        round
                        size="sm"
                        @click="
                            denyRequest({
                                team_id: item.id,
                                requester_profile_id: item.requester_id,
                            })
                        "
                        >N</q-btn
                    >
                </q-badge>
                <q-badge
                    v-else-if="
                        item.status === 'accepted' &&
                        item.subject !== 'requestee'
                    "
                    outline
                    rounded
                    click
                    color="positive"
                    :label="'Request accepted'"
                ></q-badge>
                <q-badge
                    v-else-if="
                        item.status === 'rejected' &&
                        item.subject !== 'requestee'
                    "
                    outline
                    rounded
                    click
                    color="negative"
                    :label="'Request rejected'"
                ></q-badge>
                <q-badge
                    v-else-if="readOnly"
                    outline
                    rounded
                    click
                    color="grey-8"
                    :label="'Request access'"
                    @click="
                        requestAccess({
                            team_id: item.id,
                            requestee_profile_id: item.profile_id,
                        })
                    "
                ></q-badge>
            </div>
        </div>

        <div  class="row  no-wrap">
            <div class="col-6 table-team__section q-mr-xs col-shrink">
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.lead_player_id?.avatar)"
                    :player="item.lead_player_id ?? {}"
                    position="lead"
                    @add="openPlayerSelector('lead')"
                    @remove="removePlayer(item.id, 'lead')"
                    :readOnly="readOnly"
                />

                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.second_player_id?.avatar)"
                    :player="item.second_player_id ?? {}"
                    position="second"
                    @add="openPlayerSelector('second')"
                    @remove="removePlayer(item.id, 'second')"
                    :readOnly="readOnly"
                />

                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.third_player_id?.avatar)"
                    :player="item.third_player_id ?? {}"
                    position="third"
                    @add="openPlayerSelector('third')"
                    @remove="removePlayer(item.id, 'third')"
                    :readOnly="readOnly"
                />

                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.fourth_player_id?.avatar)"
                    :player="item.fourth_player_id ?? {}"
                    position="fourth"
                    @add="openPlayerSelector('fourth')"
                    @remove="removePlayer(item.id, 'fourth')"
                    :readOnly="readOnly"
                />
            </div>
            <div class="col-6 table-team__section q-ml-xs col-shrink">
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.fifth_player_id?.avatar)"
                    :player="item.fifth_player_id ?? {}"
                    position="fifth"
                    @add="openPlayerSelector('fifth')"
                    @remove="removePlayer(item.id, 'fifth')"
                    :readOnly="readOnly"
                />

                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.sixth_player_id?.avatar)"
                    :player="item.sixth_player_id ?? {}"
                    v-if="item.fifth_player_id?.id"
                    position="sixth"
                    @add="openPlayerSelector('sixth')"
                    @remove="removePlayer(item.id, 'sixth')"
                    :readOnly="readOnly"
                />
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.seventh_player_id?.avatar)"
                    :player="item.seventh_player_id ?? {}"
                    v-if="item.sixth_player_id?.id"
                    position="seventh"
                    @add="openPlayerSelector('seventh')"
                    @remove="removePlayer(item.id, 'seventh')"
                    :readOnly="readOnly"
                />
            </div>
        </div>
    </q-item-section>
    <transition
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
    >
        <div
            class="delete__section row justify-center items-center"
            v-if="deleteOpen"
            @click="deleteItem"
        >
            <q-icon flat round name="delete" size="md" />
        </div>
    </transition>
</template>
<style lang="scss" scoped>
.delete__section {
    position: absolute;
    right: 0;
    top: 0;
    width: calc(3em + 16px);
    background-color: $negative;
    height: 100%;
    color: white;
}
.table-team__section {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
    min-width:0;
    overflow: hidden;

    // For TableTeamPlayer
    :deep(.team-player__container) {
    display: grid;
    grid-template-columns: 30% 70%;
    grid-template-rows: 1fr;
    column-gap: 8px;
     .avatar__blank {
        width: 90%;
        border-radius: 50%;
        border: 1px solid #ddd;
        background: #eee;
        aspect-ratio: 1/1;
        font-size: var(--text-sm);
        @include sm {
            font-size: var(--text-md);
        }
    }
}
}
</style>
<script setup lang="ts">
import { useSwipe, useThrottleFn } from "@vueuse/core";
import { TABLE_NAMES } from "@/constants/tables";
import { useTeamStore } from "@/store/teams";
import { useEditorStore } from "@/store/editor";
const props = defineProps({
    item: Object,
    readOnly: Boolean,
});

const loading = ref(false);

const teamStore = useTeamStore();
const { removePlayerFromTeam, addPlayerToTeam } = teamStore;

const removePlayer = async (teamId: number, position: string) => {
    loading.value = true;
    await removePlayerFromTeam(teamId, position);
    loading.value = false;
};

const deleteOpen = ref(false);

const teamItem = ref(null);
const { direction } = useSwipe(teamItem, {
    onSwipe: () => {
        if (direction.value === "right") {
            deleteOpen.value = false;
        } else if (direction.value === "left") {
            deleteOpen.value = true;
        }
    },
});

const emit = defineEmits(["delete", "update"]);

const deleteItem = () => {
    emit("delete");
    deleteOpen.value = false;
};

const openPlayerSelector = (position: string) => {
    const editorStore = useEditorStore();
    editorStore.togglePlayerSelect({
        open: true,
        onSelect: (playerId: number) => {
            addPlayer(playerId, position);
        },
    });
};

const addPlayer = async (playerId: number, position: string) => {
    const teamId = props.item?.id;
    if (!position || !playerId || !teamId) {
        console.error(
            "error adding player to team: no player or position or team specified: ",
            position,
            teamId,
            playerId
        );
        return;
    }
    await teamStore.addPlayerToTeam(playerId, teamId, position);
};

const updateTeamName = async () => {};

const savingName = ref(false);
const saveName = async (name: string) => {
    teamStore.updateTeamName(name, props.item?.id);
};

const requestAccess = useThrottleFn(
    async ({
        team_id,
        requestee_profile_id,
    }: {
        team_id: number;
        requestee_profile_id: string;
    }) => {
        await teamStore.sendTeamRequest({ team_id, requestee_profile_id });
        emit("update", {
            teamId: team_id,
            updates: {
                status: "pending",
                subject: "requester",
            },
        });
    },
    10000
);
const cancelRequest = useThrottleFn(
    async ({
        team_id,
        requestee_profile_id,
    }: {
        team_id: number;
        requestee_profile_id: string;
    }) => {
        await teamStore.cancelTeamRequest({ team_id, requestee_profile_id });
        emit("update", {
            teamId: team_id,
            updates: {
                status: null,
                subject: null,
            },
        });
    },
    10000
);
const confirmRequest = useThrottleFn(
    async ({
        team_id,
        requester_profile_id,
    }: {
        team_id: number;
        requester_profile_id: string;
    }) => {
        console.log("conf: ", requester_profile_id);
        await teamStore.confirmTeamRequest({ team_id, requester_profile_id });
        emit("update", {
            teamId: team_id,
            updates: {
                status: "accepted",
                subject: null,
            },
        });
    },
    10000
);
const denyRequest = useThrottleFn(
    async ({
        team_id,
        requester_profile_id,
    }: {
        team_id: number;
        requester_profile_id: string;
    }) => {
        await teamStore.denyTeamRequest({ team_id, requester_profile_id });
        emit("update", {
            teamId: team_id,
            updates: {
                status: "denied",
                subject: null,
            },
        });
    },
    10000
);
</script>
