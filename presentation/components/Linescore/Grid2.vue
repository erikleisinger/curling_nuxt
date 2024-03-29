<template>
    <div class="linescore-container" ref="container">
        <q-inner-loading
            :showing="(loading) && !!fetchEnabled"
        />
        <div class="linescore-row" style="order: 0">
            <div>
                <slot name="headerPrepend" />
            </div>
            <div class="linescore-row--inner">
                <div
                    v-for="num in Object.keys(score ?? {})"
                    :key="`header-${num}`"
                    class="linescore-column--item"
                    :class="{ selected: selected === num }"
                >
                    <div
                        class="overlay--clickable"
                        @click="emit('select', num)"
                    />

                    {{ num }}
                </div>
                <!-- TOTAL header -->
                <div class="linescore-column--item">T</div>
            </div>
        </div>
        <div class="linescore-row" :style="{ order: inverted ? '2' : '1' }">
            <div class="avatar-container">
                <slot name="avatarHome">
                    <TeamAvatar :teamId="home.team_id" v-if="home" :color="home.color" :hammer="hammerFirstEnd === home.team_id" />
                </slot>
            </div>
            <div class="linescore-row--inner">
                <div
                    v-for="end in Object.keys(score ?? {})"
                    :key="`homescore-${end}`"
                    class="linescore-column--item"
                    :class="{ selected: selected === Number(end) }"
                    @click="emit('select', end)"
                >
                    {{ score[end]?.home }}
                </div>
                <!-- HOME total -->
                <div class="linescore-column--item text-bold">
                    <slot name="homeScore">
                        {{ totalScore.home }}
                    </slot>
                </div>
            </div>
        </div>
        <div class="linescore-row" :style="{ order: inverted ? '1' : '2' }">
            <div class="avatar-container">
                <slot name="avatarAway">
                    <TeamAvatar :teamId="away.team_id" v-if="away" :color="away.color" :hammer="hammerFirstEnd === away.team_id" />
                </slot>
            </div>
            <div class="linescore-row--inner">
                <div
                    v-for="end in Object.keys(score ?? {})"
                    :key="`awayscore-${end}`"
                    class="linescore-column--item"
                    :class="{ selected: selected === Number(end) }"
                    @click="emit('select', end)"
                >
                    {{ score[end]?.away }}
                </div>
                <!-- AWAY total -->
                <div class="linescore-column--item text-bold">
                    <slot name="awayScore">
                        {{ totalScore.away }}
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.linescore-container {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding: 0px var(--space-sm);
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    .linescore-row {
        display: grid;
        grid-template-columns: 10% 1fr;

        .linescore-row--inner {
            display: grid;
            grid-template-columns: v-bind(columns);
            text-align: center;

            .linescore-column--item {
                width: 100%;
                height: 100%;
                margin: auto;
                @include reg-text;
                line-height: 1.5;
                @include sm {
                    font-size: 1.2rem;
                }
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 4%;
                &.selected {
                    background-color: $app-mint;
                    color: white;
                    font-weight: bold;
                }
                .overlay--clickable {
                    position: absolute;
                    width: 100%;
                    height: v-bind(overlayHeight);
                }
            }
        }

        &:nth-child(1) {
            .linescore-column--item {
                font-weight: bold;
                @include reg-text;
                line-height: 1.5;
                @include sm {
                    font-size: 1.2rem;
                }
            }
        }
    }
    .avatar-container {
        padding: 10%;
    }
}
</style>

<script setup>
import { useElementBounding } from "@vueuse/core";
import GameTeam from "@/store/models/game-team";
import Game from '@/store/models/game'
import { getGameScore } from "@/business/api/query/game"
const props = defineProps({
    gameId: [Number, null],
    editedScore: Object,
    inverted: Boolean,
    selected: Number,
});


const fetchEnabled = ref(!!props.gameId);

const {fetch} = useApi(`teamavatar-${props.teamId}`)

const {result: gameScore, loading} = fetch(getGameScore(props.gameId), {enabled: fetchEnabled})

const score = computed(() => props.editedScore || gameScore.value);

const emit = defineEmits(["select"]);

const home = computed(() =>
    useRepo(GameTeam)
        .with('team')
        .with('game')
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

const hammerFirstEnd = computed(() => useRepo(Game).with('teams').where('id', props.gameId).first()?.hammer_first_end)

const endCount = computed(() => Object.keys(score.value ?? {})?.length ?? 0);

const columns = computed(() => `repeat(${(endCount.value ?? 0) + 1}, 1fr)`);

const container = ref(null);
const { height: containerHeight } = useElementBounding(container);

const overlayHeight = computed(() => `${containerHeight.value}px`);

const totalScore = computed(() => {
    if (!Object.keys(score.value ?? {})?.length)
        return {
            home: 0,
            away: 0,
        };
    return Object.keys(score.value)?.reduce(
        (all, current) => {
            const scoreObj = score.value[current];
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
</script>
<script>
export default {
    name: "LinescoreGrid",
};
</script>
