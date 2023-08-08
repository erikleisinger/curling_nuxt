<template>
    <q-item-section
        :style="{ transform: deleteOpen ? 'translateX(-3em)' : '' }"
        ref="teamItem"
        style="transition: transform 0.3s; display: block"
    >
        <div style="max-height: 2em; position: relative" class="q-my-sm"></div>

        <div class="row team-players--wrap" v-if="hasPlayers()">
            <div class="col-12 col-sm-6 team-player__container">
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.fourth_player_id?.avatar)"
                    :player="item.fourth_player_id ?? {}"
                    position="Fourth"
                />
                <div class="row items-center justify-end" v-if="!readOnly" >
                <q-btn flat  round :icon="item.lead_player_id?.id ? 'change_circle' : 'add'" color="grey-8" @click="openPlayerSelector('lead')"></q-btn>
                </div>
            </div>
            <div class="col-12 col-sm-6 team-player__container">
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.third_player_id?.avatar)"
                    :player="item.third_player_id ?? {}"
                    position="Third"
                />
                  <div class="row items-center justify-end" v-if="!readOnly" >
                <q-btn flat  round :icon="item.third_player_id?.id ? 'change_circle' : 'add'" color="grey-8" @click="openPlayerSelector('second')"></q-btn>
                </div>
            </div>
            <div class="col-12 col-sm-6 team-player__container">
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.second_player_id?.avatar)"
                    :player="item.second_player_id ?? {}"
                    position="Second"
                />
              <div class="row items-center justify-end" v-if="!readOnly" >
                <q-btn flat  round :icon="item.second_player_id?.id ? 'change_circle' : 'add'" color="grey-8" @click="openPlayerSelector('third')"></q-btn>
                </div>
            </div>

            <div class="col-12 col-sm-6 team-player__container">
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.lead_player_id?.avatar)"
                    :player="item.lead_player_id ?? {}"
                    position="Lead"
                />
                  <div class="row items-center justify-end" v-if="!readOnly" >
                <q-btn flat  round :icon="item.lead_player_id?.id ? 'change_circle' : 'add'" color="grey-8" @click="openPlayerSelector('fourth')"></q-btn>
                </div>
            </div>

            <div class="col-12 col-sm-6 team-player__container">
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.fifth_player_id?.avatar)"
                    :player="item.fifth_player_id ?? {}"
                    position="Fifth"
                />
               <div class="row items-center justify-end" v-if="!readOnly" >
                <q-btn flat  round :icon="item.fifth_player_id?.id ? 'change_circle' : 'add'" color="grey-8" @click="openPlayerSelector('fifth')"></q-btn>
                </div>
            </div>
            <div class="col-12 col-sm-6 team-player__container"    v-if="item.fifth_player_id?.id">
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.sixth_player_id?.avatar)"
                    :player="item.sixth_player_id ?? {}"
                    v-if="item.fifth_player_id?.id"
                    position="Sixth"
                />
                  <div class="row items-center justify-end" v-if="!readOnly" >
                <q-btn flat  round :icon="item.sixth_player_id?.id ? 'change_circle' : 'add'" color="grey-8" @click="openPlayerSelector('sixth')"></q-btn>
                </div>
            </div>
            <div class="col-12 col-sm-6 team-player__container"   v-if="item.sixth_player_id?.id">
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.seventh_player_id?.avatar)"
                    :player="item.seventh_player_id ?? {}"
                  
                    position="Seventh"
                />
                   <div class="row items-center justify-end" v-if="!readOnly" >
                <q-btn flat  round :icon="item.seventh_player_id?.id ? 'change_circle' : 'add'" color="grey-8" @click="openPlayerSelector('seventh')"></q-btn>
                </div>
            </div>
        </div>
        <div
            class="row no-wrap justify-center items-center text-sm text-italic"
            style="height: 4em"
            v-else
        >
            {{ item.name }} has no players!
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
.team-players--wrap {
    .team-player__container {
        display: grid;
        grid-template-columns: v-bind(columns);
        padding: var(--space-sm);

        border-bottom: 1px solid $grey-3;
    }
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
</style>
<script setup lang="ts">
import { useSwipe, useThrottleFn } from "@vueuse/core";
import { TABLE_NAMES } from "@/constants/tables";
import { useTeamStore } from "@/store/teams";
import { useEditorStore } from "@/store/editor";
import { useUserStore } from "@/store/user";
const props = defineProps({
    item: Object,
});

const loading = ref(false);

const teamStore = useTeamStore();
const { removePlayerFromTeam, addPlayerToTeam } = teamStore;

const hasPlayers = () => {
    return (
        !!props.item?.lead_player_id?.id ||
        !!props.item?.second_player_id?.id ||
        !!props.item?.third_player_id?.id ||
        !!props.item?.fourth_player_id?.id ||
        !!props.item?.fifth_player_id?.id ||
        !!props.item?.sixth_player_id?.id ||
        !!props.item?.seventh_player_id?.id
    );
};

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

const readOnly = computed(() => useUserStore().id !== props.item?.profile_id);

const columns = computed(() => readOnly.value ? '30% 70%' : '30% auto auto')
</script>
