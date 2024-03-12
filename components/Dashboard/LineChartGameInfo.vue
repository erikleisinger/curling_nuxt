<template>
    <div v-if="!isLoading" class="game-info">
        <DialogCard
            maxWidth="95vw"
            minWidth="200px"
            :titleColor="getColor(STAT_COLORS[type])"
        >
            <template v-slot:title>
                <div class="row no-wrap">
                    <div class="relative-position">
                        <h3>
                            {{ props.data?.points_for ?? 0 }}-{{
                                props.data?.points_against ?? 0
                            }}
                            {{
                                props.data?.win
                                    ? "win"
                                    : props.data?.tie
                                    ? "tie"
                                    : "loss"
                            }}
                        </h3>
                        <div class="text-caption title-caption">
                            vs.
                            <TeamChip
                                :teamId="opposition?.id"
                                :teamName="opposition?.name"
                            />
                        </div>
                    </div>
                    <div class="total-container">
                        <h2
                            :style="{ color: getColor(STAT_COLORS[type]) }"
                            style="white-space: nowrap"
                        >
                            {{ percent }}
                            <span
                                v-if="isPercent"
                                class="text-caption"
                                style="margin-left: -0.8em"
                            >
                                %
                            </span>

                            <span
                                v-if="comparisonType"
                                :style="{
                                    color: getColor(
                                        STAT_COLORS[comparisonType]
                                    ),
                                }"
                                style="font-size: 1.5rem"
                            >
                                {{ comparisonPercent }}
                                <span
                                    v-if="isComparisonPercent"
                                    class="text-caption"
                                    style="margin-left: -0.4em"
                                >
                                    %
                                </span>
                            </span>
                        </h2>
                    </div>
                </div>
            </template>

            <template v-slot:content>
                <div
                    class="row items-center"
                    :style="{ backgroundColor: getColor(STAT_COLORS[type]) }"
                ></div>

                <LinescoreGrid2 :gameId="gameId" style="padding: unset" />
            </template>
        </DialogCard>
    </div>
</template>
<style lang="scss" scoped>
.game-info {
    min-width: 200px;
    h3 {
        @include md-text;
    }
    h1 {
        @include smmd-text;
    }

    .title-caption {
        font-family: $font-family-secondary;
    }

    .footer-caption {
        margin-top: var(--space-xs);
        // text-align: right;
        font-style: italic;
    }
    .total-container {
        background-color: white;
        margin-left: var(--space-xs);
        height: 100%;
        padding: var(--space-sm);
        margin-top: calc(-1 * var(--space-sm));
        margin-right: calc(-1 * var(--space-sm));
        margin-bottom: calc(-1 * (var(--space-sm) - 0px));
        border-bottom-left-radius: 16px;
        flex-grow: 1;
        h2 {
            @include lg-text;
            text-align: center;
        }
    }
}
</style>
<script setup>
import { useQuery } from "@tanstack/vue-query";
import Team from "@/store/models/team";
import Game from "@/store/models/game";
import GameTeam from "@/store/models/game-team";
import { Stats } from "@/store/models/stats/stats";
import {
    STAT_NAMES,
    STAT_TYPES,
    STAT_COLORS,
} from "@/constants/stats";

const props = defineProps({
    comparisonType: String,
    data: Object,
    gameId: Number,
    type: String,
});

const { getColor } = useColor();

const stats = new Stats([props.data]);

const value = stats[props.type];
const comparisonValue = stats[props.comparisonType];
const percent = value?.percent;
const comparisonPercent = comparisonValue?.percent;
const isPercent = value?.isPercent || false;
const isComparisonPercent = comparisonValue?.isPercent || false;

const title = STAT_NAMES[props.type];

const game = computed(() => useRepo(Game).where("id", props.gameId).first());
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

const opposition = computed(() => {
    if (home.value?.team_id === props.data.team_id)
        return !away.value?.team?.id
            ? {
                  id: 0,
                  name: away.value?.placeholder,
              }
            : away.value?.team;
    return !home.value?.team?.id
        ? {
              id: 0,
              name: home.value?.placeholder,
          }
        : home.value?.team;
});

const goToGame = () => {
    return navigateTo(`/games/view/${props.data.game_id}?force=true`);
};
</script>
