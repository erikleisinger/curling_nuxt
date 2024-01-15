<template>
    <header>
        <h1 class="title">Game summary</h1>
        <h2 class="subtitle">
            You can optionally add a start time, rink, sheet, and league.
        </h2>
    </header>

    <div class="game-summary__container" ref="container">
        <div class="row items-center no-wrap team-row">
            <div class="avatar-container">
                <TeamAvatar
                    :teamId="selections.home?.id"
                    :color="selections.homeColor"
                    :hammer="selections.hammerFirstEndTeam === selections.home?.id"
                />
            </div>
        </div>
        <div class="column justify-center items-center" style="z-index: 1">
            <h2 class="score">
                {{ totalScore.home ?? 0 }} : {{ totalScore.away ?? 0 }}
            </h2>
        </div>
        <div class="row items-center no-wrap team-row">
            <div class="avatar-container">
                <TeamAvatar
                    :teamId="selections.away?.id"
                    :color="selections.awayColor"
                     :hammer="!selections.hammerFirstEndTeam || selections.hammerFirstEndTeam === selections.away?.id"
                />
            </div>
        </div>
        <h3 class="text-center smmd-text q-pt-md team-name">
            {{ selections.home.name }}
        </h3>

        <div
            class="full-width text-center text-caption"
            style="margin-top: -1.5em; z-index: 1"
        >
            After {{ endsPlayed }}
        </div>
        <h3 class="text-center smmd-text q-pt-md team-name">
            {{ selections.away.name }}
        </h3>
    </div>
    <q-separator />
    <LinescoreRinkAndSheet
    class="rink-and-sheet"
        :rink="selections.rink"
        :sheet="selections.sheet"
        @update:rink="selections.rink = $event"
        @update:sheet="selections.sheet = $event"
        :startTime="selections.start_time"
        @update:start_time="selections.start_time = $event"
    />
<q-separator/>
      <div class="row justify-center items-start confirm__container">
            <slot name="save"/>
        </div>

</template>
<style lang="scss" scoped>
header {
    text-align: center;
    .title {
        @include lg-text;
        padding: 0px var(--space-xxs);
    }
    .subtitle {
        padding: 0px var(--space-md);
        font-family: $font-family-secondary;
    }
    padding-top: 60px;
}

.confirm__container {
    margin: var(--space-xl) 0px;
}
.rink-and-sheet {
    margin-bottom: var(--space-lg)
}
.game-summary__container {
    display: grid;
    grid-template-columns: 30% 40% 30%;
    padding: 0px var(--space-md);

    margin: var(--space-xl) auto;

    max-width: 700px;
 

    .team-name--color {
        line-height: 1;
        font-size: 1.1rem;
    }

    .score {
        @include lg-text;
        @include sm {
            @include xl-text;
        }
    }

    .avatar-container {
        width: 100%;
        .avatar-outer__container {
            max-width: 120px;
            margin-left: auto;
            margin-right: auto;
        }
    }
}
.floating-btn {
    position: absolute;

    top: 2px;
    right: calc(-1em - 4px);
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import Game from "@/store/models/game";
import GameTeam from "@/store/models/game-team";
const props = defineProps({
    endCount: Number,
    modelValue: Object,
    saving: Boolean,
    score: Object,
});

const emit = defineEmits(["update:modelValue"]);

const selections = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

const totalScore = computed(() => {
    return Object.keys(props.score).reduce(
        (all, current) => {
            const scoreObj = props.score[current];
            return {
                home:
                    scoreObj.home === "X" ? all.home : all.home + scoreObj.home,
                away:
                    scoreObj.away === "X" ? all.away : all.away + scoreObj.away,
            };
        },
        {
            home: 0,
            away: 0,
        }
    );
});

const endsPlayed = computed(
    () => Object.values(props.score).filter(({ home }) => home !== "X")?.length
);

const { toTimezone, format } = useTime();

const dateSelectOpen = ref(false);

const { toggleGlobalSearch } = useDialogStore();

const searchRink = () => {
    toggleGlobalSearch({
        open: true,
        options: {
            inputLabel: "Search for a rink",
            resourceTypes: ["rink"],
            callback: (selection) => {
                selections.value.rink = selection;
            },
        },
    });
};

const {getColor} = useColor();
</script>
