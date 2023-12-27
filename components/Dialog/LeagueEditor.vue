<template>
    <q-dialog v-model="isOpen" @hide="close" persistent class="dialog">
        <q-card class="league-editor__wrap">
            <!-- Header -->

            <q-card-section :style="{ backgroundColor: league.color }">
                <h3
                    class="text-sm text-white"
                    style="margin-bottom: -6px"
                    v-if="league.name"
                >
                    {{ isEdited ? "Editing" : "Creating" }}
                </h3>
                <h2 class="text-md text-bold text-white">
                    <span v-if="league.name">{{ league.name }}</span>
                    <span v-else
                        >{{ isEdited ? "Edit" : "Create" }} League</span
                    >
                </h2>
            </q-card-section>

            <!-- Inputs -->

            <q-card-section>
                <h4>League info</h4>
                <q-input dense outlined label="Title" v-model="league.name" :rules="[VALIDATION_RULES.REQUIRED]" ref="nameInput"/>

                <SelectColor v-model="league.color" label="League color" />
                <q-input dense outlined label="Rink" :model-value="rink?.name"  readonly @click="toggleRinkSearch" :rules="[VALIDATION_RULES.REQUIRED]" ref="rinkInput"/>
            </q-card-section>

            <!-- DRAW TIMES -->

            <q-card-section>
                <h4>Draw times</h4>
                 <h5 class="text-sm text-red" v-if="drawError">{{drawError}}</h5>
                <q-list separator>
                    <transition-group appear enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight">
                    <q-item
                        v-for="({id, time}, index) in drawtimes"
                        :key="time"
                    >
                        <q-item-section avatar>
                            <div class="text-md text-bold" style="margin-left: 8px">{{ index + 1 }}</div>
                        </q-item-section>
                        <q-item-section>
                            {{ toTimezone(time, "h:mm a") }}
                        </q-item-section>
                        <q-item-section avatar>
                            <q-btn flat round dense icon="close" @click="drawtimes.splice(index, 1)"/>
                        </q-item-section>
                    </q-item>
                    </transition-group>

                    <q-item clickable v-ripple>
                        <q-item-section avatar>
                            <q-icon name="add" flat round />
                        </q-item-section>
                        <q-item-section> Add draw time </q-item-section>
                        <InputDate
                            v-model="newDrawtime"
                            @update:modelValue="addDrawTime($event, id)"
                            timeOnly
                        />
                    </q-item>
                </q-list>
            </q-card-section>

            <!-- TEAMS -->

            <q-card-section>
                <div class="row justify-between">
                <h4>Teams</h4>
     <q-btn dense flat :style="{color: league.color}" @click="addPool" v-if="!pools.length">Add pool</q-btn>
                </div>
                
         
                <div v-if="pools.length">
                  <transition-group appear enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight">
                <div class="pool__container" v-for="{id:poolId, pool}, poolIndex in pools" :key="poolIndex">
                    <h5 class="text-md text-bold text-center">
                        <q-input dense v-model="pool.name" class="pool-name__input">
                            <template v-slot:append>
                                <q-btn flat round icon="delete" dense size="sm" @click="poolToDelete = {index: poolIndex, id: pool?.id, name: pool.name}"/>
                            </template>
                             <template v-slot:prepend>
                                <q-btn flat round disable dense size="sm"/>
                            </template>
                        </q-input>
                    </h5>
                    <q-separator :style="{backgroundColor: league.color}" size="2px"   />
                      <q-list separator>
                           <transition-group appear enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight">
                 <q-item
                        v-for="({id, team}, index) in teams.filter(({league_pool_id}) => league_pool_id === poolIndex || league_pool_id === poolId)"
                        :key="team.id"
                    >
                        <q-item-section avatar>
                            <div style="width: 25px">
                                <TeamAvatar :teamId="team.id"/>
                            </div>
                        </q-item-section>
                        <q-item-section>
                            {{team.name}}
                        </q-item-section>
                        <q-item-section avatar>
                            <q-btn flat round dense icon="close" @click="removeTeam(team.id)"/>
                        </q-item-section>
                    </q-item>
                           </transition-group>
                    <q-item clickable v-ripple @click="toggleTeamSearch(pool?.id || poolIndex)">
                        <q-item-section avatar>
                            <q-icon name="add" flat round />
                        </q-item-section>
                        <q-item-section> Add team </q-item-section>
                    </q-item>
                </q-list>
                </div>
                  </transition-group>
                  
                </div>
                <div v-else>
                       <q-item
                        v-for="({id, team}, index) in teams"
                        :key="team.id"
                    >
                        <q-item-section avatar>
                            <div style="width: 25px">
                                <TeamAvatar :teamId="team.id"/>
                            </div>
                        </q-item-section>
                        <q-item-section>
                            {{team.name}}
                        </q-item-section>
                        <q-item-section avatar>
                            <q-btn flat round dense icon="close" @click="teams.splice(index, 1)"/>
                        </q-item-section>
                    </q-item>
                      <q-item clickable v-ripple @click="toggleTeamSearch">
                        <q-item-section avatar>
                            <q-icon name="add" flat round />
                        </q-item-section>
                        <q-item-section> Add team </q-item-section>
                    </q-item>
                </div>

                 <div class="full-width row justify-center q-mt-sm" v-if="pools.length">
                        <q-btn dense flat :style="{color: league.color}" @click="addPool">Add pool</q-btn>
                  </div>   
                  
            </q-card-section>

            <!-- ADMINS -->

            <q-card-section>
                <h4>Admins</h4>
                <h5 class="text-sm text-red" v-if="adminError">{{adminError}}</h5>
                    <q-list separator>
                           <transition-group appear enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight">
                 <q-item
                        v-for="({id, profile:admin}, index) in admins"
                        :key="admin.id"
                    >
                        <q-item-section avatar>
                            <div style="width: 25px">
                                <Avataaar v-bind="parseAvatar(admin.avatar)"/>
                            </div>
                        </q-item-section>
                        <q-item-section>
                            {{admin.first_name}} {{admin.last_name}}
                        </q-item-section>
                        <q-item-section avatar>
                            <q-btn flat round dense icon="close" @click="admins.splice(index, 1)" v-if="admins.length > 1"/>
                        </q-item-section>
                    </q-item>
                           </transition-group>
                    <q-item clickable v-ripple @click="toggleProfileSearch">
                        <q-item-section avatar>
                            <q-icon name="add" flat round />
                        </q-item-section>
                        <q-item-section> Add admin </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
              <q-card-section >
                <h4>Options</h4>
                 <q-list separator>
      <q-item tag="label" v-ripple style="padding-right: 4px; padding-left: 4px">
        <q-item-section>
               <q-item-label >Public</q-item-label>
          <q-item-label caption>Anyone can join this league.</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle
        v-model="league.public"
        :style="{color: league.color}"
        class="toggle"

      ></q-toggle>
        </q-item-section>
      </q-item>
                 </q-list>
                 
              </q-card-section>
            <q-card-actions >
                <div class="full-width row justify-between">
                    <q-btn flat @click="close">Close</q-btn>
                <q-btn flat :style="{backgroundColor: league.color}" text-color="white" rounded size="md" @click="save" padding="0px 16px" :loading="saving">
                    <!-- :disable="saveDisabled"  -->
                    Save League

                </q-btn>
                </div>
            </q-card-actions>
        </q-card>
           <DialogConfirmation
                v-if="!!poolToDelete"
                confirmButtonText="Delete pool"
                cancelButtonText="Cancel"
                @confirm="deletePool"
                @close="poolToDelete = null"
                cancelColor=""
                confirmColor="negative"
            >
                Are you sure you want to delete {{poolToDelete.name}}?
            </DialogConfirmation>
    </q-dialog>
