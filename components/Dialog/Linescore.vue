<template>
    <DialogFloating @close="toggleLineScore({ open: false })" :backable="false">

        <!-- Toolbar -->
        <template v-slot:buttonLeft>
            <div />
        </template>
        <template v-slot:buttonRight>
            <q-btn flat round icon="close" @click="confirmUnsaved = true" />
        </template>


        <!-- STEP 1: Team Select -->
        <LinescoreTeamSelect
            v-if="view === views.TEAM_SELECT"
            @complete="view = views.LINESCORE"
        />

        <!-- STEP 2: Line score input -->
        <div
            class="full-height scoreboard__container row justify-center items-center"
            v-if="view === views.LINESCORE"
        >
            <ButtonBottomDraggable icon="save" :onClick="save" />
            <div class="nav__container">
                <div
                    class="row justify-center items-center text-xl nav__container--item"
                >
                    <div class="nav-container--item__column">
                        <div></div>
                        <div class="row items-center" style="width: 1em">
                            <RockIcon :draggable="false" :color="homeColor" />
                        </div>
                        <div class="row items-center" style="width: 1em">
                            <RockIcon :draggable="false" :color="awayColor" />
                        </div>
                    </div>
                </div>
                <div
                    v-for="end in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                    :key="`${end}-label`"
                    class="row justify-center items-center text-xl nav__container--item"
                    :class="{ selected: visible === end }"
                    @click="scrollTo(end)"
                >
                    <div class="nav-container--item__column">
                        <div>{{ end }}</div>
                        <div>{{ score[end].home }}</div>
                        <div>{{ score[end].away }}</div>
                    </div>
                </div>
                <div
                    class="row justify-center items-center text-xl nav__container--item"
                >
                    <div class="nav-container--item__column full-width total">
                        <div class="row justify-center items-center">T</div>
                        <!-- :class="{ selected: awayTotal < homeTotal }" -->
                        <div class="row justify-center items-center">
                            {{ homeTotal }}
                        </div>
                        <!-- :class="{ selected: homeTotal < awayTotal }" -->
                        <div class="row justify-center items-center">
                            {{ awayTotal }}
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="scoreboard__score-container row no-wrap hide-scroll"
                id="scoreboard-linescore"
                ref="scroller"
            >
                <div class="start__padding col-grow" />

                <!-- <ScrollerSection>
                 
                            <LinescoreRockSelect />
                
                    </ScrollerSection> -->

                <ScrollerSection
                    @visible="setVisible(end)"
                    v-for="end in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                    :key="`end-input-${end}`"
                >
                    <!-- v-slot="{distance}" -->
                    <div
                        :id="`scoreboard-end-${end}`"
                        class="scoreboard__end-container"
                    >
                        <!-- <span style="position:absolute;">{{distance}}</span> -->
                        <LinescoreColumn
                            v-model="score[end]"
                            :visible="visible === end"
                            :endno="end"
                        />
                    </div>
                </ScrollerSection>
                <div class="start__padding col-grow" />
            </div>
        </div>
        <DialogConfirmation
            v-if="!!confirmUnsaved"
            confirmButtonText="Discard"
            cancelButtonText="Cancel"
            @confirm="toggleLineScore({ open: false })"
            @close="confirmUnsaved = false"
            cancelColor=""
            confirmColor="negative"
        >
            <!--  -->
            <!-- -->
            Are you sure you want to close? All unsaved changes will be lost.
        </DialogConfirmation>
    </DialogFloating>
</template>
<style lang="scss" scoped>
$column-width: 26vh;
$gutter-width: 20vw;
$scroll-margin: -100px;
.nav__container {
    // height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 2fr repeat(11, 1fr);
    column-gap: 1px;
    background-color: $grey-4;
    .nav__container--item {
        border-bottom: 1px solid $grey-4;
        background-color: white;
        height: 100%;
        position: relative;
        &.selected {
            background-color: #00cd93;
            color: white;
            font-weight: bold;
        }

        .nav-container--item__column {
            display: grid;
            grid-template-rows: repeat(3, 33%);
            overflow: hidden;
            height: 100%;
            &.total {
                background-color: rgba(0, 0, 0, 0.1);
            }
            > div {
                text-align: center;
            }
        }
    }
}
.scoreboard__end-row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: v-bind(opacity);
}
.scoreboard__container {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 100%;

    width: 100%;
    .scoreboard__score-container {
        height: 100%;
        scroll-snap-type: x mandatory;
        scroll-snap-stop: always;

        width: 100%;
        border-radius: 8px;
        overflow-y: hidden;
        overflow-x: auto;
        position: relative;
        .start__padding {
            width: calc(100vw / 2 - $column-width / 2);
            height: 100%;
        }
        :deep(.scoreboard__end-container) {
            scroll-snap-align: center;
            scroll-snap-stop: always;
            overflow: hidden;
            display: grid;
            min-width: $column-width;
            max-width: $column-width;
            grid-template-columns: 100%;
            grid-template-rows: repeat(2, 50%);
            row-gap: 1px;
            height: 100%;
            width: 100%;
        }
    }
}
</style>
<script setup lang="ts">
import { useEditorStore } from "@/store/editor";

