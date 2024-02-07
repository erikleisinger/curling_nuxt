<template>
    <div
        class="game-summary__container"
        ref="container"
        :class="{ stickied }"
        v-if="home?.team"
    >
        <div class="stickied-bg" :class="{ stickied }">
            <div
                :style="{ backgroundColor: getColor(home?.color) }"
                class="sticky-bg"
            />
            <div
                :style="{ backgroundColor: getColor(away?.color) }"
                class="sticky-bg"
            />
        </div>
        <div class="row items-center no-wrap team-row">
            <div class="avatar-container">
                <TeamAvatar :teamId="home?.team_id" :color="home?.color" :hammer="gameParams.hammer_first_end === home?.team_id" />
            </div>
            <div
                v-show="stickied"
                style="color: white; z-index: 1"
                data-flip-id="home-name"
                class="team-name--color"
            >
                {{ !home.team?.id ? home?.name : home?.team?.name }}
            </div>
        </div>
        <div
            class="column justify-center items-center"
            style="z-index: 1"
            :class="{ stickied }"
        >
            <h2 class="score">
                {{ home?.points_scored ?? 0 }} : {{ away?.points_scored ?? 0 }}
            </h2>
        </div>
        <div class="row items-center justify-end no-wrap team-row">
            <div
                v-show="stickied"
                style="color: white; z-index: 1"
                class="text-right team-name--color"
                data-flip-id="away-name"
            >
                {{ !away.team?.id ? away?.placeholder : away?.team?.name }}
            </div>
            <div class="avatar-container">
                <TeamAvatar :teamId="away?.team_id" :color="away?.color" :hammer="gameParams.hammer_first_end === away?.team_id || !gameParams.hammer_first_end"  />
            </div>
        </div>
        <h3
            class="text-center smmd-text q-pt-md team-name"
            :class="{ 'hide-sticky': stickied }"
            data-flip-id="home-name"
        >
            {{ !home.team?.id ? home?.placeholder : home?.team?.name }}
        </h3>

        <div
            class="full-width text-center text-caption"
            style="margin-top: -1.5em; z-index: 1"
        >
         <div v-if="conceded && !stickied">Conceded</div>
        <div :style="{color: stickied ? 'white' : getColor('slate')}">
            After {{endsPlayed}}
        </div>
       
        </div>
        <h3
            class="text-center smmd-text q-pt-md team-name"
            :class="{ 'hide-sticky': stickied }"
            data-flip-id="away-name"
        >
              {{ !away.team?.id ? away?.placeholder : away?.team?.name }}
        </h3>
    </div>
</template>
<style lang="scss" scoped>
.game-summary__container {
    display: grid;
    grid-template-columns: 30% 40% 30%;
    padding: 0px var(--space-md);
    margin: var(--space-lg) auto;
    max-width: 700px;
    position: sticky;
    top: 0;
    z-index: 2;

    &.stickied {
        padding: 0px var(--space-xs);
        .team-row {
            padding: var(--space-md) 0px;
            gap: 4px;
            font-family: $font-family-header;
        }
    }
    .team-name--color {
        line-height: 1;
        font-size: 1.1rem;
    }
    .team-name {
        width: 100%;
        overflow: hidden;
        word-break: break-word
    }

    .score {
        @include lg-text;
        @include sm {
            @include xl-text;
        }
    }

    .hide-sticky {
        visibility: hidden;
        // padding: unset;
    }

    .avatar-container {
        width: 100%;
        .avatar-outer__container {
            max-width: 120px;
            margin-left: auto;
            margin-right: auto;
        }
    }

    &.stickied {
        .avatar-container {
            width: 40px;
            min-width: 40px;
            height: 40px;
        }
    }
    .stickied-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 0;
        display: grid;
        grid-template-columns: repeat(2, 50%);
        overflow: hidden;
        height: 92px;

        .sticky-bg {
            visibility: hidden;
        }
        &.stickied {
            .sticky-bg {
                visibility: visible;
            }
        }
    }
    .stickied {
        color: white;
    }
}
</style>
<script setup>
import GameTeam from "@/store/models/game-team";
import Game from '@/store/models/game'
import { useScroll, useElementBounding } from "@vueuse/core";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

const props = defineProps({
    gameId: Number,
});

const { getColor } = useColor();

const home = computed(() =>
    useRepo(GameTeam)
        .with("team")
        .where("game_id", props.gameId)
        .offset(0)
        .first()
);
const away = computed(() =>
    useRepo(GameTeam)
        .with("team")
        .where("game_id", props.gameId)
         .offset(1)
        .first()
);
const gameParams = computed(() => useRepo(Game).where('id', props.gameId).first())
const endsPlayed = computed(() => gameParams.value?.ends_played)
const conceded = computed(() => gameParams.value?.conceded)

const container = ref(null);
const { y: containerY } = useElementBounding(container);

const stickied = ref(false);

const { y: scrollY } = useScroll(document.querySelector(`#global-container`), {
    onScroll: () => {
        setSticky();
    },
});

const $q = useQuasar();

const setSticky = () => {
    const newVal = containerY.value <= ($q.screen.xs ? 64 : 80);

    let doAnimation = false;
    let state;
    if (newVal !== stickied.value) {
        doAnimation = true;
        state = Flip.getState(
            container.value.querySelectorAll(
                ".avatar-container, .sticky-bg, .stickied-bg, .team-name, .team-name--color"
            )
        );
    }
    stickied.value = newVal;
    if (!doAnimation) return;
    nextTick(() => {
        runAnimation(state);
    });
};

const runAnimation = (state) => {
    Flip.from(state, {
        duration: 0.2,
        nested: true,
        scale: true,
        transformOrigin: "left",
    });
};
</script>
