<template>
    <div class="line-container">
        <div class="row items-center justify-between title" v-if="!dense">
            <div>
                <div class="row">
                    <h2 class="text-md q-mr-md clickable">
                        {{ BADGE_TITLES_PLAIN[badge] }}
                    </h2>

                    <q-btn
                        flat
                        round
                        icon="stacked_line_chart"
                        :color="visible ? BADGE_COLORS[badge] : 'grey-8'"
                        dense
                        @click="emit('showMore')"
                        v-if="!noDetails"
                    />
                </div>
                <h3 class="text-sm clickable">
                    {{ BADGE_DESCRIPTIONS_PLAIN[badge] }}
                </h3>
            </div>
            <div
                :style="{
                    height: BADGE_DIMENSION,
                    width: BADGE_DIMENSION,
                    position: 'relative',
                }"
            >
                <div class="badge--viewable column items-center">
                    <div class="badge-container__wrap">
                        <Badge
                            :badge="badge"
                            :height="BADGE_DIMENSION"
                            class="clickable"
                        >
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
        <Percentage
            :color="BADGE_COLORS[badge]"
            :percent="percent"
            height="16px"
            :reverse="reverse"
        >
            <!-- <div
                class="threshold-indicator"
                :style="{
                    left: reverse ? `calc(${Math.abs(BADGE_THRESHOLDS[badge] - 100)}% - 16px)` : `calc(${BADGE_THRESHOLDS[badge]}% - 16px)`,
                }"
            >
                <q-icon
                    name="arrow_drop_down"
                    dense
                    size="2em"
                    :color="BADGE_COLORS[badge]"
                />
            </div>
            <div
                class="threshold-indicator down"
                :style="{
                    left: reverse ? `calc(${Math.abs(BADGE_THRESHOLDS[badge] - 100)}% - 16px)` : `calc(${BADGE_THRESHOLDS[badge]}% - 16px)`,
                }"
            >
                <q-icon
                    name="arrow_drop_up"
                    dense
                    size="2em"
                    :color="BADGE_COLORS[badge]"
                />
            </div> -->
            <q-tooltip
                anchor="top middle"
                self="bottom middle"
                v-if="!$q.screen.xs"
            >
                {{ numerator }} out of {{ denominator }}
                {{ gameStat ? "games" : "ends" }}
            </q-tooltip>

            <template v-slot:prepend v-if="prependPercent">
                <div class="percent__container reverse">
                    {{ percent.toFixed() }}%
                </div>
            </template>
            <template v-slot:append v-else>
                <div class="percent__container">{{ percent.toFixed() }}%</div>
            </template>
        </Percentage>
    </div>
</template>

<style lang="scss">
.line-container {
    display: flex;
    flex-direction: column;
    padding: var(--space-md) 0px;
    width: 100%;
    .title {
        margin-bottom: var(--space-md);
    }
    .badge--viewable {
        transition: all 0.3s;
        position: relative;
    }

    .threshold-indicator {
        opacity: 0.5;
        position: absolute;
        top: calc(-2em + 8px);
        &.down {
            top: unset;
            bottom: calc(-2em + 8px);
        }
    }
    .percent__container {
        width: v-bind(BADGE_DIMENSION);
        display: flex;

        justify-content: center;
        font-weight: bold;
        &.reverse {
            margin-right: var(--space-xs);
        }

        &:not(.reverse) {
            margin-left: var(--space-xs);
        }
    }
}
</style>

<script setup>
import {
    BADGE_COLORS,
    BADGE_THRESHOLDS,
    BADGE_TITLES_PLAIN,
    BADGE_DESCRIPTIONS_PLAIN,
    BADGE_TITLES,
    BADGE_FORMULA_EXPLANATIONS,
    BADGE_FORMULAS,
} from "@/constants/badges";
const props = defineProps({
    badge: String,
    dense: Boolean,
    gameStat: Boolean,
    noDetails: Boolean,
    numerator: Number,
    prependPercent: Boolean,
    denominator: Number,
    reverse: Boolean,
    secondNumerator: Number,
    secondDenominator: Number,
    teamId: Number,
    twoline: Boolean,
    visible: Boolean,
});

const emit = defineEmits(["showMore"]);

const { getStatPercent } = useConvert();

const percent = getStatPercent(props.numerator, props.denominator, 0);

const BADGE_DIMENSION = "3em";

const $q = useQuasar();
</script>