</template>
<style lang="scss" scoped>
.dialog {
    background-color: red;
}
.league-editor__wrap {
    min-width: min(90vw, 600px);
    min-height: min(80vh, 800px);
    .q-card__section {
        h4 {
            font-size: 1em;
            font-weight: bold !important;
        }
    }
    :deep(.q-field--outlined.q-field--readonly .q-field__control:before) {
        border-style: solid;
    }

    .toggle {

        :deep(.q-toggle__inner--truthy) {
            color: inherit!important;
        }
        :deep(.q-toggle__label) {
            color: black!important;
        }
    }
    .pool__container {
        padding: var(--space-xs);
        border-radius: 8px;
        box-shadow: $pretty-shadow;
      
            margin-top: var(--space-sm);
     
        .pool-name__input {
            :deep(.q-field__native) {
                text-align: center;
                font-weight: bold;
                font-size: var(--text-md)
            }
            :deep(.q-field__control) {
                &:before {
                    border-bottom: unset!important;
                }
                &:after {
                    height: 0px!important;
                }
            }
        }
    }
}
</style>
<script setup lang="ts">
import { useDialogStore } from "@/store/dialog";
import {useNotificationStore} from '@/store/notification';
import {useUserStore} from '@/store/user'
import { COLOR_OPTIONS } from "@/constants/color";
import { parseAvatar } from "@/utils/avatar";
import {VALIDATION_RULES} from '@/constants/validation';
import {useQueryClient} from '@tanstack/vue-query'
import Rink from '@/store/models/rink'

