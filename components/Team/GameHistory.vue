<template>
        <div
            v-for="result in results"
            :key="result.id"
            class="result__container"
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
const props = defineProps({
    team: Object,
    teamId: Number,
});
const { format } = useTime();

const getTeamRecord = async (team_id_param) => {
    const client = useSupabaseClient();
    console.log("GET: ", team_id_param);
    const { data } = await client.rpc("get_team_record", { team_id_param });
    if (data) results.value = data;
};
const results = ref(null);

const currentTeamId = computed(() => props?.teamId);
watchDebounced(
    currentTeamId,
    () => {
        results.value = null;
        getTeamRecord(props.teamId);
    },
    { debounce: 500, immediate: true }
);
</script>