import { usePlayerStore } from "@/store/players";
import {
    useScreenOrientation,
    useScroll,
    useSwipe,
    useThrottleFn,
    useWindowSize,
} from "@vueuse/core";
import { generateEnds } from "@/utils/create-game";

const confirmUnsaved = ref(false);

const root = ref(null);

const editorStore = useEditorStore();
const { toggleLineScore } = editorStore;

const visible = ref(1);

const setVisible = (index) => {
    // if (!isScrolling.value) return;
    visible.value = index;
};

const emit = defineEmits(["close"]);

const scroller = ref(null);
const { x, isScrolling } = useScroll(scroller, { behavior: "smooth" });

const { width: windowWidth } = useWindowSize();
//Temp disable
const scrollTo = (end) => {
    const e = document.getElementById(`scoreboard-end-${end}`);
    const { parentElement: ele } = e;
    x.value = ele?.offsetLeft - windowWidth.value / 4;
};

const score = ref({
    1: {
        home: 0,
        away: 0,
    },
    2: {
        home: 0,
        away: 0,
    },
    3: {
        home: 0,
        away: 0,
    },
    4: {
        home: 0,
        away: 0,
    },
    5: {
        home: 0,
        away: 0,
    },
    6: {
        home: 0,
        away: 0,
    },
    7: {
        home: 0,
        away: 0,
    },
    8: {
        home: 0,
        away: 0,
    },
    9: {
        home: 0,
        away: 0,
    },
    10: {
        home: 0,
        away: 0,
    },
});

const homeColor = ref("blue");
const awayColor = ref("red");

const homeTotal = computed(() =>
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((acc, current) => {
        return (acc += score.value[current].home);
    }, 0)
);
const awayTotal = computed(() =>
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((acc, current) => {
        return (acc += score.value[current].away);
    }, 0)
);

const homeId = ref(20);
const awayId = ref(80);

const hammerTeamId = ref(20);

const createGame = async () => {
    const client = useSupabaseClient();
    if (
        !homeId.value ||
        !awayId.value ||
        !homeColor.value ||
        !awayColor.value
    ) {
        console.error("missing fields");
        return;
    }
    const { data, error } = await client
        .from("games")
        .insert({
            home: homeId.value,
            away: awayId.value,
            home_color: homeColor.value,
            away_color: awayColor.value,
            hammer_first_end: homeId.value,
        })
        .select("id");
    if (error) {
        const { setBanner } = useBanner();
        setBanner("Error creating game", "negative");
    } else {
        const [game] = data || [];
        const { id } = game || {};
        createEnds(id);
    }
};

const createEnds = async (gameId) => {
    if (!gameId) {
        const { setBanner } = useBanner();
        setBanner("Error creating ends: no game id", "negative");
        return;
    }

    const ends = generateEnds(
        score.value,
        hammerTeamId.value,
        homeId.value,
        awayId.value,
        gameId
    );
    const client = useSupabaseClient();

    const { data, error } = await client.from("ends").insert(ends);
};

const save = async () => {
    await createGame();
    toggleLineScore({ open: false });
};

const { orientation } = useScreenOrientation();

const currentOrientation = computed(() => {
    return {
        "portrait-primary": "portrait",
        "portrait-secondary": "portrait",
        portrait: "portrait",
        "landscape-primary": "landscape",
        "landscape-secondary": "landscape",
        landscape: "landscape",
    }[orientation.value];
});

const rows = computed(() => {
    return {
        portrait: "10vh 1fr",
        landscape: "100%",
    }[currentOrientation.value];
});

const views = {
    TEAM_SELECT: "teamselect",
    LINESCORE: "linescore",
    CONFIRM: "confirm",
};

const view = ref(null);

onMounted(() => {
    const { editedGame } = editorStore.linescore;
    // if edited game, go directly to view 2: linescore input
    if (editedGame) {
        view.value = views.LINESCORE;
    } else {
        // Go to team select
        view.value = views.TEAM_SELECT;
    }
});
</script>
