<template>
    <div class="wrap">
        <header class="pre-game__header">
            <h1 class="text-lg text-center text-bold">Pre-game</h1>
            <h2 class="text-sm text-center">
                Select a rink and sheet and we'll give you personalized
                recommendations for your upcoming game!
            </h2>
        </header>
        <main>
            <section class="selection--section section">
                <q-input
                    readonly
                    v-model="team.name"
                    dense
                    label="Click to select your team"
                    @click="toggleTeamSearch"
                />
                <q-input
                    v-model="opponent.name"
                    dense
                    label="Search for a team or type a name"
                >
                    <template v-slot:append>
                        <q-btn
                            flat
                            round
                            dense
                            size="md"
                            icon="search"
                            @click="toggleOpponentSearch"
                        />
                    </template>
                </q-input>
                <q-input
                    readonly
                    @click="toggleRinkSearch"
                    :model-value="rink?.name"
                    dense
                    label="Click to select rink"
                />
                <div
                    v-if="!showSheetSelect && rink"
                    @click="showSheetSelect = true"
                    class="text-md text-center text-underline sheet-select--text"
                >
                    {{
                        sheet
                            ? `Sheet ${sheet}/${numberToLetter(sheet)}`
                            : "Click to select sheet"
                    }}
                </div>
                <div class="row justify-center" v-if="showSheetSelect">
                    <div
                        v-for="number in [...Array(rink?.sheets).keys()].map(
                            (i) => i + 1
                        )"
                        :key="`sheet-${number}`"
                        class="sheet__number"
                        :class="{
                            selected: sheet?.number === number,
                        }"
                        @click="selectSheet(number)"
                    >
                        <!-- -->
                        <span>{{ number }}{{ numberToLetter(number) }}</span>
                    </div>
                </div>
                <div class="full-width row justify-center q-mt-md">
                <q-btn rounded color="primary" :disable="generating || !sheet || !rink || !opponent || !team" @click="generatePreGame" :loading="generating">Generate</q-btn>
                </div>
            </section>
            <section>
              
                <div class="row color-stats__container justify-around" v-if="allSheetGameCount">
                      <h3 class="text-md text-center text-bold col-12">Color selection</h3>
                      <h4 class="text-sm text-center" style="margin-top: -1em">
                        On sheet {{ sheet }}{{ numberToLetter(sheet) }}, % of the time each color wins
                      </h4>
                <div class="column" v-if="colorStats.yellow !== undefined">
                    <div class="row">
                        <div style="width: 1em" class="q-mr-sm">
                            <RockIcon :draggable="false" color="yellow" />
                        </div>
                        <div class="text-sm">Yellow</div>
                    </div>

                    <div class="text-bold text-lg">
                        <strong
                            >{{
                                (colorStats.yellow /
                                    allSheetGameCount) *
                                100
                            }}%</strong
                        >
                     
                    </div>
                </div>

                <div class="column" v-if="colorStats.red !== undefined">
                    <div class="row">
                        <div style="width: 1em" class="q-mr-sm">
                            <RockIcon :draggable="false" color="red" />
                        </div>
                        <div class="text-sm">Red</div>
                    </div>

                    <div class="text-bold text-lg">
                        <strong
                            >{{
                                (colorStats.red /
                                    allSheetGameCount) *
                                100
                            }}%</strong
                        >
                     
                    </div>
                </div>
                 <div class="column" v-if="colorStats.blue !== undefined">
                    <div class="row">
                        <div style="width: 1em" class="q-mr-sm">
                            <RockIcon :draggable="false" color="blue" />
                        </div>
                        <div class="text-sm">Blue</div>
                    </div>

                    <div class="text-bold text-lg">
                        <strong
                            >{{
                                (colorStats.blue /
                                    allSheetGameCount) *
                                100
                            }}%</strong
                        >
                     
                    </div>
                </div>
                </div>
                 <TeamStatsView
            v-if="!generating && showStats"
            :teamId="team.id"
            :oppositionId="opponent?.id"
            :oppositionName="opponent?.name"
            h2h
        />
            </section>
        </main>
    </div>
