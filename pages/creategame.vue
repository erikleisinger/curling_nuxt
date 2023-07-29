<template>
  <GlobalLoading :value="progress - 0.1" :label="message" v-if="loading"/>
    <div class="game-editor__wrap" ref="gameEditor" v-else>
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
            <q-btn @click="beginGame('score')" disable>Linescore</q-btn>
            <q-btn @click="beginGame('rock')">Rock chart</q-btn>
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
import {findTeamPosition } from '@/utils/create-game'
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

const loading = ref(false)
const {initGame, progress, message} = useCreateGame();
const beginGame = async (goTo) =>  {
    loading.value = true;
    const gameId = await  initGame({
        home: home.value,
        away: away.value,
        away_color: away_color.value,
        home_color: home_color.value,
        awayHammer: awayHammer.value,
        homeHammer: homeHammer.value,
        awayPlayers: awayPlayers.value,
        homePlayers: homePlayers.value,
        name: name.value,
        rink: rink.value,
        sheet: sheet.value,
        time: time.value
    })

    if (goTo === "rock") {
            navigateTo(`/game?id=${gameId}`);
    }

}

</script>
