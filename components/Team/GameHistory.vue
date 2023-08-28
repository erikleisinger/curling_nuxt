<template>
    <div class="full-height game-results__container" v-if="results?.length">
    <TeamGameResult   v-for="result in results"
            :key="result.id"
            :result="result"
            :expanded="expanded === result.id"
            @expand="expand(result.id)"
    
            
            />
    </div>
    <div
        class="full-height relative-position row justify-center items-center"
        v-else
    >
        <q-inner-loading
            :showing="loading"
            color="deep-purple"
            label="Loading games..."
        />
        <div v-if="!loading">
            <div class="column items-center">
                <q-icon
                    name="sentiment_very_dissatisfied"
                    size="7em"
                    color="deep-purple"
                />
                <div class="q-mt-sm">
                    {{ team.name || "Unnamed team" }} has no games!
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .game-results__container {
        padding: var(--space-sm);
    }
</style>
<script setup>
import { watchDebounced } from "@vueuse/core";

const props = defineProps({
    team: Object,
    teamId: Number,
});
const { format } = useTime();

const loading = ref(true);

const getTeamRecord = async (team_id_param) => {
    const {getTeamGames} = useGame();
    const games = await getTeamGames([team_id_param])
    results.value = games;
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

const expanded = ref(null)
const expand = (id) => {
    if (expanded.value === id) {
        expanded.value = null;
    } else {
        expanded.value = id;
    }
}


</script>
