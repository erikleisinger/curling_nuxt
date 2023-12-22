<template>
    <q-dialog v-model="isOpen" persistent @hide="emit('close')">
        <q-card >
            <q-card-section class="q-pb-xs">
                <h1 class="text-md text-bold">Schedule Event</h1>
            </q-card-section>
            <q-card-section>
                <q-input v-model="name" label="Title" outlined dense />
            </q-card-section>

            <q-card-section >
                <q-input readonly :model-value="start_time" outlined dense label="Start time">
                <InputDate v-model="start_time" :limit="false">
                
                </InputDate>
                </q-input>
                <q-input readonly :model-value="end_time" outlined dense label="End time" >
                <InputDate v-model="end_time" :limit="false">
                
                </InputDate>
                </q-input>
            </q-card-section>
                <q-card-section>
               <q-input
        v-model="color"
        class="my-input"
        readonly
        outlined
        dense
        label="Event color"
      >
      <template v-slot:prepend>
        <q-icon flat round dense name="circle" :style="{color}"/>
      </template>
       <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="color"></q-color>
           </q-popup-proxy>
      </q-input>
        </q-card-section>
        <q-card-section>
            <q-input readonly :model-value="selectedTeam?.name" @click="toggleTeamSearch" outlined dense label="Select team"/>
        </q-card-section>
             <slot name="buttons">
            <q-card-actions align="right" class="row justify-between">
               
          <q-btn flat label="Back"  @click="emit('close')" v-close-popup></q-btn>
          <q-btn flat label="Save" color="primary"  @click="save"></q-btn>
           
        </q-card-actions>
             </slot>
        </q-card>
    </q-dialog>
</template>
<script setup lang="ts">
    import {useDialogStore} from '@/store/dialog';
     import {useUserTeamStore} from '@/store/user-teams'
     import {useQueryClient} from '@tanstack/vue-query';
     const queryClient = useQueryClient();
    const props = defineProps({
        modelValue: Boolean,
        date: [Object, String],
    })

    const emit = defineEmits(['close', 'save', 'update:modelValue'])

    const isOpen = computed({
        get() {
            return props.modelValue
        },
        set(val) {
            emit('update:modelValue', val)
        }
    })

    const start_time = ref(null)
    const end_time = ref(null)
    const {toTimezone} = useTime();
    const dayjs = useDayjs();
    watch(isOpen, (val) => {
        if (val) start_time.value = dayjs(props.date).format('YYYY-MM-DD HH:mm')
        if (!val) {
            name.value = null;
            color.value = null;
            start_time.value = null;
            end_time.value = null;
        }
    })

const name = ref(null)
const color = ref(null)

const save = async () => {
    console.log('SAVING')
    const {user: userId} = useUser();
    const client = useSupabaseClient();
    console.log(start_time.value, end_time.value)
    const {error} = await client.from('schedule').insert({
        name: name.value,
        start_time: start_time.value ? dayjs(start_time.value)?.toISOString() : null,
        end_time: end_time.value ? dayjs(end_time.value)?.toISOString() : null,
        color: color.value,
        profile_id: userId.value,
        team_id: selectedTeam?.value?.id
    })
    isOpen.value = false;
    queryClient.invalidateQueries({
        queryKey: ['calendar', 'events']
    })
}

const selectedTeam = ref(null)

const toggleTeamSearch = () => {
    const {toggleGlobalSearch} = useDialogStore();
    const userTeams = useUserTeamStore().userTeams.map(({id}) => id)
    useDialogStore().toggleGlobalSearch({
        open: true,
        options: {
            resourceTypes: ["team"],
            callback: (val) => {
                selectedTeam.value = val;
            },
            restrictIds: userTeams,
        },
    });
}
 
</script>