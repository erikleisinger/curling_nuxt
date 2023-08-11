<template>
    <DialogFloating @close="toggleLineScore({ open: false })">
        <!-- <Scoreboard/> -->
        <div
            class="full-height scoreboard__container row justify-center items-center"
        >
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
                        <div class=" text-center">{{ score[end].home }}</div>
                        <div class=" text-center">{{ score[end].away }}</div>
                    </div>
                </div>
                <div
                    class="row justify-center items-center text-xl nav__container--item"
                >
                    <div class="nav-container--item__column full-width">
                        <div class="row justify-center items-center">T</div>
                        <div
                            class="row justify-center items-center"
                            :class="{ selected: awayTotal < homeTotal }"
                        >
                            {{ homeTotal }}
                        </div>
                        <div
                            class="row justify-center items-center"
                            :class="{ selected: homeTotal < awayTotal }"
                        >
                            {{ awayTotal }}
                        </div>
                    </div>
                </div>
            </div>
            <!-- hide-scroll" -->
            <div
                class="scoreboard__score-container row no-wrap"
                id="scoreboard-linescore"
                ref="scroller"
            >
               <!-- <div class="button-invis left" @click="goToEnd(-1)"></div>
                <div class="button-invis right" @click="goToEnd(1)"></div> -->
                <div class="start__padding col-grow" />
                <div
                    v-for="end in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                    :key="end"
                    :id="`scoreboard-end-${end}`"
                    class="scoreboard__end-container"
                >
                <div style="position:absolute">{{end}}</div>
                    <LinescoreColumn
                        @visible="setVisible(end)"
                        v-model="score[end]"
                    />
                </div>
                   <div class="start__padding col-grow" />
            </div>
        </div>
    </DialogFloating>
</template>
<style lang="scss">
$column-width: 26vh;
$gutter-width: 20vw;
.nav__container {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: 1px;
    background-color: $grey-4;
    // background-color: rgba(0,0,0)
    .nav__container--item {
        border-bottom: 1px solid $grey-4;
        background-color: white;
        height: 100%;
        &.selected {
            background-color: #00cd93;
            color: white;
            font-weight: bold;
        }
        .selected {
            background-color: #00cd93;
            color: white;
            font-weight: bold;
        }
        .nav-container--item__column {
            display: grid;
            grid-template-rows: repeat(3, 33%);
            overflow: hidden;
            height: 100%;
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
    grid-template-rows: auto auto;
    grid-template-columns: 100%;
    width: 100%;
    .scoreboard__score-container {
        height: calc(70 * var(--vh, 1vh));

        width: 100%;
        border-radius: 8px;
        overflow-y: hidden;
        overflow-x: hidden;
        position: relative;
        .start__padding {
            width: calc((100% - $column-width) / 2);
            height: 100%;
        }
        .button-invis {
            position: fixed;
            z-index: 1000;
            width: calc($column-width / 2);
            height: 100%;
            &.right {
right: 0;
            }
        }
        .scoreboard__end-container {
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
import { useScroll, useSwipe } from "@vueuse/core";

const root = ref(null);

const editorStore = useEditorStore();
const { toggleLineScore } = editorStore;

const visible = ref(1);

const setVisible = (index) => {
    console.log("visible: ", index);

    visible.value = index;
};

const emit = defineEmits(["close"]);

const scroller = ref(null);
const { x } = useScroll(scroller, { behavior: "smooth" });

const scrollTo = (end) => {
    console.log('go to: ', end)
    const ele = document.getElementById(`scoreboard-end-${end}`);
    console.log(ele?.offsetLeft, window.innerWidth);
    console.dir(ele)
    const toAdd = ele?.offsetLeft - ele?.offsetWidth / 2 - 16
    console.log('adding: ', toAdd, ele?.offsetLeft, ele?.offsetWidth)
    x.value = toAdd
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

const goToEnd = (inc) => {
    console.log('go: ', inc, visible.value)
    if (visible.value + inc > 11 || visible.value + inc < 1) return;
    scrollTo(visible.value + inc);
};
const headerEl = ref(null);
const { direction } = useSwipe(scroller, {
    onSwipe: () => {
        if (direction.value === "left") {
            goToEnd(1);
        } else if (direction.value === "right") {
            goToEnd(-1);
        }
    },
});
</script>
