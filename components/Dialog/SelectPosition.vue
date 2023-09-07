<template>
    <q-dialog v-model="isOpen" @hide="emit('close')">
        <q-card style="overflow:hidden; min-width: 250px">
            <q-card-section class="q-pb-xs ">
               <TeamPlayer :player="player" style="width: 100%; box-sizing: border-box"/>
            </q-card-section>
            <q-card-section class="q-pt-xs">
              <q-list>
                <q-item v-for="position in Object.keys(TEAM_POSITIONS)" :key="position" clickable @click="select(position)">
                    <q-item-section avatar>
                        <q-icon :name="TEAM_POSITIONS[position].icon"/>
                    </q-item-section>
                    <q-item-section>{{TEAM_POSITIONS[position].name}}</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
                </q-card>
    </q-dialog>
</template>
<script setup lang="ts">
import TP from '@/store/models/team-player'
import {TEAM_POSITIONS} from '@/constants/team'
import {useNotificationStore} from '@/store/notification'
    const isOpen = ref(true)
    const emit = defineEmits(['close', 'save'])

    const props = defineProps({
        playerId: String,
        teamId: Number,
    })

    const player = computed(() => {
        const p = useRepo(TP).with('player').where('player_id', props.playerId).first();
        return {
            ...p.player,
            ...p,
        }
    })

    const select = async (position) => {
        const notStore = useNotificationStore();
        const notId = notStore.addNotification({
            text: 'Updating position',
            state: 'pending'
        })
        const {data, errors} = await useSupabaseClient().from('team_profile_junction').update({position}).eq('profile_id', props.playerId).eq('team_id', props.teamId).select('position')

        if (errors) {
            notStore.updateNotification(notId, {
                state: 'failed',
                text: `Error updating position (code ${errors.code})`,
            })
        } else {
            const [updates] = data;
            useRepo(TP).where('player_id', props.playerId).update(updates)
            emit('close')
            notStore.updateNotification(notId, {
                state: 'completed',
                text: `Position updated!`,
            })
        }
    }
</script>