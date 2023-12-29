<template>
     <q-btn
                                flat
                                round
                                icon="more_vert"
                                dense
                                size="0.7em"
                            >
    <q-menu auto-close>
        <q-list>
            <q-item clickable v-ripple @click="leaveLeague">
                <q-item-section avatar>
                    <q-icon name="group_remove"/>
                </q-item-section>
                <q-item-section>
                    Leave league
                </q-item-section>
            </q-item>
        </q-list>
    </q-menu>
     </q-btn>
</template>
<script setup>
import {useQueryClient} from '@tanstack/vue-query'
const queryClient = useQueryClient()
    const props = defineProps({
        leagueId: Number,
        teamId: Number
    })

    const leaveLeague = async () => {
        const client = useSupabaseClient();
        await client.from('league_teams').delete().eq('league_id', props.leagueId).eq('team_id', props.teamId);

        queryClient.invalidateQueries({
            queryKey: ['league', props.leagueId]
        })
         setTimeout(() => {
        queryClient.invalidateQueries({
        queryKey: ['league', 'standings', props.leagueId]
    })
    }, 3000)
    }
</script>