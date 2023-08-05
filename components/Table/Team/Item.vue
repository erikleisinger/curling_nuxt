<template>
     <q-item-section :style="{transform: deleteOpen ? 'translateX(-3em)' : ''}" ref="teamItem" style="transition: transform 0.3s"  >
                    <q-item-label class="row items-center no-wrap">
                        <div class="flex-shrink truncate-text" v-if="!editingName">
                            {{ item.name || "Unnamed team" }}
                        </div>
                        <q-input v-else dense v-model="editedName" @keydown.enter="saveName"  @blur="() => editingName = false" autofocus>
                            <template v-slot:append>
                                  <q-btn size="xs" flat round icon="check" color="grey-8" @click="saveName" :disable="savingName" />
                            </template>
                        </q-input>  
                        <q-btn size="xs" flat round icon="edit" color="grey-8" @click="editingName = true" :disable="savingName" v-if="!editingName" />
                    </q-item-label>

                    <q-item-label caption class="row" style="max-height: 143px">
                        <div class="col-6">
                            <TableTeamPlayer
                                :parsedAvatar="
                                    parseAvatar(item.lead_player_id?.avatar)
                                "
                                  :player="item.lead_player_id ?? {}"
                                position="lead"
                                @add="
                                    playerSelectOpen = {
                                        teamId: item.id,
                                        position: 'lead',
                                    }
                                "
                                @remove="
                                    removePlayer(
                                        item.id,
                                        'lead'
                                    )
                                "
                            />

                            <TableTeamPlayer
                                :parsedAvatar="
                                    parseAvatar(item.second_player_id?.avatar)
                                "
                                 :player="item.second_player_id ?? {}"
                                position="second"
                                @add="
                                    playerSelectOpen = {
                                        teamId: item.id,
                                        position: 'second',
                                    }
                                "
                                @remove="
                                    removePlayer(
                                        item.id,
                                        'second'
                                    )
                                "
                            />

                            <TableTeamPlayer
                                :parsedAvatar="
                                    parseAvatar(item.third_player_id?.avatar)
                                "
                                :player="item.third_player_id ?? {}"
                                position="third"
                                @add="
                                    playerSelectOpen = {
                                        teamId: item.id,
                                        position: 'third',
                                    }
                                "
                                @remove="
                                    removePlayer(
                                        item.id,
                                        'third'
                                    )
                                "
                            />

                            <TableTeamPlayer
                                :parsedAvatar="
                                    parseAvatar(item.fourth_player_id?.avatar)
                                "
                                  :player="item.fourth_player_id ?? {}"
                                position="fourth"
                                @add="
                                    playerSelectOpen = {
                                        teamId: item.id,
                                        position: 'fourth',
                                    }
                                "
                                @remove="
                                    removePlayer(
                                        item.id,
                                        'fourth'
                                    )
                                "
                            />
                        </div>
                        <div class="col-6">
                            <TableTeamPlayer
                                :parsedAvatar="
                                    parseAvatar(item.fifth_player_id?.avatar)
                                "
                                 :player="item.fifth_player_id ?? {}"
                                position="fifth"
                                @add="
                                    playerSelectOpen = {
                                        teamId: item.id,
                                        position: 'fifth',
                                    }
                                "
                                @remove="
                                    removePlayer(
                                        item.id,
                                        'fifth'
                                    )
                                "
                            />

                            <TableTeamPlayer
                                :parsedAvatar="
                                    parseAvatar(item.sixth_player_id?.avatar)
                                "
                                 :player="item.sixth_player_id ?? {}"
                                v-if="item.fifth_player_id?.id"
                                position="sixth"
                                @add="
                                    playerSelectOpen = {
                                        teamId: item.id,
                                        position: 'sixth',
                                    }
                                "
                                @remove="
                                    removePlayer(
                                        item.id,
                                        'sixth'
                                    )
                                "
                            />
                            <TableTeamPlayer
                                :parsedAvatar="
                                    parseAvatar(item.seventh_player_id?.avatar)
                                "
                                  :player="item.seventh_player_id ?? {}"
                                v-if="item.sixth_player_id?.id"
                                position="seventh"
                                @add="
                                    playerSelectOpen = {
                                        teamId: item.id,
                                        position: 'seventh',
                                    }
                                "
                                @remove="
                                    removePlayer(
                                        item.id,
                                        'seventh'
                                    )
                                "
                            />
                        </div>
                    </q-item-label>
                </q-item-section>
                <transition appear enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
                <div class="delete__section row justify-center items-center"  v-if="deleteOpen" @click="deleteItem">
                    <q-icon flat round name="delete"  size="md"/>
                </div>
                </transition>
                 <DialogPlayerSelect
            v-if="!!playerSelectOpen"
            @select="addPlayer"
            @close="playerSelectOpen = null"
        />
</template>
<style lang="scss" scoped>
    .delete__section {
        position:absolute; 
        right: 0; 
        top:0; 
        width: calc(3em + 16px); 
        background-color: $negative; 
        height: 100%;
        color: white;
    }

</style>
<script setup lang="ts">
import {useSwipe} from '@vueuse/core'
import { TABLE_NAMES} from '@/constants/tables'
import {useTeamStore} from '@/store/teams'
const props = defineProps({
    item: Object,
})

const loading = ref(false)

const editedName = ref(null)
const teamStore = useTeamStore()
const {removePlayerFromTeam, addPlayerToTeam} = teamStore;

const removePlayer = async (
    teamId: number,
    position: string
) => {
    loading.value = true;
    await removePlayerFromTeam(teamId, position)
    loading.value = false;

};

const deleteOpen = ref(false)

const teamItem = ref(null);
const {direction} = useSwipe(teamItem, {
    onSwipe: () => {
        if (direction.value === 'right') {
            deleteOpen.value = false;
        } else if (direction.value === 'left') {
            deleteOpen.value = true;
        }
    }
})

const emit = defineEmits(['delete'])

const deleteItem = () => {
    emit('delete');
    deleteOpen.value = false;
}

const playerSelectOpen = ref(null);

const addPlayer = async (playerId: number) => {
    const {position, teamId} = {...(playerSelectOpen.value ?? {})};
    playerSelectOpen.value = null;
    if (!position || !teamId) {
        console.error('error adding player to team: no position or team id specified: ', position, teamId)
        return;
    }
    loading.value = true;
    await teamStore.addPlayerToTeam(playerId, teamId, position)
    loading.value =  false;
};


const editingName = ref(false)

onMounted(() => {
    editedName.value = props.item?.name
})

const updateTeamName = async () => {

}

const savingName = ref(false)
const saveName = async () => {
    savingName.value = true;
    editingName.value = false;
    await teamStore.updateTeamName(editedName.value, props.item?.id)
    savingName.value = false;
}


</script>
