<template>
     <DialogTeamEditor/>
  <q-scroll-area class="col-grow bg-white" ref="tableArea" v-if="!loading">
     <q-list bordered separator >
      <q-item clickable @click="toggleTeamDialog(null)">
        <q-item-section >
          <div class="row items-center">
          <q-icon name="add" size="sm" class="q-mr-xs"/><div>Add new team</div>
          </div>
        </q-item-section>
      </q-item>
          <q-item  clickable v-ripple v-for="team in teams" :key="team.id" :to="`/stats/team/${team.id}`">
            <q-item-section>
         <q-item-label>{{team.name || 'Unnamed team'}}</q-item-label>
         <q-item-label caption>
            <div class="row" v-if="team.lead_player_id">
             Lead: {{team.lead_player_id.name}}
            </div>
            <div class="row" v-if="team.second_player_id">
             Second: {{team.second_player_id.name}}
            </div>
            <div class="row" v-if="team.third_player_id">
             Third: {{team.third_player_id.name}}
            </div>
            <div class="row" v-if="team.fourth_player_id">
             Fourth: {{team.fourth_player_id.name}}
            </div>
            <div class="row" v-if="team.fifth_player_id">
             Fifth: {{team.fifth_player_id.name}}
            </div>
            <div class="row" v-if="team.sixth_player_id">
             Sixth: {{team.sixth_player_id.name}}
            </div>
             <div class="row" v-if="team.seventh_player_id">
             Seventh: {{team.seventh_player_id.name}}
            </div>
          </q-item-label>
            </q-item-section> 
             <q-item-section side>
          <div class="text-grey-8" v-if="team.profile_id === userId">
            <q-btn
              size="12px"
              flat
              dense
              round
              icon="edit"
              @click.stop.prevent="edit(team)"
            ></q-btn>
                    <q-btn
              size="12px"
              flat
              dense
              round
              icon="delete"
              @click.stop.prevent="itemToDelete = team"
            ></q-btn>
          </div>
           <ProfileAvatar v-else :path="getFriendAvatar(team.profile_id)" size="2"/>
        </q-item-section>
      </q-item>
     </q-list>
  </q-scroll-area>
  <GlobalLoading infinite v-else/>
      <DialogConfirmation v-if="itemToDelete" @close="itemToDelete = null" @confirm="deleteTeam(itemToDelete)">
    Are you sure you want to delete team "{{itemToDelete.name ?? 'Unnamed team'}}"
  </DialogConfirmation>
</template>
<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useTeamStore} from '@/store/teams'
import {useEditorStore} from '@/store/editor'
import {useSwipe} from '@vueuse/core'
import {TABLE_NAMES} from '@/constants/tables'
import {useUserStore} from '@/store/user'
import { useFriendStore } from "@/store/friends";


import type Team from '@/types/team'
  const teamStore = useTeamStore();

  const teams = computed(() => [...teamStore.teams])
  const loading = ref(false)

const loadTeams = async (force:boolean = false) => {
  loading.value = true;
await teamStore.fetchTeams(force);
loading.value = false;
}
onMounted(() => {
loadTeams();
});

const {toggleTeamDialog} = useEditorStore();

const edit = (team:Team) => {
    toggleTeamDialog({
        ...team,
        lead_player_id: team.lead_player_id?.id,
        second_player_id: team.second_player_id?.id,
        third_player_id: team.third_player_id?.id,
        fourth_player_id: team.fourth_player_id?.id,
        fifth_player_id: team.fifth_player_id?.id,
        sixth_player_id: team.sixth_player_id?.id,
        seventh_player_id: team.seventh_player_id?.id
    })
}

const tableArea = ref(null)
const {direction} = useSwipe(tableArea, {threshold: 200, onSwipeEnd: (e) => {
  if (direction.value !== 'down') return;
  loadTeams(true);
}})

const itemToDelete = ref(null)
const deleteTeam = async (team:Team) => {
    const {id = null} = team;
  await teamStore.deleteTeam(id)
  itemToDelete.value = null
}

const userStore = useUserStore();

const friendStore = useFriendStore();
const {getFriendAvatar} = friendStore;

const userId = computed(() => userStore.id)
</script>