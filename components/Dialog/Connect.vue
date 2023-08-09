<template>
    <DialogFloating @close="editorStore.toggleConnectDialog({open: false})">
        
         <template v-slot:prependButton>
            <q-btn
                flat
                round
                icon="arrow_back"
                @click="unView"
             
            />
        </template>
        <div class="row q-pa-md" v-if="!viewing">
            <h1 class="text-md text-bold col-12">Search for a user</h1>
            <h2 class="text-sm">Enter a first/last name or username</h2>
            <div
                class="col-12 q-my-md search__container"
                style="position: sticky; top: 8px; z-index: 100"
            >
                <q-input
                    rounded
                    outlined
                    class="col-12"
                    v-model="searchInput"
                    @keydown.enter="search"
                    style
                >
                    <template v-slot:append>
                        <q-btn flat rounded icon="search" @click="search" />
                    </template>
                </q-input>
            </div>
            <div class="col-12">
                <q-item
                    v-for="item in results"
                    :key="item.id"
                    class="items-center row"
                >
                {{item.player_id}}
                    <q-item-section avatar>
                        <LazyPlayerAvatar
                            :parsedAvatar="parseAvatar(item.player_id?.avatar ?? {})"
                            :player="item"
                            :showStats="false"
                        />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label
                            class="row items-center"
                            style="line-height: 1em !important"
                            >{{ item.first_name }}
                            {{ item.last_name }}</q-item-label
                        >
                        <q-item-label
                            caption
                            class="row items-center"
                            style="line-height: 1em !important"
                            >@{{ item.username }}</q-item-label
                        >
                    </q-item-section>
                    <q-item-section side @click.stop.prevent >
                        <div class="text-grey-8 row no-wrap">
                            <q-btn text-color="deep-purple" flat @click="viewUser(item.id)">View</q-btn>
                        </div>
                    </q-item-section>
                </q-item>
            </div>
        </div>
        <q-inner-loading v-else-if="loading"/>
        <TeamList v-else-if="teams?.length" :teams="teams" @update="onItemUpdate"/>
    </DialogFloating>
</template>
<style lang="scss">
.search__container {
    .q-field__control {
        background-color: white !important;
    }
}
</style>
<script setup>
import { useThrottleFn } from "@vueuse/core";
import { parseAvatar } from "@/utils/avatar";
import {useEditorStore} from '@/store/editor';
import { TABLE_QUERIES } from "@/constants/query";

const editorStore = useEditorStore();
const searchInput = ref(null);
const results = ref([]);
const search = useThrottleFn(async () => {
    const formatted = searchInput.value
        .split(" ")
        .map((val) => `${val}:*`)
        .join(" | ");
    const client = useSupabaseClient();
    const { data } = await client
        .from("profiles")
        .select(
            `
                id,
                first_name,
                last_name,
                username,
                player_id (
                    avatar
                )
            `
        )
        .textSearch("profile_search", formatted);
    results.value = data;
}, 5000);

const viewing = ref(false)

const unView = () => {
    viewing.value = false;
}
const teams = ref([])
const loading = ref(false)
const viewUser = useThrottleFn(async (id) => {
        loading.value = true;
    viewing.value = true;

    const client = useSupabaseClient();
    const {data} = await client.rpc('get_teams_basic').eq('profile_id', id)
    teams.value = data;
    loading.value = false;



}, 2000)

const onItemUpdate = ({teamId, updates}) => {
    const teamIndex = teams.value.findIndex((t) => t.id === teamId);
    const team =  teams.value.find((t) => t.id === teamId);
    teams.value.splice(teamIndex, 1, {...team, ...updates})
}
</script>
