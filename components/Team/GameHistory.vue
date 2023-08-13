<template>
<div class="full-height"   v-if="results?.length">
        <div
            v-for="result in results"
            :key="result.id"
            class="result__container"
            @click="editGame(result.id)"
          
        >
            <div class="team__profile--container column no-wrap">
                <div class="q-pa-md">
                    <Avataaar v-bind="parseAvatar(team.team_avatar)" />
                </div>
                <h2 class="text-sm truncate-text">
                    {{ team.name }}
                </h2>
            </div>
            <div class="row justify-around items-center text-xxxl">
                <div class="column justify-center items-center no-wrap">
                    <div>{{ result.points_for ?? 0 }}</div>
                    <q-icon name="circle" :color="result.my_color" size="xs" />
                </div>
                <div class="column justify-center items-center no-wrap">
                    {{ result.points_against ?? 0 }}
                    <q-icon
                        name="circle"
                        :color="result.opposition_color"
                        size="xs"
                    />
                </div>
            </div>

            <div class="team__profile--container column no-wrap">
                <div class="q-pa-md">
                    <Avataaar v-bind="parseAvatar(result.opposition_avatar)" />
                </div>
                <h2 class="text-sm truncate-text">
                    {{ result.opposition_name }}
                </h2>
            </div>
            <div
                class="overline row justify-center text-xs"
                style="grid-column: 1/4; margin-top: -1em"
            >
                {{ format(result.start_time, "MMMM D, YYYY") }}
            </div>
        </div>
</div>
<div class="full-height relative-position row justify-center items-center"   v-else>
    <q-inner-loading :showing="loading" color="deep-purple" label="Loading games..."/>
    <div v-if="!loading">
        <div class="column items-center">
            <q-icon name="sentiment_very_dissatisfied" size="7em" color="deep-purple"/>
            <div class="q-mt-sm">{{team.name || 'Unnamed team'}} has no games!</div>
            </div>
    </div>
</div>
</template>
<style lang="scss" scoped>
$header-height: 2em;
.result__container {
    display: grid;
    // grid-template-rows: 1fr auto;
    grid-template-rows: 100%;
    grid-template-columns: 30% 40% 30%;
    padding: var(--space-sm);
}
</style>
<script setup>
import { watchDebounced } from "@vueuse/core";
import {useEditorStore} from '@/store/editor'
const props = defineProps({
    team: Object,
    teamId: Number,
});
const { format } = useTime();

const loading = ref(true)

const getTeamRecord = async (team_id_param) => {
 
    const client = useSupabaseClient();
    const { data } = await client.rpc("get_team_record", { team_id_param });
    if (data) results.value = data;

};
const results = ref(null);

const currentTeamId = computed(() => props?.teamId);
watchDebounced(
    currentTeamId,
    async () => {
           loading.value = true;
        results.value = null;
        
        await getTeamRecord(props.teamId);
            loading.value = false;
    },
    { debounce: 500, immediate: true }
);

const editGame = (gameId) => {
    const editorStore = useEditorStore();
    editorStore.toggleLineScore({open: true, editedGame: {id: gameId}})
    console.log('edit: ', gameId)
}
</script>
