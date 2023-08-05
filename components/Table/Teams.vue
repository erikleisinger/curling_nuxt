<template>
    <NuxtLayout>
        <DialogTeamEditor />
        <q-virtual-scroll
            class="col-grow bg-white"
            ref="tableArea"
            v-if="!loading"
            :items="teams"
            v-slot="{ item }"
            separator
            virtual-scroll-slice-size="10"
            virtual-scroll-item-size="100"
        >
            <q-item :key="item.id">
                <q-item-section>
                    <q-item-label class="row items-center no-wrap">
                        <div class="flex-shrink truncate-text">
                            {{ item.name || "Unnamed item" }}
                        </div>
                    </q-item-label>

                    <q-item-label caption class="row" style="max-height: 115px">
                        <div class="col-6">
                            <TableTeamPlayer
                                :parsedAvatar="
                                    parseAvatar(item.lead_player_avatar)
                                "
                                :player="{
                                    id: item.lead_player_id,
                                    name: item.lead_player_name,
                                    avatar: item.lead_player_avatar,
                                }"
                                position="lead"
                                @add="
                                    playerSelectOpen = {
                                        teamId: item.id,
                                        position: 'lead',
                                    }
                                "
                                @remove="
                                    removePlayerFromTeam(
                                        item.lead_player_id,
                                        item.id,
                                        'lead'
                                    )
                                "
                            />

                            <TableTeamPlayer
                                :parsedAvatar="
                                    parseAvatar(item.second_player_avatar)
                                "
                                :player="{
                                    id: item.second_player_id,
                                    name: item.second_player_name,
                                    avatar: item.second_player_avatar,
                                }"
                                position="second"
                                @add="
                                    playerSelectOpen = {
                                        teamId: item.id,
                                        position: 'second',
                                    }
                                "
                                @remove="
                                    removePlayerFromTeam(
                                        item.second_player_id,
                                        item.id,
                                        'second'
                                    )
                                "
                            />

                            <TableTeamPlayer
                                :parsedAvatar="
                                    parseAvatar(item.third_player_avatar)
                                "
                                :player="{
                                    id: item.third_player_id,
                                    name: item.third_player_name,
                                    avatar: item.third_player_avatar,
                                }"
                                position="third"
                                @add="
                                    playerSelectOpen = {
                                        teamId: item.id,
                                        position: 'third',
                                    }
                                "
                                @remove="
                                    removePlayerFromTeam(
                                        item.third_player_id,
                                        item.id,
                                        'third'
                                    )
                                "
                            />

                            <TableTeamPlayer
                                :parsedAvatar="
                                    parseAvatar(item.fourth_player_avatar)
                                "
                                :player="{
                                    id: item.fourth_player_id,
                                    name: item.fourth_player_name,
                                    avatar: item.fourth_player_avatar,
                                }"
                                position="fourth"
                                @add="
                                    playerSelectOpen = {
                                        teamId: item.id,
                                        position: 'fourth',
                                    }
                                "
                                @remove="
                                    removePlayerFromTeam(
                                        item.fourth_player_id,
                                        item.id,
                                        'fourth'
                                    )
                                "
                            />
                        </div>
                        <div class="col-6">
                            <TableTeamPlayer
                                :parsedAvatar="
                                    parseAvatar(item.fifth_player_avatar)
                                "
                                :player="{
                                    id: item.fifth_player_id,
                                    name: item.fifth_player_name,
                                    avatar: item.fifth_player_avatar,
                                }"
                                position="fifth"
                                @add="
                                    playerSelectOpen = {
                                        teamId: item.id,
                                        position: 'fifth',
                                    }
                                "
                                @remove="
                                    removePlayerFromTeam(
                                        item.fifth_player_id,
                                        item.id,
                                        'fifth'
                                    )
                                "
                            />

                            <TableTeamPlayer
                                :parsedAvatar="
                                    parseAvatar(item.sixth_player_avatar)
                                "
                                :player="{
                                    id: item.sixth_player_id,
                                    name: item.sixth_player_name,
                                    avatar: item.sixth_player_avatar,
                                }"
                                v-if="item.fifth_player_id"
                                position="sixth"
                                @add="
                                    playerSelectOpen = {
                                        teamId: item.id,
                                        position: 'sixth',
                                    }
                                "
                                @remove="
                                    removePlayerFromTeam(
                                        item.sixth_player_id,
                                        item.id,
                                        'sixth'
                                    )
                                "
                            />
                            <TableTeamPlayer
                                :parsedAvatar="
                                    parseAvatar(item.seventh_player_avatar)
                                "
                                :player="{
                                    id: item.seventh_player_id,
                                    name: item.seventh_player_name,
                                    avatar: item.seventh_player_avatar,
                                }"
                                v-if="item.sixth_player_id"
                                position="seventh"
                                @add="
                                    playerSelectOpen = {
                                        teamId: item.id,
                                        position: 'seventh',
                                    }
                                "
                                @remove="
                                    removePlayerFromTeam(
                                        item.seventh_player_id,
                                        item.id,
                                        'seventh'
                                    )
                                "
                            />
                        </div>
                    </q-item-label>
                </q-item-section>
                <!-- <q-item-section side top class="column q-mt-xs">
                    <q-badge
                        color="positive"
                        label="My team"
                        v-if="item.isMine"
                        rounded
                    ></q-badge>
                    <q-badge
                        outline
                        rounded
                        color="grey"
                        label="+ My team"
                        v-else
                    ></q-badge>
                </q-item-section> -->
                <!-- <q-item-section side @click.stop.prevent>
                   
                </q-item-section> -->
            </q-item>
            <!-- </q-list> -->
        </q-virtual-scroll>
        <GlobalLoading infinite v-else />
        <DialogConfirmation
            v-if="itemToDelete"
            @close="itemToDelete = null"
            @confirm="deleteTeam(itemToDelete)"
        >
            Are you sure you want to delete team "{{
                itemToDelete.name ?? "Unnamed team"
            }}"
        </DialogConfirmation>
        <DialogPlayerSelect
            v-if="!!playerSelectOpen"
            @select="addPlayerToTeam"
            @close="playerSelectOpen = null"
        />
    </NuxtLayout>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTeamStore } from "@/store/teams";
