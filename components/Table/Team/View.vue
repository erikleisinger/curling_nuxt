<template>
    <q-item-section
        :style="{ transform: deleteOpen ? 'translateX(-3em)' : '' }"
        ref="teamItem"
        style="transition: transform 0.3s; display: block; height: 100%"
    >
<div style="height: 100%; display: grid" :style="{width: `${parentHeight}px`}">
        <TableTeamPlayer2
                    :parsedAvatar="parseAvatar(item.fourth_player_id?.avatar)"
                    :player="item.fourth_player_id ?? {}"
                    position="fourth"
                    @add="openPlayerSelector('fourth')"
                    @remove="removePlayer(item.id, 'fourth')"
                    :readOnly="readOnly"
                />
                    <TableTeamPlayer2
                    :parsedAvatar="parseAvatar(item.third_player_id?.avatar)"
                    :player="item.third_player_id ?? {}"
                    position="third"
                    @add="openPlayerSelector('third')"
                    @remove="removePlayer(item.id, 'third')"
                    :readOnly="readOnly"
                />
                
                <TableTeamPlayer2
                    :parsedAvatar="parseAvatar(item.second_player_id?.avatar)"
                    :player="item.second_player_id ?? {}"
                    position="second"
                    @add="openPlayerSelector('second')"
                    @remove="removePlayer(item.id, 'second')"
                    :readOnly="readOnly"
                />

                <TableTeamPlayer2
                    :parsedAvatar="parseAvatar(item.lead_player_id?.avatar)"
                    :player="item.lead_player_id ?? {}"
                    position="lead"
                    @add="openPlayerSelector('lead')"
                    @remove="removePlayer(item.id, 'lead')"
                    :readOnly="readOnly"
                />

            

            
</div>
            <!-- <div class="col-6 table-team__section q-ml-xs col-shrink">
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
            </div> -->
        <!-- </div> -->
          <!-- <div class="row no-wrap justify-center items-center text-sm text-italic " style="height: 4em" v-else>
                {{item.name}} has no players!
          </div> -->
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
    min-width: 0;
    overflow: hidden;

    // For TableTeamPlayer
    :deep(.team-player__container) {
        display: grid;
        grid-template-columns: 30% 70%;
        grid-template-rows: 1fr;
        .avatar__blank {
            margin-top: 0.4em;
            margin-bottom: 0.4em;
            width: 93%;
            border-radius: 50%;
            border: 1px solid #ddd;
            background: #eee;
            margin-left: 0.15em;
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
import { useElementSize, useSwipe, useThrottleFn } from "@vueuse/core";
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

const hasPlayers = () => {
    return  !!props.item?.lead_player_id?.id ||
        !!props.item?.second_player_id?.id ||
        !!props.item?.third_player_id?.id ||
        !!props.item?.fourth_player_id?.id || 
        !!props.item?.fifth_player_id?.id || 
        !!props.item?.sixth_player_id?.id ||  
        !!props.item?.seventh_player_id?.id
}


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

const {height: parentHeight} = useElementSize(teamItem)

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