const queryClient = useQueryClient();
const dialogStore = useDialogStore();
const { toggleLeagueEditor, toggleGlobalSearch } = dialogStore;

const isOpen = ref(true);

const close = () => {
    isOpen.value = false;
    setTimeout(() => {
        reset();
        toggleLeagueEditor({ open: false });
    }, 500);
};


const defaultLeague = {
    id: null,
    created_at: null,
    name: null,
    color: "#3f51b5",
    font_color: null,
    icon: null,
    public: false,
};

const league = ref(defaultLeague);

const reset = () => {
    league.value = defaultLeague;
    drawtimes.value = [];
    teams.value = [];
    admins.value = [];
    rink.value = null;
    pools.value = [];
};

const editedItem = computed(() => dialogStore.leagueEditor.editedLeague);
const isEdited = computed(() => !!editedItem?.value?.id);

// DRAW TIMES

const drawtimes = ref([]);
const newDrawtime = ref(null);

const dayjs = useDayjs();

const { toUTC, toTimezone } = useTime();

const addDrawTime = (time: string, id: number) => {
    const utc = toUTC(time, null, true);
    if (drawtimes.value.includes(utc)) {
        useNotificationStore().addNotification({
            state: 'failed',
            text: `There's already a draw scheduled at ${toTimezone(utc, 'h:mm a')}!`,
            timeout: 3000,
        })
    } else {
        drawError.value = null;
        drawtimes.value.push({
            id: id ?? null,
            time: utc
        });
    }
   
};

// TEAMS

const teams = ref([])

const toggleTeamSearch = (poolIndex) => {
    toggleGlobalSearch({
        open: true,
        options: {
            inputLabel: `Add a team to ${league.value?.name ?? 'your league'}`,
            resourceTypes: ["team"],
            callback: (val) => {
                teams.value.push({
                    id: null,
                    league_pool_id: poolIndex,
                    team: val
                })
            },
            filterIds: teams.value.map(({ team }) => team.id),
        },
    });
};

const removeTeam = (teamId) => {
    const index = teams.value.findIndex(({team}) => team.id === teamId)
    if (index === -1) return;
    teams.value.splice(index, 1)
}

// ADMINS
const userStore = useUserStore()
const admins = ref([{
    id: null,
    profile: {
        id: userStore.id,
    avatar: userStore.avatar,
    first_name: userStore.first_name,
    last_name: userStore.last_name
    }
}])

