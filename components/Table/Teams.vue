<template>
     <DialogTeamEditor/>
  <q-scroll-area class="col-grow" ref="tableArea">
    <q-inner-loading
      :showing="loading"
      label="Please wait..."
      color="primary"
    />
     <q-list bordered separator >
      <q-item clickable @click="toggleTeamDialog">
        <q-item-section >
          <div class="row items-center">
          <q-icon name="add" size="sm" class="q-mr-xs"/><div>Add new team</div>
          </div>
        </q-item-section>
      </q-item>
          <q-item  clickable v-ripple v-for="team in teams" :key="team.id">
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
             Third: {{team.second_player_id.name}}
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
          <div class="text-grey-8">
            <q-btn
              size="12px"
              flat
              dense
              round
              icon="edit"
              @click.stop="edit(team)"
            ></q-btn>
                    <q-btn
              size="12px"
              flat
              dense
              round
              icon="delete"
              @click.stop="itemToDelete = team"
            ></q-btn>
          </div>
        </q-item-section>
      </q-item>
     </q-list>
  </q-scroll-area>
      <DialogDeleteConfirmation v-if="itemToDelete" @close="itemToDelete = null" @confirm="deleteTeam(itemToDelete)">
    Are you sure you want to delete team "{{itemToDelete.name ?? 'Unnamed team'}}"
  </DialogDeleteConfirmation>
</template>
<script setup>
import {ref, onMounted} from "vue";
import {useDataStore} from '@/store/data'
import {useEditorStore} from '@/store/editor'
import {useSwipe} from '@vueuse/core'
import {TABLE_NAMES} from '@/constants/tables'
  const dataStore = useDataStore()

const {sortNameAlphabetically} = useSort()
  const teams = computed(() => [...dataStore.teams].sort(sortNameAlphabetically))
  const loading = ref(false)

const loadTeams = async (force) => {
  loading.value = true;
await dataStore.getTeams(force);
loading.value = false;
}
onMounted(async () => {
loadTeams();
});

const {toggleTeamDialog} = useEditorStore();

const edit = (team) => {
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
const deleteTeam = async ({id}) => {
  await dataStore.deleteItem(id, TABLE_NAMES.TEAMS)
  itemToDelete.value = null
}

</script>