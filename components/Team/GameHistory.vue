<template>
    <div class="full-height game-results__container" v-if="results?.length">
    <TeamGameResult   v-for="result in results"
            :key="result.id"
            :result="result"
            @click="expand(result.id)"
            :expanded="expanded === result.id"/>
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
    const client = useSupabaseClient();
    const { data } = await client.rpc("get_team_record", { team_id_param });
    if (data) results.value = data.map((d) => ({
        id: d.id,
        home_avatar: props.team?.team_avatar,
        home_name: props.team?.name,
        home_points: d.points_for,
        home_color: d.my_color,
        away_avatar: d.opposition_avatar,
        away_name: d.opposition_name,
        away_points: d.points_against,
        away_color: d.opposition_color
    }));
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
