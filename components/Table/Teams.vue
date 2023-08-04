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
            <!-- <q-list bordered separator > -->
            <!-- <q-item clickable @click="toggleTeamDialog(null)">
        <q-item-section >
          <div class="row items-center">
          <q-icon name="add" size="sm" class="q-mr-xs"/><div>Add new team</div>
          </div>
        </q-item-section>
      </q-item> -->
            <!-- <q-item  clickable v-ripple v-for="team in teams" :key="team.id" :to="`/stats/team/${team.id}`"> -->
            <!-- <TableTeamItem :key="item.id" :team="item" @click="goToStats(item.id)"/> -->
            <q-item :key="item.id" clickable :to="`/stats/team/${item.id}`">
                 <!-- <q-item-section avatar>
          <q-avatar color="teal" text-color="white" icon="favorite_border"></q-avatar>
        </q-item-section> -->
                <q-item-section>
                    <q-item-label>{{
                        item.name || "Unnamed item"
                    }}</q-item-label>
                    <q-item-label caption>
                        <div class="row" v-if="item.lead_player_id">
                            Lead: {{ item.lead_player_name }}
                        </div>
                        <div class="row" v-if="item.second_player_id">
                            Second: {{ item.second_player_name }}
                        </div>
                        <div class="row" v-if="item.third_player_id">
                            Third: {{ item.third_player_name }}
                        </div>
                        <div class="row" v-if="item.fourth_player_id">
                            Fourth: {{ item.fourth_player_name }}
                        </div>
                        <div class="row" v-if="item.fifth_player_id">
                            Fifth: {{ item.fifth_player_name }}
                        </div>
                        <div class="row" v-if="item.sixth_player_id">
                            Sixth: {{ item.sixth_player_name }}
                        </div>
                        <div class="row" v-if="item.seventh_player_id">
                            Seventh: {{ item.seventh_player_name }}
                        </div>
                    </q-item-label>
                </q-item-section>
                <q-item-section side top class="column">
          <q-badge color="positive" label="My team" v-if="item.isMine" rounded></q-badge>
           <q-badge  outline rounded  color="grey" label="+ My team" v-else></q-badge>
           <div class="text-grey-8 col-grow row items-center" v-if="item.profile_id === userId">
                        <q-btn
                            size="12px"
                            flat
                            dense
                            round
                            icon="edit"
                            @click.stop.prevent="edit(item)"
                        ></q-btn>
                        <q-btn
                            size="12px"
                            flat
                            dense
                            round
                            icon="delete"
                            @click.stop.prevent="itemToDelete = item"
                        ></q-btn>
                    </div>
                    <LazyProfileAvatar
                        v-else
                        :path="getFriendPath(item.profile_id)"
                        size="2"
                        delay
                    >
                        <q-tooltip
                            :hide-delay="5000"
                            anchor="center left"
                            self="center right"
                            :offset="[10, 10]"
                            >Team belongs to
                            <span class="text-bold">{{
                                friendStore.getFriendUsername(item.profile_id)
                            }}</span></q-tooltip
                        >
                    </LazyProfileAvatar>
        </q-item-section>
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
        <ButtonBottomDraggable :onClick="toggleTeamDialog" />
    </NuxtLayout>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTeamStore } from "@/store/teams";
import { useEditorStore } from "@/store/editor";
import { useSwipe } from "@vueuse/core";
import { TABLE_NAMES } from "@/constants/tables";
import { useUserStore } from "@/store/user";
import { useFriendStore } from "@/store/friends";
import type Team from "@/types/team";
const teamStore = useTeamStore();
const friendStore = useFriendStore();

const getFriendPath = (profile_id: string) => {
    return friendStore.getFriendAvatar(profile_id);
};

const teams = computed(() => [...teamStore.teams].map((t) => {
    if (userStore.userTeams.includes(t.id)) return {...t, isMine: true}
    return t; 
}));
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
    navigateTo(`/stats/team/${id}`)
}

const addButton = ref(null);
const { x, y, style } = useDraggable(addButton, {
    initialValue: {
        x: window.innerWidth - 75,
        y: window.innerHeight - 75,
    },
});
</script>
