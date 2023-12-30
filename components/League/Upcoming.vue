<template>

   <q-list separator>
    <div v-if="isAdmin">
    <q-item clickable v-ripple @click="toggleEditor">
        <q-item-section avatar>
            <q-icon name="add"/>
        </q-item-section>   
        <q-item-section>
            Add game</q-item-section>
    </q-item>
</div>
    <q-item v-for="game in games" :id="game.id" class="upcoming-game__item">
        <q-item-section avatar style="min-width: 100px">
            <div class="row no-wrap items-center justify-end full-width q-pr-sm">
           <div class="text-sm q-mr-sm text-right"> {{game.team_1.name}}</div>
            <div style="width: 30px; min-width: 30px">
                <TeamAvatar :teamId="game.team_1?.id"/>
            </div>
            </div>
        </q-item-section>
        <q-item-section style="min-width: 50px" class="text-center">
            <q-item-label caption>
                {{toTimezone(game.start_time, 'MMM DD')}}
            </q-item-label>
              <q-item-label caption>
                {{toTimezone(game.drawtime ?? game.start_time, 'h:mm a')}}
            </q-item-label>
        </q-item-section>
        <q-item-section avatar style="min-width: 100px">
           <div class="row no-wrap items-center justify-start full-width q-pl-sm">
               <div style="width: 30px; min-width: 30px">
                <TeamAvatar :teamId="game.team_2?.id" />
            </div>
           <div class="text-sm q-ml-sm" > {{game.team_2.name}}</div>
         
            </div>
        </q-item-section>
    </q-item>
   </q-list>
   <DialogPopup :open="editorOpen" maxWidth="500px">
    <div class="row justify-between items-center editor-header">
        <h2 class="text-md text-bold">Schedule a game</h2>
        <q-btn flat round icon="close" @click="closeEditor"/>

    </div>
    <q-separator/>
    <section name="inputs" class="editor-section">
        <h3 class="text-bold text-sm">Time</h3>
        <div class="row" v-if="league?.drawtimes?.length">
            <q-chip clickable v-for="drawtime in league?.drawtimes" :key="drawtime.id" :outline="editedGame.selected_time !== drawtime.time" :style="{backgroundColor: league.color}" :text-color="editedGame.selected_time == drawtime.time ? 'white' : league.color" @click="editedGame.selected_time = drawtime.time">{{toTimezone(drawtime.time, 'h:mm a')}}</q-chip>
        </div>  
          <h3 class="text-bold text-sm">Date</h3>
          <q-input dense outlined readonly v-model="editedGame.selected_date">
          <InputDate dateOnly @update:modelValue="onSelectDate" :limit="false" :limitPast="true"/>
          </q-input>
              <h3 class="text-bold text-sm">Teams</h3>
              <q-item clickable v-ripple @click="searchTeam('team_1')">
                <q-item-section avatar>
                    <div style="width: 40px">
                        <TeamAvatar :teamId="editedGame.team_1?.id" v-if="showAvatars"/>
                    </div>
                </q-item-section>
                <q-item-section>
                    {{editedGame.team_1 ? editedGame.team_1.name : 'Click to select a team'}}
                </q-item-section>
              </q-item>
               <q-item clickable v-ripple @click="searchTeam('team_2')">
                <q-item-section avatar>
                    <div style="width: 40px">
                        <TeamAvatar :teamId="editedGame.team_2?.id" v-if="showAvatars"/>
                    </div>
                </q-item-section>
                <q-item-section>
                    {{editedGame.team_2 ? editedGame.team_2.name : 'Click to select a team'}}
                </q-item-section>
             
              </q-item>
               <div class="row justify-end q-pa-sm">
                        <q-btn rounded :disable="saveDisabled" @click="save" :loading="saving">Save</q-btn>
                    </div>
    </section>
   </DialogPopup>
</template>
<style lang="scss" scoped>
.editor-header {
    padding: var(--space-sm);
}
.editor-section {
    padding: var(--space-sm)
}
    .upcoming-game__item {
        display: grid!important;
        grid-template-columns: 1fr 50px 1fr;
        .q-item__section--avatar {
            padding: unset;
        }
    }