import { useEditorStore } from "@/store/editor";
import { useSwipe, useThrottleFn } from "@vueuse/core";
import { TABLE_NAMES } from "@/constants/tables";
import { useUserStore } from "@/store/user";
import { useFriendStore } from "@/store/friends";
import { parseAvatar } from "@/utils/avatar";
import type Team from "@/types/team";
import type Player from "@/types/player";
const teamStore = useTeamStore();
const friendStore = useFriendStore();

const getFriendPath = (profile_id: string) => {
    return friendStore.getFriendAvatar(profile_id);
};

const teams = computed(() =>
    [...teamStore.teams].map((t) => {
        if (userStore.userTeams.includes(t.id)) return { ...t, isMine: true };
        return t;
    })
);
const loading = ref(false);

const loadTeams = async (force: boolean = false) => {
    loading.value = true;
    await teamStore.fetchTeams(force);
    loading.value = false;
};

const { toggleTeamDialog } = useEditorStore();

const edit = (team: Team) => {
    toggleTeamDialog({
        ...team,
        lead_player_id: team.lead_player_id?.id,
        second_player_id: team.second_player_id?.id,
        third_player_id: team.third_player_id?.id,
        fourth_player_id: team.fourth_player_id?.id,
        fifth_player_id: team.fifth_player_id?.id,
        sixth_player_id: team.sixth_player_id?.id,
        seventh_player_id: team.seventh_player_id?.id,
    });
};

const tableArea = ref(null);
const { direction } = useSwipe(tableArea, {
    threshold: 200,
    onSwipeEnd: (e) => {
        if (direction.value !== "down") return;
        loadTeams(true);
    },
});

const itemToDelete = ref(null);
const deleteTeam = async (team: Team) => {
    const { id = null } = team;
    await teamStore.deleteTeam(id);
    itemToDelete.value = null;
};

const userStore = useUserStore();

const userId = computed(() => userStore.id);

const goToStats = (id) => {
    navigateTo(`/stats/team/${id}`);
};

const addButton = ref(null);
const { x, y, style } = useDraggable(addButton, {
    initialValue: {
        x: window.innerWidth - 75,
        y: window.innerHeight - 75,
    },
});

const playerSelectOpen = ref(null);

const addPlayer = async (playerId: number, teamId: number, position) => {
    loading.value = true;
    const { client, fetchHandler } = useSupabaseFetch();
    const { error } = await fetchHandler(() =>
        client
            .from(TABLE_NAMES.TEAMS)
            .update({ [`${position}_player_id`]: playerId })
            .eq("id", teamId)
    );
    if (error) {
        console.error(error);
        loading.value = false;
        return;
    }
    loadTeams(true);
};

const removePlayerFromTeam = async (
    playerId: number,
    teamId: number,
    position: string
) => {
    loading.value = true;
    const { client, fetchHandler } = useSupabaseFetch();
    const { error, data } = await fetchHandler(() =>
        client
            .from(TABLE_NAMES.TEAMS)
            .update({ [`${position}_player_id`]: null })
            .eq("id", teamId)
    );
    console.log(error, data);
    if (error) {
        console.error(error);
        loading.value = false;
        return;
    }
    loadTeams(true);
};

const addPlayerToTeam = (playerId: number) => {
    const { teamId, position } = playerSelectOpen.value || {};
    playerSelectOpen.value = null;
    addPlayer(playerId, teamId, position);
};
</script>
