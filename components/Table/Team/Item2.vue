<template>
    <q-item-section
        :style="{ transform: deleteOpen ? 'translateX(-3em)' : '' }"
        ref="teamItem"
        style="transition: transform 0.3s; display: block"
    >
        <div class="row no-wrap" >
            <div class="row table-team__section full-width">
                <div
                    class="q-mt-xs team-player__container--test"
    
                >
                    <TeamAvatar
                        :parsedAvatar="parseAvatar(skip.avatar)"
                        :team="item"
                    >
                    </TeamAvatar>
                    <div
                        class="truncate-text col-auto q-pl-xs q-ml-xs column justify-center text-lg text-bold"
                    >
                        <q-item-label overline>Team</q-item-label>
                        <InputName :name="teamName" v-if="teamName" @save="saveName" :disabled="!canEdit">
                            <q-item-label class="truncate-text">
                                <span>
                                    {{ teamName }}
                                </span>
                            </q-item-label>
                        </InputName>
                    </div>
                </div>
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
.team-player__container--test {
    display: grid;
    grid-template-columns: max(70px, 15vw) 1fr
}
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
import { useSwipe, useThrottleFn } from "@vueuse/core";
import { TABLE_NAMES } from "@/constants/tables";
import { useTeamStore } from "@/store/teams";
import { useEditorStore } from "@/store/editor";
import {useUserStore} from '@/store/user'

const userStore = useUserStore();



const props = defineProps({
    item: Object,
});

const canEdit = computed(() => userStore.id === props.item?.profile_id)

const teamName = computed(() => props.item?.name || skip.value?.name || 'Unknown')

const skip = computed(() => {
    if (!props?.item) return null;
    if (props?.item?.skip?.id) return props.item.skip;
    const closestPosition = [
        "fourth",
        "third",
        "second",
        "lead",
        "fifth",
        "sixth",
        "seventh",
    ].find((position) => !!props.item[`${position}_player_id`]?.id);
    return closestPosition
        ? props.item[`${closestPosition}_player_id`]
        : props.item.fourth_player_id;
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

// const openPlayerSelector = (position: string) => {
//     const editorStore = useEditorStore();
//     editorStore.togglePlayerSelect({
//         open: true,
//         onSelect: (playerId: number) => {
//             addPlayer(playerId, position);
//         },
//     });
// };

// const addPlayer = async (playerId: number, position: string) => {
//     const teamId = props.item?.id;
//     if (!position || !playerId || !teamId) {
//         console.error(
//             "error adding player to team: no player or position or team specified: ",
//             position,
//             teamId,
//             playerId
//         );
//         return;
//     }
//     await teamStore.addPlayerToTeam(playerId, teamId, position);
// };


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
