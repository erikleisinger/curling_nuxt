<template>
    <DialogFloating @close="toggleTeamViewer({ open: false })">
        <header class="pretty-shadow q-px-sm" ref="header">
            <div class="row">
                <TeamBasic :item="team" v-if="!loading" editable />
            </div>
            <nav>
                <q-tabs dense v-model="tab" stretch>
                    <q-tab name="stats" label="Stats" style="width: 33%" />
                    <q-tab name="players" label="Players" style="width: 33%" />
                    <q-tab name="history" label="History" style="width: 33%" />
                </q-tabs>
            </nav>
        </header>

        <main :style="`height: calc(100% - ${height}px); overflow: auto`">
            <KeepAlive>
                <div v-if="tab === 'history'">
                    <div v-if="results">
                        <div
                            v-for="result in results"
                            :key="result.id"
                            class="result__container"
                        >
                            <div
                                class="team__profile--container column no-wrap"
                            >
                                <div class="q-pa-md">
                                    <Avataaar v-bind="parseAvatar(team.team_avatar)" />
                                </div>
                                <h2 class="text-sm truncate-text">
                                    {{ team.name }}
                                </h2>
                            </div>
                            <div
                                class="row justify-around items-center text-xxxl"
                            >
                                <div
                                    class="column justify-center items-center no-wrap"
                                >
                                    <div>{{ result.points_for ?? 0 }}</div>
                                    <q-icon
                                        name="circle"
                                        :color="result.my_color"
                                        size="xs"
                                    />
                                </div>
                                <div
                                    class="column justify-center items-center no-wrap"
                                >
                                    {{ result.points_against ?? 0 }}
                                    <q-icon
                                        name="circle"
                                        :color="result.opposition_color"
                                        size="xs"
                                    />
                                </div>
                            </div>

                            <div
                                class="team__profile--container column no-wrap"
                            >
                                <div class="q-pa-md">
                                    <Avataaar
                                        v-bind="
                                            parseAvatar(
                                                result.opposition_avatar
                                            )
                                        "
                                    />
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
                </div>

                <TeamStatsView :teamId="team.id" v-else-if="tab === 'stats'" />

                <TeamPlayerList v-else-if="tab === 'players'" :item="team" />
            </KeepAlive>
        </main>
    </DialogFloating>
</template>
<style lang="scss">
$header-height: 2em;
.result__container {
    display: grid;
    // grid-template-rows: 1fr auto;
    grid-template-rows: 100%;
    grid-template-columns: 30% 40% 30%;
}
.team-viewer__wrap {
    display: grid;
    grid-template-rows: 2em calc(40% - $header-height / 2) calc(
            60% - $header-height / 2
        );
}
</style>
<script setup lang="ts">
import { useEditorStore } from "@/store/editor";
import { useTeamStore } from "@/store/teams";
import { useUserStore } from "@/store/user";
import { parseAvatar } from "@/utils/avatar";
import { useElementSize } from "@vueuse/core";
import Team from '@/types/team'
const editorStore = useEditorStore();

const tab = ref("stats");

const { toggleTeamViewer } = editorStore;

const { format } = useTime();

const loading = ref(false);

const teamStore = useTeamStore();

const teamId = editorStore.teamViewer.team?.id;

const team = computed(() =>  teamStore.teams.find((t) => t.id === teamId))



const results = ref(null);
const getTeamRecord = async (team_id_param: number) => {
    const client = useSupabaseClient();
    const { data } = await client.rpc("get_team_record", { team_id_param });
    if (data) results.value = data;
};

onMounted(() => {
    getTeamRecord(teamId);
})

const userStore = useUserStore();
const canEdit = computed(() => team.value?.profile_id === userStore.id);

const header = ref(null);
const { height } = useElementSize(header);
</script>
