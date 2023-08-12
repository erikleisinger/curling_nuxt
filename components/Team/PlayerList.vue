<template>
    <q-item-section ref="teamItem" style="display: block">
        <div style="max-height: 2em; position: relative" class="q-my-sm"></div>

        <div class="row" v-if="hasPlayers()">
            <ProfileCard
                class="col-12 col-sm-6"
                v-for="position in [
                    'fourth',
                    'third',
                    'second',
                    'lead',
                    'fifth',
                ]"
                :key="`${item.id}-${position}`"
                :avatar="getPlayer(item[`${position}_player_id`]?.id)?.avatar"
            >
                <template v-slot:overline> Player </template>
                {{ getPlayer(item[`${position}_player_id`]?.id)?.name }}
                <template v-slot:subtitle>
                    {{ position }}
                </template>
                <template v-slot:append>
                    <q-btn
                        flat
                        round
                        :icon="
                            item[`${position}_player_id`]?.id
                                ? 'change_circle'
                                : 'add'
                        "
                        color="grey-8"
                        v-if="!readOnly"
                        @click="openPlayerSelector(position)"
                    ></q-btn>
                </template>
            </ProfileCard>
            <ProfileCard
                v-if="item.fifth_player_id?.id"
                class="col-12 col-sm-6"
                :avatar="getPlayer(item[`sixth_player_id`]?.id)?.avatar"
            >
                {{ getPlayer(item[`sixth_player_id`]?.id)?.name }}
                <template v-slot:subtitle> sixth </template>
                <template v-slot:append>
                    <q-btn
                        v-if="!readOnly"
                        flat
                        round
                        :icon="
                            item.sixth_player_id?.id ? 'change_circle' : 'add'
                        "
                        color="grey-8"
                        @click="openPlayerSelector('sixth')"
                    ></q-btn>
                </template>
            </ProfileCard>
            <ProfileCard
                v-if="item.sixth_player_id?.id"
                class="col-12 col-sm-6"
                :avatar="getPlayer(item.seventh_player_id?.id)?.avatar"
            >
                {{ getPlayer(item.seventh_player_id?.id)?.name }}
                <template v-slot:subtitle> seventh </template>
                <template v-slot:append>
                    <q-btn
                        v-if="!readOnly"
                        flat
                        round
                        :icon="
                            item.seventh_player_id?.id ? 'change_circle' : 'add'
                        "
                        color="grey-8"
                        @click="openPlayerSelector('seventh')"
                    ></q-btn>
                </template>
            </ProfileCard>
        </div>
        <div
            class="row no-wrap justify-center items-center text-sm text-italic"
            style="height: 4em"
            v-else
        >
            {{ item.name }} has no players!
        </div>
    </q-item-section>
</template>
<script setup lang="ts">
import { useEditorStore } from "@/store/editor";
import { useTeamStore } from "@/store/teams";
import { usePlayerStore } from "@/store/players";
const props = defineProps({
    item: Object,
});

const loading = ref(false);

const hasPlayers = () => {
    return (
        !!props.item?.lead_player_id?.id ||
        !!props.item?.second_player_id?.id ||
        !!props.item?.third_player_id?.id ||
        !!props.item?.fourth_player_id?.id ||
        !!props.item?.fifth_player_id?.id ||
        !!props.item?.sixth_player_id?.id ||
        !!props.item?.seventh_player_id?.id
    );
};

const openPlayerSelector = (position: string) => {
    const { addPlayerToTeam } = useTeamStore();
    const editorStore = useEditorStore();
    editorStore.togglePlayerSelect({
        open: true,
        onSelect: (playerId: number) => {
            addPlayerToTeam(playerId, props.item?.id, position);
        },
    });
};
const playerStore = usePlayerStore();
const getPlayer = (id: number) => {
    return playerStore.players.find((p) => p.id === id) || {};
};

const { user: userId } = useUser();

const readOnly = props.item?.profile_id !== userId.value;

const columns = ref(readOnly ? "30% 70%" : "30% auto auto");
</script>
