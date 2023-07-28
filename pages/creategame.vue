<template>
    <div class="game-editor__wrap" ref="gameEditor">
        <nav
            class="registration__steps row items-center justify-center"
            v-if="!showGameOptions"
        >
            <q-breadcrumbs class="text-grey" active-color="primary">
                <template v-slot:separator>
                    <q-icon
                        size="1.2em"
                        name="arrow_forward"
                        color="primary"
                    ></q-icon>
                </template>

                <q-breadcrumbs-el
                    label="Game info"
                    icon="analytics"
                    @click="tab = TABS.INFO"
                    :disable="tab !== TABS.INFO"
                ></q-breadcrumbs-el>
                <q-breadcrumbs-el
                    label="Players"
                    icon="group"
                    @click="tab = TABS.PLAYERS"
                    :disable="tab !== TABS.PLAYERS"
                ></q-breadcrumbs-el>
                <q-breadcrumbs-el
                    label="Confirm"
                    icon="check"
                    @click="tab = TABS.CONFIRM"
                    :disable="tab !== TABS.CONFIRM"
                ></q-breadcrumbs-el>
            </q-breadcrumbs>
        </nav>
        <div v-else />
        <section
            class="section row full-height"
            v-show="tab === TABS.INFO && !showGameOptions"
        >
            <div
                class="row no-wrap items-center item__select--wrap col-12 col-sm-6"
                style="height: 3em"
            >
                <SelectColor
                    v-model="home_color"
                    size="2em"
                    :prevent="[away_color]"
                />
                <SelectResource
                    v-model="home"
                    :color="home_color"
                    fallback="Home team"
                    style="height: 100%"
                    :options="teamOptions"
                />
                <q-checkbox
                    v-model="homeHammer"
                    @update:model-value="setHammer('home')"
                    checked-icon="hardware"
                    unchecked-icon="o_hardware"
                    size="3em"
                    dense
                />
            </div>

            <div
                class="row no-wrap items-center item__select--wrap col-12 col-sm-6"
                style="height: 3em"
            >
                <SelectColor
                    v-model="away_color"
                    size="2em"
                    :prevent="[home_color]"
                />
                <SelectResource
                    v-model="away"
                    :color="away_color"
                    fallback="Away team"
                    style="height: 100%"
                    :options="teamOptions"
                />

                <q-checkbox
                    v-model="awayHammer"
                    @update:model-value="setHammer('away')"
                    checked-icon="hardware"
                    unchecked-icon="o_hardware"
                    size="3em"
                    dense
                />
            </div>
            <!-- Date input -->

            <div
                class="row no-wrap items-center item__select--wrap col-12 col-sm-6"
            >
                <q-icon name="calendar_month" color="grey-8" size="2em" />
                <InputDate v-model="time" class="input--full-width" />
            </div>
            <div
                class="row no-wrap items-center item__select--wrap col-12 col-sm-6"
            >
                <q-icon name="balcony" color="grey-8" size="2em" />
                <SelectResource
                    fallback="Home rink"
                    :options="rinkOptions"
                    v-model="rink"
                    class="input--full-width"
                />
            </div>
            <div
                class="row no-wrap items-center item__select--wrap col-12 col-sm-6"
            >
                <q-icon name="crop_portrait" color="grey-8" size="2em" />
                <SelectResource
                    fallback="Sheet A"
                    :options="sheetOptions"
                    v-model="sheet"
                    class="input--full-width"
                />
            </div>
            <div
                class="row no-wrap items-center item__select--wrap col-12 col-sm-6"
            >
                <q-icon name="list_alt" color="grey-8" size="2em" />
                <q-input
                    rounded
                    outlined
                    placeholder="Optional: game title"
                    class="input--full-width"
                    v-model="name"
                />
            </div>
        </section>
        <section
            v-show="tab === TABS.PLAYERS && !showGameOptions"
            class="section row players"
        >
            <div class="full-width player__container">
                <!-- Home team -->
                <div
                    class="full-width column no-wrap"
                    style="max-height: 350px; margin-bottom: 32px"
                >
                    <div
                        class="row no-wrap items-center item__select--wrap col-12 col-sm-6"
                        style="height: 3em"
                    >
                        <SelectColor
                            v-model="home_color"
                            size="2em"
                            :prevent="[away_color]"
                        />
                        <SelectResource
                            v-model="home"
                            :color="home_color"
                            fallback="Home team"
                            style="height: 100%"
                            :options="teamOptions"
                        />
                        <q-checkbox
                            v-model="homeHammer"
                            @update:model-value="setHammer('home')"
                            checked-icon="hardware"
                            unchecked-icon="o_hardware"
                            size="3em"
                            dense
                        />
                    </div>
                    <SelectTeamPlayers
                        :color="home_color"
                        :teamId="home && home.value"
                        defaultPrefix="Home team"
                        v-model="homePlayers"
                    />
                </div>
                <!-- Away team -->
                <div
                    class="full-width column no-wrap"
                    style="max-height: 350px"
                >
                    <div
                        class="row no-wrap items-center item__select--wrap col-12 col-sm-6"
                        style="height: 3em"
                    >
                        <SelectColor
                            v-model="away_color"
                            size="2em"
                            :prevent="[home_color]"
                        />
                        <SelectResource
                            v-model="away"
                            :color="away_color"
                            fallback="Away team"
                            style="height: 100%"
                            :options="teamOptions"
                        />

                        <q-checkbox
                            v-model="awayHammer"
                            @update:model-value="setHammer('away')"
                            checked-icon="hardware"
                            unchecked-icon="o_hardware"
                            size="3em"
                            dense
                        />
                    </div>
                    <SelectTeamPlayers
                        :color="away_color"
                        :teamId="away && away.value"
                        defaultPrefix="Away team"
                        v-model="awayPlayers"
                    />
                </div>
            </div>
        </section>
        <section
            v-show="tab === TABS.CONFIRM && !showGameOptions"
            class="confirm__container"
        >
            <div class="header column items-center">
                <h1 class="text-bold text-center">{{ name || "New game" }}</h1>
                <div v-if="time">{{ time }}</div>
            </div>
            <div class="full-width confirm__teams">
                <div
                    v-if="home"
                    class="team player__select--wrap"
                    :style="{ backgroundColor: getColor(home_color) }"
                >
                    <h1 class="text-md text-bold truncate-text">{{ home.label }}</h1>
                    <div>{{ homePlayers.lead && homePlayers.lead.label }}</div>
                    <div>
                        {{ homePlayers.second && homePlayers.second.label }}
                    </div>
                    <div>
                        {{ homePlayers.third && homePlayers.third.label }}
                    </div>
                    <div>
                        {{ homePlayers.fourth && homePlayers.fourth.label }}
                    </div>
                </div>
                <h1 class="text-md text-bold row items-center">VS</h1>
                <div
                    v-if="away"
                    class="text-right player__select--wrap"
                    :style="{ backgroundColor: getColor(away_color) }"
                >
                    <h1 class="text-md text-bold">{{ away.label }}</h1>
                    <div>{{ awayPlayers.lead && awayPlayers.lead.label }}</div>
                    <div>
                        {{ awayPlayers.second && awayPlayers.second.label }}
                    </div>
                    <div>
                        {{ awayPlayers.third && awayPlayers.third.label }}
                    </div>
                    <div>
                        {{ awayPlayers.fourth && awayPlayers.fourth.label }}
                    </div>
                </div>
            </div>
            <div class="info-section">
                <h1 class="text-bold text-md text-center">Location</h1>
                <div v-if="rink">{{ rink.label }}</div>
                <div v-if="sheet">{{ sheet.label }}</div>
                <div v-if="!sheet & !rink">Unspecified</div>
            </div>
        </section>
        <section
            v-if="showGameOptions"
            class="column justify-center items-center game-options__wrapper"
        >
            <q-btn @click="initGame('score')" disable>Linescore</q-btn>
            <q-btn @click="initGame('rock')">Rock chart</q-btn>
        </section>
        <div class="next__container">
            <q-btn
                color="primary"
                @click="goTab(+1)"
                v-if="tab !== TABS.CONFIRM"
                >Next</q-btn
            >
            <q-btn color="primary" @click="confirm" v-else>Confirm</q-btn>
        </div>
    </div>