</style>
<script setup>
import {useDialogStore} from '@/store/dialog'
import {useNotificationStore} from '@/store/notification'
import League from '@/store/models/league'
import {useQuery, useQueryClient } from '@tanstack/vue-query'
    const props = defineProps({
        leagueId: Number,
    })

    const queryClient = useQueryClient()

    const {toTimezone} = useTime()

    const league = computed(() => useRepo(League).withAll().where('id', props.leagueId).first());

    const getUpcomingGames = async () => {
        const client = useSupabaseClient();
        const {data} = await client.from('scheduled_games').select(`
            id,
            start_time,
            team_1 (
                id,
                name,
                avatar_url
            ),
            team_2 (
                id,
                name,
                avatar_url
            ),
            league_id,
            league_drawtime_id (
                time
            )
        `).eq('league_id', props.leagueId)

        return data;
    }

const {isLoading, data: games} = useQuery({
    queryKey: ['league', 'upcoming', props.leagueId],
    queryFn: getUpcomingGames,
    refetchOnWindowFocus: false,
    select: (val) => {
    return val.map((game) => ({
        ...game,
        drawtime: game.league_drawtime_id?.time
    })).sort((a,b) => toTimezone(a.start_time, null, false, true).unix() - toTimezone(b.start_time, null, false, true).unix())
    }
})

const {user: userId} = useUser();
const isAdmin = computed(() => league.value?.admins?.some(({profile_id}) => profile_id === userId.value))

// add new game

const editorOpen = ref(false)

const toggleEditor = () => {
    editorOpen.value = true;
}

const defaultGame ={
    selected_time: null,
    selected_date: null,
    team_1: null,
    team_2: null,
}

const editedGame = ref({...defaultGame})

const closeEditor = () => {
    editorOpen.value = false;
    editedGame.value = {...defaultGame}
}

const onSelectDate = (e) => {
    const date = e.split(' ')[0];
    editedGame.value.selected_date = date;
    
    
}

const {toggleGlobalSearch} = useDialogStore();
const showAvatars = ref(true)

const searchTeam = (team_key) => {
    toggleGlobalSearch({
                open: true,
                options: {
                    resourceTypes: ['team'],
                    restrictIds: league.value?.teams?.map(({team_id}) => team_id),
                    filterIds: [editedGame.value.team_1?.id, editedGame.value.team_2?.id],
                    callback: (val) => {
                        showAvatars.value = false;
                        editedGame.value[team_key] = val
                        
                        setTimeout(() => {
                            showAvatars.value = true;
                        }, 20)
                    }
                }
              })
}

// Validation

const saveDisabled = computed(() => !editedGame.value?.selected_date || !editedGame.value?.selected_time || !editedGame.value?.team_1 || !editedGame.value?.team_2)

const saving = ref(false)
const save = async () => {
    saving.value = true;
    const notId = useNotificationStore().addNotification({
        text: 'Scheduling game...',
        state: 'pending'
    })
    const client = useSupabaseClient();
    const {team_1, team_2, selected_date, selected_time} = editedGame.value;

    const timeFormatted = toTimezone(`${selected_time}`, 'h:mm a');
   
    const start_time = toTimezone(`${selected_date} ${timeFormatted}`, null, true);
    
    const {errors} = await client.from('scheduled_games').insert({
        team_1: team_1?.id,
        team_2: team_2?.id,
        start_time,
        league_id: props.leagueId,
        league_drawtime_id: league.value.drawtimes.find(({time}) => editedGame.value.selected_time)?.id ?? null,

    })
    if (errors) {
        useNotificationStore().updateNotification(notId, {
            state: 'failed',
            text: `Error scheduling game: ${errors?.message}`,
            timeout: 5000
        })
    } else {
        useNotificationStore().updateNotification(notId, {
            state: 'completed',
            text: 'Game scheduled!',
            timeout: 2000,
        })
        queryClient.invalidateQueries({
              queryKey: ['league', 'upcoming', props.leagueId],
        })
    }
closeEditor();
    saving.value = false;

}

</script>