</template>
<style lang="scss" scoped>
.color-stats__container {
    gap: var(--space-sm);
    padding: var(--space-sm)
}
.wrap {
    height: calc(100 * var(--vh, 1vh));
    overflow: auto;
}
.pre-game__header {
    padding: var(--space-md);
    padding-bottom: 0px;
}
.sheet__number {
    padding: var(--space-xs);
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin: var(--space-xs);
    text-align: center;
    border-radius: 4px;
    width: calc(2ch + var(--space-xs) * 2);
    transition: transform 0.1s;
    height: fit-content;
    &.selected {
        color: white;
        background-color: $deep-purple;
        transform: scale(1.1);
        font-weight: bold;
    }
}
.section {
    border: 1px solid rgba(0, 0, 0, 0.1);

    border-radius: 8px;
    margin: 0px var(--space-sm);
    margin-top: var(--space-md);
    padding: var(--space-sm);
}
.sheet-select--text {
    margin-top: var(--space-sm);
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import { useUserTeamStore } from "@/store/user-teams";

import GameTeam from "@/store/models/game-team";
import TeamStats from '@/store/models/team-stats'
import Team from '@/store/models/team'
import GET_TEAM_WITH_STATS from '@/queries/get_team_with_stats'

const { toggleGlobalSearch } = useDialogStore();

const rink = ref(null);
const sheet = ref(null);
const team = ref({});
const opponent = ref({});

const showSheetSelect = ref(false);

const toggleRinkSearch = () => {
    toggleGlobalSearch({
        open: true,
        options: {
            inputLabel: "Search for a rink",
            resourceTypes: ["rink"],
            callback: (selection) => {
                rink.value = selection;
            },
        },
    });
};

const toggleTeamSearch = () => {
    toggleGlobalSearch({
        open: true,
        options: {
            inputLabel: "Search for a team",
            resourceTypes: ["team"],
            restrictIds: useUserTeamStore().userTeams.map(({ id }) => id),
            callback: (selection) => {
                team.value = selection;
                GET_TEAM_WITH_STATS(selection?.id)
            },
        },
    });
};

const toggleOpponentSearch = () => {
    toggleGlobalSearch({
        open: true,
        options: {
            inputLabel: "Search for an opponent",
            resourceTypes: ["team"],
            callback: (selection) => {
                opponent.value = selection;
                 GET_TEAM_WITH_STATS(selection?.id)
            },
        },
    });
};

const selectSheet = (number) => {
    sheet.value = number;
    showSheetSelect.value = false;
};

const searchParams = computed(() => ({
    rink: rink.value,
    sheet: sheet.value,
    team: team.value,
    opponent: opponent.value,
}));



const getSheet = async (number, rink_id) => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("sheets")
        .select("id")
        .eq("number", number)
        .eq("rink_id", rink_id)
        .single();
    const { id } = data ?? {};
    return id;
};

const sheetGames = ref([]);
const sheetGamesFiltered = computed(() =>
    sheetGames.value.filter(({ team: t }) => t?.id === team.value?.id)
);
const opponentGames = ref([]);
const myGames = ref([])

const { getGames } = useGame();

const generating = ref(false)
const showStats = ref(false)
const generatePreGame = async () => {
    generating.value = true;
    showStats.value = false;
    const { id: rink_id } = rink.value;

    const sheetId = await getSheet(sheet.value, rink_id);

    const games = await getGames({
        team_id_param: team?.value?.id,
        game_id_param: null,
    });
    myGames.value = games.filter(
        (game) =>
            game?.team?.id === team.value?.id

    );
    sheetGames.value = games.filter(({ sheet }) => sheet?.id === sheetId);
    opponentGames.value = games.filter(
        (game) =>
            game.team?.id === opponent.value?.id ||
            game.team?.name?.toLowerCase().replaceAll(" ", "") ===
                opponent.value.name?.toLowerCase().replaceAll(" ", "")
    );
     await generateColorStats(sheetId);
    await generateHeadToHead()
    generating.value = false;
    showStats.value = true;
};

const colorStats = ref({});
const allSheetGameCount = ref(0)

const generateColorStats = async (sheet_id) => {
    const client = useSupabaseClient();
    const { data: allGames } = await client
        .from("games")
        .select("id")
        .eq("sheet_id", sheet_id);
    allSheetGameCount.value = allGames?.length
    const gameIds = allGames.map(({ id }) => id);
    const { data: stats } = await client
        .from("team_stats")
        .select("*")
        .in("game_id", gameIds);
    stats.forEach((stat) => {
        const gameTeam = useRepo(GameTeam)
            .where("game_id", stat.game_id)
            .where("team_id", (val) => {
                return val === stat.team_id || val > 10000000;
            })
            .first();
        if (!gameTeam) return;
        const { color } = gameTeam;
        if (!colorStats.value[color]) colorStats.value[color] = 0
        colorStats.value[color] += stat.win
    });
};

const getCumulativeStats = (statsArray) => {
    return statsArray.reduce((all, current) => {
        const allCopy = { ...all };
        Object.keys(current).forEach((key) => {
            allCopy[key] = (typeof allCopy[key] === 'number' ? allCopy[key] : 0) + current[key];
        });
        return allCopy;
    }, {});
};

const generateHeadToHead = async () => {
    const client = useSupabaseClient();
    const {data:games} = await client.from('games').select('id').or(`home.eq.${team.value.id},away.eq.${team.value.id}`);
    const {data:teamstats} = await client.from('team_stats').select('*').in('game_id', games.map(({id}) => id))
    console.log('got teamstats: ', teamstats)
    teamstats.forEach((stat) => {
        
        useRepo(TeamStats).save({...stat,
        team_id: stat.team_id || stat.game_id + 100000000})
    })
    const h2hGames = myGames.value.filter(({game_id}) => opponentGames.value.some(({game_id: gid}) => gid === game_id))


    const stats = useRepo(TeamStats).query().whereIn('game_id', h2hGames.map(({game_id}) => game_id)).get();

}


</script>