const toggleProfileSearch = () => {
    toggleGlobalSearch({
        open: true,
        options: {
            inputLabel: `Add an admin for ${league.value?.name ?? 'your league'}`,
            resourceTypes: ["profile"],
            callback: (val) => {
                adminError.value = null;
                admins.value.push({
                    id: null,
                    profile: {
                        id: val.profile_id,
                    avatar: val.avatar,
                    first_name: val.first_name,
                    last_name: val.last_name
                    }
                })
            },
            filterIds: admins.value.map(({ id }) => id),
        },
    });
};

// RINKS

const rink = ref(null)

const toggleRinkSearch = () => {
    toggleGlobalSearch({
        open: true,
        options: {
            inputLabel: `Select a rink for ${league.value?.name ?? 'your league'}`,
            resourceTypes: ["rink"],
            callback: (val) => {
                rink.value = val;
            },
        },
    });
}

// POOLS

const pools = ref([])

const addPool = () => {
    if (pools.value.length > 9) {
        useNotificationStore().addNotification({
            state: 'failed',
            text: 'Maximum 10 pools',
            timeout: 2000,
        })
        return;
    }
    pools.value.push({
        id: null,
        pool: {
            created_at: null,
        name: `Pool ${pools.value.length + 1}`,
        format: null,
        }
    })
}

const poolToDelete = ref(null)

const deletePool = () => {
    const {index, id} = poolToDelete.value
    if (id) {
        const i = pools.value.findIndex(({id: poolId}) => poolId === id);
        if (index !== -1) {
            pools.value.splice(i, 1)
            teams.value = [...teams.value].filter(({league_pool_id}) => league_pool_id !== id)
        }
    }
    pools.value.splice(index, 1);
    teams.value = [...teams.value].filter(({league_pool_id}) => league_pool_id !== index)
    poolToDelete.value = null;


}

// VALIDATION

const nameInput = ref(null);
const rinkInput = ref(null);
const adminError = ref(null);
const drawError = ref(null)

const validate = () => {
    nameInput.value.validate();
    rinkInput.value.validate();
    if (!admins.value?.length) {
        adminError.value = 'League must have at least one admin.'
    }
    if (!drawtimes.value?.length) {
        drawError.value = 'League must have at least one draw time.'
    }

    return !(nameInput.value.hasError || rinkInput.value.hasError || !!adminError.value || !!drawError.value)
}

const poolsValid = computed(() => {
    return pools.value.every(({id}, index) => teams.value.some(({league_pool_id}) => league_pool_id === id || league_pool_id === index))
})

// SAVE

const saving = ref(false)

const client = useSupabaseClient();

const createLeague = async () => {
  
    const {name, color, public: isPublic} = league.value;
    const {id:rink_id = null} = rink.value ?? {}  
    const {data, error} = await client.from('leagues').upsert([{
         ...(editedItem.value?.id ? {id: editedItem.value.id} : {}),
        name, 
        color,
        rink_id,
        public: isPublic
    }]).select('id').single()

    if (error) throw new Error(error)

    const {id: league_id} = data;
    return league_id;

}

const createDrawTimes = async (league_id: number) => {
    await client.from('league_drawtimes').delete().eq('league_id', league_id).not('id', 'in', `(${drawtimes.value.map(({id}) => id).join(',')})`)
    const {error} = await client.from('league_drawtimes').upsert(drawtimes.value.map(({id, time}) => ({
         ...(id ? {id} : {}),
        league_id,
        time,
       
    })))
    if (error) throw new Error(error)
}

const createLeagueAdmins = async (league_id: number) => {
     await client.from('league_admins').delete().eq('league_id', league_id).not('id', 'in', `(${admins.value.map(({id}) => id).join(',')})`)
    const {error} = await client.from('league_admins').upsert(admins.value.map(({id, profile}) => ({
          ...(id ? {id} : {}),
        league_id,
        profile_id: profile?.id,
    })))
      if (error) throw new Error(error)
}

