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
            </section>
            <section>
              
                <div class="row color-stats__container justify-around" v-if="colorStats?.red?.win || colorStats?.yellow?.win || colorStats?.blue?.win">
                      <h3 class="text-md text-center text-bold col-12">Color selection</h3>
                      <h4 class="text-sm text-center" style="margin-top: -1em">
                        On sheet {{ sheet }}{{ numberToLetter(sheet) }}, % of the time each color wins
                      </h4>
                <div class="column">
                    <div class="row">
                        <div style="width: 1em" class="q-mr-sm">
                            <RockIcon :draggable="false" color="yellow" />
                        </div>
                        <div class="text-sm">Yellow</div>
                    </div>

                    <div class="text-bold text-lg">
                        <strong
                            >{{
                                (colorStats.yellow.win /
                                    (sheetGames.length / 2)) *
                                100
                            }}%</strong
                        >
                     
                    </div>
                </div>

                <div class="column">
                    <div class="row">
                        <div style="width: 1em" class="q-mr-sm">
                            <RockIcon :draggable="false" color="red" />
                        </div>
                        <div class="text-sm">Red</div>
                    </div>

                    <div class="text-bold text-lg">
                        <strong
                            >{{
                                (colorStats.red.win /
                                    (sheetGames.length / 2)) *
                                100
                            }}%</strong
                        >
                     
                    </div>
                </div>
                 <div class="column">
                    <div class="row">
                        <div style="width: 1em" class="q-mr-sm">
                            <RockIcon :draggable="false" color="blue" />
                        </div>
                        <div class="text-sm">Blue</div>
                    </div>

                    <div class="text-bold text-lg">
                        <strong
                            >{{
                                (colorStats.blue.win /
                                    (sheetGames.length / 2)) *
                                100
                            }}%</strong
                        >
                     
                    </div>
                </div>
                </div>
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
    console.log(useUserTeamStore().userTeams.map(({ id }) => id));
    toggleGlobalSearch({
        open: true,
        options: {
            inputLabel: "Search for a team",
            resourceTypes: ["team"],
            restrictIds: useUserTeamStore().userTeams.map(({ id }) => id),
            callback: (selection) => {
                team.value = selection;
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

watch(searchParams, (val) => {
    if (!val.rink || !val.sheet || !val.team || !val.opponent) return;
    generatePreGame();
});

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

const { getGames } = useGame();

const generatePreGame = async () => {
    const { id: rink_id } = rink.value;

    const sheetId = await getSheet(sheet.value, rink_id);

    const games = await getGames({
        team_id_param: team?.value?.id,
        game_id_param: null,
    });
    console.log("games: ", games);
    const filtered = games.filter(
        (game) =>
            game?.team?.id === team.value?.id ||
            game.team?.id === opponent.value?.id ||
            game.team?.name?.toLowerCase().replaceAll(" ", "") ===
                opponent.value.name?.toLowerCase().replaceAll(" ", "")
    );
    sheetGames.value = games.filter(({ sheet }) => sheet?.id === sheetId);
    opponentGames.value = games.filter(
        (game) =>
            game.team?.id === opponent.value?.id ||
            game.team?.name?.toLowerCase().replaceAll(" ", "") ===
                opponent.value.name?.toLowerCase().replaceAll(" ", "")
    );
    console.log("filtered: ", filtered);
    generateColorStats(sheetId);
};

const colorStats = ref({
    yellow: {
        win: 0,
        loss: 0,
        tie: 0,
    },
    red: {
        win: 0,
        loss: 0,
        tie: 0,
    },
    blue: {
        win: 0,
        loss: 0,
        tie: 0,
    },
});

const generateColorStats = async (sheet_id) => {
    const client = useSupabaseClient();
    const { data: allGames } = await client
        .from("games")
        .select("id")
        .eq("sheet_id", sheet_id);
    const gameIds = allGames.map(({ id }) => id);
    const { data: stats } = await client
        .from("team_stats")
        .select("*")
        .in("game_id", gameIds);
    stats.forEach((stat) => {
        console.log("stat: ", stat);
        const gameTeam = useRepo(GameTeam)
            .where("game_id", stat.game_id)
            .where("team_id", (val) => {
                return val === stat.team_id || val > 10000000;
            })
            .first();
        if (!gameTeam) return;
        const { color } = gameTeam;
        colorStats.value[color][
            stat.win ? "win" : stat.loss ? "loss" : "tie"
        ] = 1;
    });
};
</script>
