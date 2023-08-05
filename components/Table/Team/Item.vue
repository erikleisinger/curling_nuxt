<template>
    <q-item-section
        :style="{ transform: deleteOpen ? 'translateX(-3em)' : '' }"
        ref="teamItem"
        style="transition: transform 0.3s"
    >
    <div style="max-height: 2em" class="q-my-sm">
    <InputName :name="item.name" @save="saveName">
        <template v-slot:text>
        <h2 class="text-md text-bold truncate-text">{{ item.name }}</h2>
    </template>
    </InputName>
    </div>

        <q-item-label caption class="row" style="max-height: 143px">
            <div class="col-6">
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.lead_player_id?.avatar)"
                    :player="item.lead_player_id ?? {}"
                    position="lead"
                    @add="openPlayerSelector('lead')"
                    @remove="removePlayer(item.id, 'lead')"
                />

                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.second_player_id?.avatar)"
                    :player="item.second_player_id ?? {}"
                    position="second"
                    @add="openPlayerSelector('second')"
                    @remove="removePlayer(item.id, 'second')"
                />

                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.third_player_id?.avatar)"
                    :player="item.third_player_id ?? {}"
                    position="third"
                    @add="openPlayerSelector('third')"
                    @remove="removePlayer(item.id, 'third')"
                />

                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.fourth_player_id?.avatar)"
                    :player="item.fourth_player_id ?? {}"
                    position="fourth"
                    @add="openPlayerSelector('fourth')"
                    @remove="removePlayer(item.id, 'fourth')"
                />
            </div>
            <div class="col-6">
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.fifth_player_id?.avatar)"
                    :player="item.fifth_player_id ?? {}"
                    position="fifth"
                    @add="openPlayerSelector('fifth')"
                    @remove="removePlayer(item.id, 'fifth')"
                />

                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.sixth_player_id?.avatar)"
                    :player="item.sixth_player_id ?? {}"
                    v-if="item.fifth_player_id?.id"
                    position="sixth"
                    @add="openPlayerSelector('sixth')"
                    @remove="removePlayer(item.id, 'sixth')"
                />
                <TableTeamPlayer
                    :parsedAvatar="parseAvatar(item.seventh_player_id?.avatar)"
                    :player="item.seventh_player_id ?? {}"
                    v-if="item.sixth_player_id?.id"
                    position="seventh"
                    @add="openPlayerSelector('seventh')"
                    @remove="removePlayer(item.id, 'seventh')"
                />
            </div>
        </q-item-label>
    </q-item-section>
    <transition
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
    >
        <div
            class="delete__section row justify-center items-center"
            v-if="deleteOpen"
            @click="deleteItem"
        >
            <q-icon flat round name="delete" size="md" />
        </div>
    </transition>

</template>
<style lang="scss" scoped>
.delete__section {
    position: absolute;
    right: 0;
    top: 0;
    width: calc(3em + 16px);
    background-color: $negative;
    height: 100%;
    color: white;
}
</style>
<script setup lang="ts">
import { useSwipe } from "@vueuse/core";
import { TABLE_NAMES } from "@/constants/tables";
import { useTeamStore } from "@/store/teams";
import {useEditorStore} from '@/store/editor'
const props = defineProps({
    item: Object,
});

const loading = ref(false);

const teamStore = useTeamStore();
const { removePlayerFromTeam, addPlayerToTeam } = teamStore;

const removePlayer = async (teamId: number, position: string) => {
    loading.value = true;
    await removePlayerFromTeam(teamId, position);
    loading.value = false;
};

const deleteOpen = ref(false);

const teamItem = ref(null);
const { direction } = useSwipe(teamItem, {
    onSwipe: () => {
        if (direction.value === "right") {
            deleteOpen.value = false;
        } else if (direction.value === "left") {
            deleteOpen.value = true;
        }
    },
});

const emit = defineEmits(["delete"]);

const deleteItem = () => {
    emit("delete");
    deleteOpen.value = false;
}

const openPlayerSelector = (position: string) => {
    const editorStore = useEditorStore();
    editorStore.togglePlayerSelect({open: true, onSelect: (playerId: number) => {
        addPlayer(playerId, position)
    }})
};

const addPlayer = async (playerId: number, position: string) => {
    const teamId = props.item?.id;
    if (!position || !playerId || !teamId) {
        console.error(
            "error adding player to team: no player or position or team specified: ",
            position,
            teamId,
            playerId,
        );
        return;
    }
    await teamStore.addPlayerToTeam(playerId, teamId, position);
};

const updateTeamName = async () => {};

const savingName = ref(false);
const saveName = async (name:string) => {
    teamStore.updateTeamName(name, props.item?.id);
};
</script>
