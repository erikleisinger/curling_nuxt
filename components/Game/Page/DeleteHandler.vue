<template>
    <div class="full-width row justify-center">
        <Button color="red" v-if="canDelete" @click="showDeleteConfirm = true" :disabled="deleting" :loading="deleting">Delete game</Button>
    </div>
    <GlobalMenu v-model="showDeleteConfirm" >
    <DialogCard ref="confirmDelete" maxWidth="95vw">
         <template v-slot:title>
                   Delete game?
                </template>
                <template v-slot:content>
                    All data about this game will be removed. Any requests sent to verify this game will be cancelled. 
                </template>
                 <template v-slot:footer>
                 
                    <Button color="white" textColor="slate" @click="showDeleteConfirm = false">Close</Button>
                    <Button color="red" @click="deleteGame" >Delete</Button>
                    
                </template>
    </DialogCard>
    </GlobalMenu>
</template>
<script setup>
import Game from '@/store/models/game'
import {useNotificationStore} from '@/store/notification'
    const props = defineProps({
        gameId: Number,
    })

    const teams = computed(() => useRepo(Game).with('teams').where('id', props.gameId).first()?.teams.map(({team_id}) => team_id))

    const {isOnTeam} = useTeam()

    const canDelete = computed(() => {
        let isAuthorized;
        if (!teams.value) return false;

        teams.value.forEach((id) => {
            if (isOnTeam(id)) isAuthorized = true
        })

        return isAuthorized
    })

    const notStore = useNotificationStore();

    const showDeleteConfirm = ref(false)

    const deleting = ref(false)

    const deleteGame = async () => {
        deleting.value = true;
        showDeleteConfirm.value =false;
        const notId = notStore.addNotification({
            status: 'pending',
            text: 'Deleting game...'
        })
        const client = useSupabaseClient();
        const {errors} = await client.from('games').delete().eq('id', props.gameId);

        if (errors) {
            notStore.updateNotification(notId, {
                status: 'failed',
                text: `Error deleting game: ${errors?.message}`,
                timeout: 5000,
            })
        } else {
            notStore.updateNotification(notId, {
                status: 'completed',
                text: `Game deleted!`,
                timeout: 2000,
            })
            useRepo(Game).where('id', props.gameId).delete();
            navigateTo('/')
        }
        deleting.value = false;
    }
</script>