const createLeagueTeams = async (league_id: number, poolIds) => {
    console.log('league teams deletion: ',  `(${teams.value.map(({id}) => id).join(',')})`)
         await client.from('league_teams').delete().eq('league_id', league_id).not('id', 'in', `(${teams.value.map(({id}) => id).join(',')})`)
    const {error} = await client.from('league_teams').upsert(teams.value.map(({id, league_pool_id, team}) => {
        console.log('team id: ', id)
        console.log('inserting: ', {
              ...(id ? {id} : {}),
        league_id,
        team_id: team.id,
        league_pool_id: poolIds.includes(league_pool_id) ? league_pool_id : poolIds[league_pool_id]
        })
        return {
              ...(id ? {id} : {}),
        league_id,
        team_id: team.id,
        league_pool_id: poolIds.includes(league_pool_id) ? league_pool_id : poolIds[league_pool_id]
        }
    }), {defaultToNull: false})
      if (error) throw new Error(error)
}

const createLeaguePools = async (league_id: number) => {
         await client.from('league_pools').delete().eq('league_id', league_id).not('id', 'in', `(${pools.value.filter(({id}) => id !== null && id !== undefined).map(({id}) => id).join(',')})`)
    const {error, data: fetchedPools} = await client.from('league_pools').upsert(pools.value.map(({id, pool}) => ({
          ...(id ? {id} : {}),
        league_id,
        name: pool.name,
        format: pool.format,
    }))).select('id')
      if (error) throw new Error(error)

     return fetchedPools.map(({id}) => id)
}



const save = async () => {
      saving.value = true;
      const isValid = validate();
      if (!isValid) {
        saving.value = false;
        return;
      }
    const notId = useNotificationStore().addNotification({
        state: 'pending',
        text: `${isEdited.value ? 'Updating' : 'Creating'} ${league.value.name}...`
    })
    try {
        const league_id = await createLeague();

        if (!isEdited.value) await createLeagueAdmins(league_id)
                const poolIds = await createLeaguePools(league_id)
    
        await Promise.all([createDrawTimes(league_id), createLeagueTeams(league_id, poolIds)])

        if (!!isEdited.value) await createLeagueAdmins(league_id)

         useNotificationStore().updateNotification(notId, {
            state: 'completed',
            text: `${league.value.name} was ${isEdited.value ? 'updated' : 'created'}!`,
            timeout: 2000,
        })
        queryClient.invalidateQueries({
            queryKey: ['rink', 'leagues', rink.value?.id]
        })
        close();

    } catch(error) {
        useNotificationStore().updateNotification(notId, {
            state: 'failed',
            text: `Error ${isEdited.value ? 'updating' : 'creating'} ${league.value.name}: ${error?.message}`,
            timeout: 5000,
        })
    }
    saving.value = false;

}
const saveDisabled = computed(() => !league.value?.name || !league.value?.color || !rink.value?.id || !admins.value?.length || !drawtimes.value?.length)

// EDITING 

const initEdit = () => {
    league.value.name = editedItem.value?.name ?? null;
    league.value.color = editedItem.value?.color ?? null;
    league.value.public = editedItem?.value?.public ?? false;
    rink.value = useRepo(Rink).where('id', editedItem.value.rink_id).first()
    drawtimes.value = editedItem.value.drawtimes.map((time) => ({
        id: time.id ?? null,
        time: time.time,
    }));
    teams.value = editedItem.value.teams.map(({team, id, league_pool_id}) => ({
        id, 
        league_pool_id,
        team
    }));
    admins.value = editedItem.value.admins.map(({id, profile}) => ({
        id,
        profile
    }))

    pools.value = editedItem.value.pools.map(({league, id, ...rest}) => ({
        id,
        pool: rest
    }))

}

onMounted(() => {
   
    if (!!editedItem.value) {
        initEdit()
    }
})
</script>