</template>
<style lang="scss">
.game-editor__wrap {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 4em calc(100% - 8em) 4em;
    height: 100%;
    .registration__steps {
        padding: var(--space-sm);
        height: 4em;
    }
    .next__container {
        .q-btn {
            width: 100%;
            height: 100%;
        }
    }
    .section {
        overflow: auto;
        padding: var(--space-md);
        &.players {
            display: grid;
            grid-template-rows: repeat(2, auto);
        }
    }
    .item__select--wrap {
        display: grid;
        grid-template-columns: minmax(1em, 2em) auto minmax(1em, 2em);
        column-gap: var(--space-sm);
        margin-bottom: var(--space-md);
        max-height: 3em;
        .q-chip {
            margin: unset;
            width: 100%;
            height: inherit;
        }
    }
    .input--full-width {
        height: 100%;
        grid-column: 2/4;
    }
    .confirm__container {
        padding: var(--space-md);
        .confirm__teams {
            display: grid;
            grid-template-columns: minmax(auto, 47%) auto minmax(auto, 47%);
            column-gap: var(--space-sm);
            width: 100vw;
        }
        .info-section {
            margin-top: var(--space-md);
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .header {
            margin-bottom: var(--space-md);
        }
    }
    .player__select--wrap {
        border-radius: var(--space-sm);
        border: 1px solid var(--transparent-light);
        padding: var(--space-sm);
        position: relative;
        //grid-template-columns: minmax(60px, 2em) auto minmax(1em, 2em);
        color: white;
    }
    .game-options__wrapper {
        .q-btn {
            margin-bottom: var(--space-md);
        }
    }
}

@media all and (min-width: $screen-md-min) {
    .wrapper {
        grid-template-columns: 1fr 2fr;
        section:nth-child(2) {
            grid-area: 1 / 2 / 2 / 3;
        }
    }
}
@media all and (max-width: 1000px) {
    .wrapper {
        grid-template-columns: 1fr;
        section:nth-child(1) {
            grid-area: 1 / 1 / 2 / 2;
        }
    }
}
</style>
<script setup>
import { TABLE_NAMES } from "@/constants/tables";
import { useTeamStore } from "@/store/teams";
import { useRinkStore } from "@/store/rinks";
import { useUserStore } from "@/store/user";
import { useSheetStore } from "@/store/sheets";
import { useSwipe, useDebounceFn } from "@vueuse/core";
const dayjs = useDayjs();
const home_color = ref("yellow");
const home = ref(null);
const homeHammer = ref(true);
const homePlayers = ref({
    lead: null,
    second: null,
    third: null,
    fourth: null,
});

const away_color = ref("red");
const away = ref(null);
const awayHammer = ref(false);
const away_lead = ref(null);
const awayPlayers = ref({
    lead: null,
    second: null,
    third: null,
    fourth: null,
});

const name = ref(null);

const time = ref(dayjs().format("MMM D, YYYY h:mm A"));
const rink = ref(null);
const sheet = ref(null);

const tab = ref("info");
const TABS = {
    INFO: "info",
    PLAYERS: "players",
    CONFIRM: "confirm",
};

const session = {
    home: {
        custom: false,
        selection: null,
    },
    away: {
        custom: false,
    },
};

const teamStore = useTeamStore();
const teamOptions = computed(() => {
    return teamStore.teams.map((t) => {
        return {
            label: t.name || "Unnamed team",
            value: t.id,
        };
    });
});

const rinkStore = useRinkStore();

const rinkOptions = computed(() => {
    return rinkStore.rinks.map((r) => {
        return {
            label: r.name || "Unnamed rink",
            value: r.id,
        };
    });
});

const sheetStore = useSheetStore();

const sheetOptions = computed(() => {
    return sheetStore.sheets.map((r) => {
        return {
            label: r.name || "Unnamed sheet",
            value: r.id,
        };
    });
});

const setHammer = (team) => {
    if (team === "away") {
        homeHammer.value = !awayHammer.value;
    } else {
        awayHammer.value = !homeHammer.value;
    }
};

const goTab = useDebounceFn((inc) => {
    const currentTab = tab.value;
    const tabs = Object.values(TABS);
    const currentTabIndex = tabs.findIndex((t) => t === currentTab);
    const nextTabIndex = currentTabIndex + inc;
    if (nextTabIndex > tabs.length - 1 || nextTabIndex < 0) return;
    tab.value = tabs[nextTabIndex];
});
const gameEditor = ref(null);
const { direction } = useSwipe(gameEditor, {
    onSwipe: () => {
        if (showGameOptions.value) return;
        if (direction.value === "right") {
            goTab(-1);
        } else if (direction.value === "left") {
            goTab(+1);
        }
    },
    threshold: 100,
});

const { getColor } = useColor();

const showGameOptions = ref(false);
const confirm = () => {
    showGameOptions.value = true;
};

const findTeamPosition = (position, team) => {
    const { fifth_player_id, sixth_player_id, seventh_player_id } = team;
    const preferredPosition = `${position}_player_id`;

    let newPosition;
    if (!team[preferredPosition]) {
        newPosition = preferredPosition;
    } else if (!fifth_player_id) {
        newPosition = "fifth_player_id";
    } else if (!sixth_player_id) {
        newPosition = "sixth_player_id";
    } else if (!seventh_player_id) {
        newPosition = "seventh_player_id";
    }
    return newPosition;
};

const userStore = useUserStore();
const createPlayer = async (player, position, team) => {
    console.log("create player: ", player, "for team: ", team);

    const client = useSupabaseClient();
    const { label } = player;
    const { data, error } = await client
        .from(TABLE_NAMES.PLAYERS)
        .insert({
            name: label,
        })
        .select("id, name");
    if (error) throw new Error(`Error creating player '${label}'`);
    const [newPlayer] = data || [];
    const { id: playerId } = newPlayer || {};
    if (!playerId)
        throw new Error(
            `Error creating player '${label}': no information from database`
        );

    return playerId;
};

const insertPlayerIntoTeam = async (playerId, position, team) => {
    const newPosition = findTeamPosition(position, team);
    if (!newPosition) {
        console.log("CANNOT ADD PLAYER TO TEAM: TEAM FULL");
        return;
    }

    const client = useSupabaseClient();
    const { data, error } = await client
        .from(TABLE_NAMES.TEAMS)
        .update({ [newPosition]: playerId })
        .select(
            `
    ${newPosition}
    `
        )
        .eq("id", team.id);

    if (error)
        throw new Error(`Error inserting player into team: ${error.code}`);

    const [newTeam] = data || [];
    const player = newTeam[newPosition];

    console.log('PLAYER INSERTED: ', player)
};


const initPlayers = async (players, team) => {
    const { lead, second, third, fourth } = players;
    let leadId;
    if (!lead.value) {
        console.log("CREATE LEAD");
        leadId = await createPlayer(lead, "lead", team);
    } else {
        leadId = lead.value;
    }

    if (team.lead_player_id !== leadId) {
        await insertPlayerIntoTeam(leadId, "lead", team);
    }

    let secondId;
    if (!second.value) {
        console.log("CREATE second");
        secondId = await createPlayer(second, "second", team);
    } else {
        secondId = second.value;
    }

    if (team.second_player_id !== secondId) {
        await insertPlayerIntoTeam(secondId, "second", team);
    }

    let thirdId;
    if (!third.value) {
        console.log("CREATE THIRD");
        thirdId = await createPlayer(third, "third", team);
    } else {
        thirdId = third.value;
    }

    if (team.third_player_id !== thirdId) {
        await insertPlayerIntoTeam(thirdId, "third", team);
    }

    let fourthId;
    if (!fourth.value) {
        console.log("CREATE FOURTH");
        fourthId = await createPlayer(fourth, "fourth", team);
    } else {
        fourthId = fourth.value;
    }

    if (team.fourth_player_id !== fourthId) {
        await insertPlayerIntoTeam(fourthId, "fourth", team);
    }
};

const createTeam = async (team) => {
    const { label } = team;
    const client = useSupabaseClient();
    const { data, error } = await client
        .from(TABLE_NAMES.TEAMS)
        .insert({
            name: label,
        })
        .select(
            "id, name, lead_player_id, second_player_id, third_player_id, fourth_player_id, fifth_player_id, sixth_player_id, seventh_player_id"
        );
    if (error) throw new Error(`Error creating team '${label}'`);
    const [newTeam] = data || [];
    if (!newTeam?.id)
        throw new Error(
            `Error creating team '${label}': no information from database`
        );
    return newTeam;
};

const createGame = async (newGame) => {
    const client = useSupabaseClient();
    const {data, error} = await client.from(TABLE_NAMES.GAMES).insert(newGame).select('id')
    if (error) throw new Error(`Error creating game: (code ${code})`)
    const [game] = data || [];
    const {id} = game;
    if (!id) throw new Error('Error creating game: no return value')
    return id;
}

const initGame = async (goTo) => {
    //Init players

    // Init teams
    let homeTeam;
    if (!home.value.value) {
        homeTeam = await createTeam(home.value);
    } else {
        homeTeam = teamStore.teams.find(({ id }) => id === home.value.value);
    }

    let awayTeam;
    if (!away.value.value) {
        awayTeam = await createTeam(away.value);
    } else {
        awayTeam = teamStore.teams.find(({ id }) => id === away.value.value);
    }

    console.log("HOME TEAM: ", homeTeam);

    console.log("AWAY TEAM: ", awayTeam);

    initPlayers(homePlayers.value, homeTeam);
    initPlayers(awayPlayers.value, awayTeam);
    if (!rink.value.value) {
        console.log("INIT RINK");
    }
    if (!sheet.value.value) {
        console.log("INIT SHEET");
    }
    if (!name.value) {
        console.log("INIT NAME");
    }
    const {toUTC, toTimezone} = useTime();
   
    const newGame = {
        home: homeTeam.id,
        away: awayTeam.id,
        start_time: toUTC( toTimezone(time.value, null, true)),
        name: name.value,
        home_color: home_color.value,
        away_color: away_color.value,
        hammer_first_end: awayHammer.value ? awayTeam.id : homeTeam.id,

    }

    const gameId = await createGame(newGame)

    console.log('CREATED GAME: ', gameId)

    if (goTo === 'rock') {
        navigateTo(`/game?id=${gameId}`)
    }

    // console.log(rink.value, sheet.value);
};
</script>
