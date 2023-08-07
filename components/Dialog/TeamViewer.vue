<template>
    <DialogFloating @close="toggleTeamViewer({ open: false })">
        <template v-slot:prependButton>
            <q-btn flat round icon="edit" v-if="canEdit"/>
        </template>
        <header class="pretty-shadow">
              <LazyTableTeamItem2
                    :item="team"
         
                />
                        <nav>
 <q-tabs dense v-model="tab" stretch>
                    <q-tab name="history" label="Game history"/>
                     <q-tab name="stats" label="Stats"/>
                </q-tabs>

        </nav>
        </header>


        <main>

            <KeepAlive>
                    <div  v-if="tab === 'history'">

                <div v-if="results">
                    <div
                        v-for="result in results"
                        :key="result.id"
                        class="result__container"
                    >
            
                        <div class="team__profile--container column no-wrap">
                            <div class="q-pa-md">
                                <Avataaar v-bind="skipAvatar" />
                            </div>
                            <h2 class="text-sm truncate-text">
                                {{ team?.name || 'Unnamed team' }}
                            </h2>
                        </div>
                        <div class="row justify-around items-center text-xxxl">
                            <div
                                class="column justify-center items-center no-wrap"
                            >
                                <div>{{ result.points_for ?? 0 }}</div>
                                <q-icon
                                    name="circle"
                                    :color="result.my_color"
                                    size="xs"
                                />
                            </div>
                             <div
                                class="column justify-center items-center no-wrap"
                            >
                       {{ result.points_against ?? 0 }}
                                <q-icon
                                    name="circle"
                                    :color="result.opposition_color"
                                    size="xs"
                                />
                            </div>
            
                        </div>

                        <div class="team__profile--container column no-wrap">
                            <div class="q-pa-md">
                                <Avataaar
                                    v-bind="
                                        parseAvatar(result.opposition_avatar)
                                    "
                                />
                            </div>
                            <h2 class="text-sm truncate-text">
                                {{ result.opposition_name }}
                            </h2>
                        </div>
                                <div class="overline row justify-center text-xs" style="grid-column: 1/4; margin-top: -1em">{{format(result.start_time, 'MMMM D, YYYY')}}</div>
                    </div>
                </div>
                    </div>
        
                    <TeamStatsView :teamId="team.id" v-else-if="tab === 'stats'"/>
              
                </KeepAlive>
        </main>

                 <!-- <h2 class="text-md text-bold">Team</h2> -->
            <!-- <section style="overflow: scroll">
                <TableTeamView :item="team" readOnly v-if="team" />
            </section> -->
            <!-- <section> 
               
                <div style="height: calc(100% - 36px); overflow: scroll; width: 100%">
           
                
                    
                </div>
            </section>
        </div> -->
    </DialogFloating>
</template>
<style lang="scss">
$header-height: 2em;
.result__container {
    display: grid;
    // grid-template-rows: 1fr auto;
    grid-template-rows: 100%;
    grid-template-columns: 30% 40% 30%;

}
.team-viewer__wrap {
    display: grid;
    grid-template-rows: 2em calc(40% - $header-height / 2) calc(60% - $header-height / 2);
}
</style>
<script setup lang="ts">
import { useEditorStore } from "@/store/editor";
import { useTeamStore } from "@/store/teams";
import {useUserStore} from '@/store/user'
import { parseAvatar } from "@/utils/avatar";
const editorStore = useEditorStore();

const tab = ref('history')

const { toggleTeamViewer } = editorStore;

const {format} = useTime();

const team = ref(null);
onMounted(async () => {
    const edited = editorStore.teamViewer.team;
    if (edited?.id) getTeamRecord(edited.id);
    if (!edited?.created_at && edited?.id) {
        const storeTeam = useTeamStore().teams.find((t) => t.id === edited?.id);
        if (storeTeam) {
            team.value = storeTeam
        } else {
            const client = useSupabaseClient();
            const {data} = await client.rpc('get_teams_detailed').eq('id', edited?.id);
            const [fromDb] = data;
            if (fromDb) {
                team.value = fromDb
            } else {
                console.error('failed to set team: no team could be found')
            }
        }



    } 
    

    if (team.value) setSkipAvatar();
});


const skipAvatar = ref(null);

const setSkipAvatar = () => {
    let a;
    if (!team.value?.skip_id) {
        a = team.value?.fourth_player_id?.avatar;
    } else {
        a = [
            team.value.lead_player_id,
            team.value.second_player_id,
            team.value.third_player_id,
            team.value.fourth_player_id,
            team.value.fifth_player_id,
            team.value.sixth_player_id,
            team.value.seventh_player_id,
        ].find((p) => p?.id === team.value.skip_id)?.avatar;
    }
    if (a) skipAvatar.value = parseAvatar(a);
};

const results = ref(null);
const getTeamRecord = async (team_id_param: number) => {
    const client = useSupabaseClient();
    const { data } = await client.rpc("get_team_record", { team_id_param });
    if (data) results.value = data
};

const userStore = useUserStore();
const canEdit = computed(() => team.value?.profile_id === userStore.id)
</script>
