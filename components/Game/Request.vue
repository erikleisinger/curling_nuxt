<template>
        <div class="team-request__container row no-wrap items-center">
                    <div style="width: 40px" class="q-mr-sm">
                        <TeamAvatar :teamId="request.game?.home?.id" />
                    </div>
                    <div>
                        <span class="text-bold q-mr-xs">{{ request.game?.home?.name }}</span>
                        <span>has invited you to verify this game</span>
                    </div>
                    <q-btn flat
                        >Respond
                        <q-menu>
                           
                            <q-item
                                clickable
                                v-ripple
                                @click="respondToRequest('accepted')"
                                color="green"
                            >
                                <q-item-section avatar>
                                    <q-icon name="check" color="green"></q-icon>
                                </q-item-section>
                                <q-item-section no-wrap
                                    >Accept invitation</q-item-section
                                >
                            </q-item>
                            <q-item
                                clickable
                                v-ripple
                                  @click="respondToRequest('rejected')"
                            >
                                <q-item-section avatar>
                                    <q-icon name="close" color="red"></q-icon>
                                </q-item-section>
                                <q-item-section no-wrap
                                    >Decline invitation</q-item-section
                                >
                            </q-item>
                        </q-menu>
                    </q-btn>
                </div>
</template>
<style lang="scss" scoped>
      .team-request__container {
        padding: var(--space-xs);
    }
</style>
<script setup>
import {useGameRequestStore} from '@/store/game-requests'

import { useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();

    const props = defineProps({
        request: Object,
        viewable: Boolean,
    })


const { updateGameRequestStatus, getGameRequestsByUser} =
    useGameRequestStore();



const respondToRequest = async (status) => {
    const {team_id, game_id} = props.request
    await updateGameRequestStatus({
        team_id,
        game_id,
        status
    });
    await getGameRequestsByUser();
    

};
</script>