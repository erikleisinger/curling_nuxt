<template>
    <q-item-section
        :style="{ transform: deleteOpen ? 'translateX(-3em)' : '' }"
        ref="teamItem"
        style="transition: transform 0.3s; display: block"
    >


        <!-- <div style="max-height: 2em; position: relative" class="q-my-sm">
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
        </div> -->

        <div class="row no-wrap" v-if="!readOnly || hasPlayers()">
       
            <div class="row table-team__section full-width ">
      <!-- , 'fifth', 'sixth', 'seventh' -->
         <!-- :key="`${item.id}-${position}`" -->
                 <!-- v-for="position in ['fourth','third','second','lead']" -->
                               <!-- @add="openPlayerSelector(skipPosition)" -->
                    <!-- @remove="removePlayer(item[`${skipPosition}_player_id`].id, skipPosition)" -->
                         <!-- :position="skipPosition" -->
                <TableTeamSkip
        
             
                    :parsedAvatar="parseAvatar(skip.avatar)"
                    :team="item"
                    :name="skip?.name || 'Unknown'"
               
      
                    :readOnly="readOnly"
                    v-memo="[skip]"
                    active
                    style="order: 1"
                />
                  <!-- :style="{order: skipId && item[`${position}_player_id`]?.id === skipId ? '1' : '2'}" -->
                    <!-- :active="skipId && item[`${position}_player_id`]?.id === skipId" -->
            </div>
                <!-- <div style="max-height: 2em; position: relative" class="q-my-sm" v-if="item.skip_id">
                    SKIP
        <Avataaar v-bind="parseAvatar(item.skip.avatar)"/>
    </div> -->
            <!-- <div class="col-6 table-team__section q-mr-xs col-shrink">
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.lead_player_id?.avatar)"
                    :player="item.lead_player_id ?? {}"
                    position="lead"
                    @add="openPlayerSelector('lead')"
                    @remove="removePlayer(item.id, 'lead')"
                    :readOnly="readOnly"
                    v-memo="[item.lead_player_id.id, item.lead_player_id.avatar, item.lead_player_id.name]"
                />

                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.second_player_id?.avatar)"
                    :player="item.second_player_id ?? {}"
                    position="second"
                    @add="openPlayerSelector('second')"
                    @remove="removePlayer(item.id, 'second')"
                    :readOnly="readOnly"
                     v-memo="[item.second_player_id.id, item.second_player_id.avatar, item.second_player_id.name]"
                />

                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.third_player_id?.avatar)"
                    :player="item.third_player_id ?? {}"
                    position="third"
                    @add="openPlayerSelector('third')"
                    @remove="removePlayer(item.id, 'third')"
                    :readOnly="readOnly"
                     v-memo="[item.third_player_id.id, item.third_player_id.avatar, item.third_player_id.name]"
                />

                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.fourth_player_id?.avatar)"
                    :player="item.fourth_player_id ?? {}"
                    position="fourth"
                    @add="openPlayerSelector('fourth')"
                    @remove="removePlayer(item.id, 'fourth')"
                    :readOnly="readOnly"
                     v-memo="[item.fourth_player_id.id, item.fourth_player_id.avatar, item.fourth_player_id.name]"
                />
            </div> -->
            <!-- <div class="col-6 table-team__section q-ml-xs col-shrink">
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.fifth_player_id?.avatar)"
                    :player="item.fifth_player_id ?? {}"
                    position="fifth"
                    @add="openPlayerSelector('fifth')"
                    @remove="removePlayer(item.id, 'fifth')"
                    :readOnly="readOnly"
                     v-memo="[item.fifth_player_id.id, item.fifth_player_id.avatar, item.fifth_player_id.name]"
                />

                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.sixth_player_id?.avatar)"
                    :player="item.sixth_player_id ?? {}"
                    v-if="item.fifth_player_id?.id"
                    position="sixth"
                    @add="openPlayerSelector('sixth')"
                    @remove="removePlayer(item.id, 'sixth')"
                    :readOnly="readOnly"
                     v-memo="[item.sixth_player_id.id, item.sixth_player_id.avatar, item.sixth_player_id.name]"
                />
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.seventh_player_id?.avatar)"
                    :player="item.seventh_player_id ?? {}"
                    v-if="item.sixth_player_id?.id"
                    position="seventh"
                    @add="openPlayerSelector('seventh')"
                    @remove="removePlayer(item.id, 'seventh')"
                    :readOnly="readOnly"
                     v-memo="[item.seventh_player_id.id, item.seventh_player_id.avatar, item.seventh_player_id.name]"
                />
            </div> -->
        </div>
          <div class="row no-wrap justify-center items-center text-sm text-italic " style="height: 4em" v-else>
                {{item.name}} has no players!
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
    // display: grid;
    // grid-template-columns: 1fr;
    // grid-template-rows: repeat(4, 1fr);
    // min-width: 0;
    // overflow: hidden;

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
import { useSwipe, useThrottleFn } from "@vueuse/core";
import { TABLE_NAMES } from "@/constants/tables";
import { useTeamStore } from "@/store/teams";
import { useEditorStore } from "@/store/editor";
const props = defineProps({
    item: Object,
    readOnly: Boolean,
});

const skip = computed(() => {
    if (!props?.item) return null;
    if (props?.item?.skip?.id) return props.item.skip;
    const closestPosition = [ 'fourth','third','second','lead', 'fifth', 'sixth', 'seventh'].find((position) => !!props.item[`${position}_player_id`]?.id);
    return closestPosition ? props.item[`${closestPosition}_player_id`] : props.item.fourth_player_id
})

// const skipId = computed(() => {
//     if (!props?.item) return null;
//     if (props?.item?.skip_id) return props.item.skip_id;
//     const closestPosition = [ 'fourth','third','second','lead', 'fifth', 'sixth', 'seventh'].find((position) => !!props.item[`${position}_player_id`]?.id);
//     if (!closestPosition) return null;
//     return props.item[`${closestPosition}_player_id`]?.id
// })

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

onUpdated(() => {
    console.log('TEAM ITEM UPDATED: ', props.item.name)
})
</script>
